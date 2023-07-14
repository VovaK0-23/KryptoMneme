import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin';

dotenv.config();

const outdir = 'public';
const args = process.argv;

const plugins = [
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
];

const config = {
  entryPoints: ['src/index.ts'],
  entryNames: 'build/[name]',
  assetNames: '[dir]/[name]-[hash]',
  outdir,
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  plugins,
  loader: { '.png': 'file' },
};

if (args.includes('--build')) {
  try {
    await esbuild.build({
      ...config,
      publicPath: '/crypto-price',
      minify: true,
      sourcesContent: false,
      define: {
        NODE_ENV: JSON.stringify('production'),
      },
    });
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

if (args.includes('--start')) {
  try {
    const ctx = await esbuild.context({
      ...config,
      minify: false,
      sourcesContent: true,
      define: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    });

    await ctx.watch();
    await ctx.serve({
      servedir: 'public',
      onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
        console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
      },
    });
  } catch (err) {
    console.error('Server failed to start', err);
    process.exit(1);
  }
}
