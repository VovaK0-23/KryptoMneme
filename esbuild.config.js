import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin';
import process from 'node:process';

dotenv.config();
const args = process.argv;

const config = {
  logLevel: 'info',
  entryPoints: ['src/index.ts'],
  outdir: 'public/build/',
  bundle: true,
  define: {
    NODE_ENV: JSON.stringify(
      args.includes('--production') ? 'production' : process.env.NODE_ENV || 'production'
    ),
  },
  plugins: [
    sassPlugin({
      loadPaths: ['src'],
      filter: /\.module\.scss$/,
      transform: postcssModules({
        generateScopedName: '[hash:base64:8]--[local]',
        localsConvention: 'camelCaseOnly',
      }),
    }),
    sassPlugin({
      filter: /\.scss$/,
    }),
  ],
  publicPath: 'build',
  loader: { '.png': 'file' },
};

if (args.includes('--build')) {
  esbuild
    .build({
      ...config,
      minify: true,
      sourcemap: false,
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

if (args.includes('--start')) {
  esbuild
    .context({
      ...config,
      minify: false,
      sourcemap: true,
    })
    .then(async (ctx) => {
      await ctx.watch();
      await ctx.serve({
        servedir: 'public',
        onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
          console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
        },
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
