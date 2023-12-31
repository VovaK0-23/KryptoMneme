# KryptoMneme

KryptoMneme is a tool for tracking cryptocurrency prices. It allows users to monitor and stay updated with the latest prices of various cryptocurrencies.

## License

KryptoMneme is open-source and available under the MIT License. Contributions are welcomed and encouraged.

## Installation

To start the development server, you need to have `npm` installed. Run the following commands:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

## Deploy

Deploy to gh-pages:

```bash
npm run deploy
```

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request.

## Support

If you encounter any issues or have questions, please feel free to open an issue on the [GitHub repository](https://github.com/VovaK0-23/KryptoMneme).

## Noteworthy Project Details

### Customizing the manifest.json

The `manifest.json` file is automatically generated by esbuild. If you need to make changes to it, you can do so by opening the `esbuild.config.js` file and modifying the `manifest` object within that configuration file.

This was implemented to dynamically add assets to the manifest file, enabling features such as service worker precaching and Progressive Web App (PWA) functionality.
