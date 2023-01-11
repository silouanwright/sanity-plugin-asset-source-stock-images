import {AssetSource, definePlugin} from 'sanity'
import {Base} from './components/Base'
import type {MyPluginConfig, ImageProviderType} from './types'
import slug from 'slug'
import {determine} from './adapters'

export function stockImageAssetSource(imageProvider: ImageProviderType): AssetSource {
  return {
    title: imageProvider,
    name: slug(imageProvider),
    component: (all) => Base({config: {imageProvider}, ...all}),
    icon: determine(imageProvider).ProviderIcon,
  }
}

export const pixabayStockImageAsset = definePlugin<MyPluginConfig | void>(() => {
  return {
    name: 'sanity-plugin-asset-source-pixabay-stock-image',
    form: {
      image: {
        assetSources: (prev) => {
          return [...prev, stockImageAssetSource('Pixabay')]
        },
      },
    },
  }
})

export const pexelsStockImageAsset = definePlugin<MyPluginConfig | void>(() => {
  return {
    name: 'sanity-plugin-asset-source-pexels-stock-image',
    form: {
      image: {
        assetSources: (prev) => {
          return [...prev, stockImageAssetSource('Pexels')]
        },
      },
    },
  }
})
