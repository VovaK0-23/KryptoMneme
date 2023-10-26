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
  const publicPath = '/KryptoMneme';
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
    await ctx.rebuild();
    generateManifest();
  } catch (err) {
    console.error('Server failed to start', err);
    process.exit(1);
  }
}

function generateManifest(startUrl = '/') {
  const files = fs.readdirSync(outdir + '/assets');

  const manifest = {
    start_url: startUrl,
    short_name: 'KryptoMneme',
    name: 'KryptoMneme',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#272727',
    background_color: '#272727',
    display: 'standalone',
    files,
  };

  // Write the manifest object to a JSON file
  const manifestPath = path.join(path.dirname('.'), outdir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Manifest generated');
}
