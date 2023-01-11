# sanity-plugin-asset-source-stock-images

> This is a **Sanity Studio v3** plugin.

## What is it?

Search for photos in Pexels & Pixabay (Unsplash support is coming) and add them to your project right inside of Sanity Studio

![Stock Images interface](assets/interface.png)
![Stock Images menu](assets/menu.png)

## Installation

```sh
npm install sanity-plugin-asset-source-stock-images
```

## Usage

Import & add the image providers you want as plugins in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {pixabayStockImagesAsset, pexelsStockImagesAsset} from 'sanity-plugin-asset-source-stock-images'

export default defineConfig({
  //...
  plugins: [pixabayStockImagesAsset(), pexelsStockImagesAsset()],
})
```

## Notes

- You will be prompted for your API key on the first launch of the plugin within Sanity Studio. You can't reset the key, unless you manually edit your dataset (for now) 

## Todo

- [ ] Add infinite scrolling
- [ ] Add ability to reset api key in interface easily

## License

[MIT](LICENSE) © Silouan Wright

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
