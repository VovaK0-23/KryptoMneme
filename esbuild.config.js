import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin';
import fs from 'fs';
import path from 'path';

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
  entryPoints: [
    { in: 'src/index.ts', out: 'build/index' },
    { in: 'src/sw.ts', out: 'sw' },
  ],
  assetNames: '[dir]/[name]-[hash]',
  outbase: 'src',
  outdir,
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  plugins,
  loader: { '.png': 'file', '.svg': 'file' },
};

if (args.includes('--build')) {
  const publicPath = '/crypto-price';
  try {
    await esbuild.build({
      ...config,
      publicPath,
      minify: true,
      sourcesContent: false,
      define: {
        NODE_ENV: JSON.stringify('production'),
        PUBLIC_PATH: JSON.stringify(publicPath),
        SW_VERSION: JSON.stringify(Date.now().toString()),
      },
    });
    generateManifest(publicPath);
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
        PUBLIC_PATH: JSON.stringify(''),
        SW_VERSION: JSON.stringify(Date.now().toString()),
      },
    });

    await ctx.watch();
    await ctx.serve({
      servedir: 'public',
      onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
        console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
      },
    });
    generateManifest();
  } catch (err) {
    console.error('Server failed to start', err);
    process.exit(1);
  }
}

function generateManifest(startUrl = '/') {
  const files = fs.readdirSync(outdir + '/assets');

  const manifest = {
    short_name: 'crypto-price',
    name: 'crypto-price',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon',
      },
      {
        src: 'favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: 'favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: 'apple-touch-icon.png',
        sizes: '144x144',
        type: 'image/png',
      },
    ],
    start_url: startUrl,
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
    files,
  };

  // Write the manifest object to a JSON file
  const manifestPath = path.join(path.dirname('.'), outdir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Manifest generated');
}
