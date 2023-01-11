import {AssetSource, definePlugin} from 'sanity'
import {Base} from './components/Base'
import type {MyPluginConfig, ImageProviderType} from './types'
import {determine} from './adapters'

export function stockImageAssetSource(imageProvider: ImageProviderType): AssetSource {
  return {
    title: imageProvider,
    // Add slug utility here when provider names get more complex
    name: imageProvider.toLowerCase(),
    component: (all) => Base({config: {imageProvider}, ...all}),
    icon: determine(imageProvider).ProviderIcon,
  }
}

export const pixabayStockImagesAsset = definePlugin<MyPluginConfig | void>(() => {
  return {
    name: 'sanity-plugin-asset-source-pixabay-stock-images',
    form: {
      image: {
        assetSources: (prev) => {
          return [...prev, stockImageAssetSource('Pixabay')]
        },
      },
    },
  }
})

export const pexelsStockImagesAsset = definePlugin<MyPluginConfig | void>(() => {
  return {
    name: 'sanity-plugin-asset-source-pexels-stock-images',
    form: {
      image: {
        assetSources: (prev) => {
          return [...prev, stockImageAssetSource('Pexels')]
        },
      },
    },
  }
})
