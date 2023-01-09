import {AssetSource, definePlugin} from 'sanity'
import {Base} from './components/Base'
import {PexelsIcon, PixabayIcon} from './components/Icon'
import type {MyPluginConfig, ImageProviderType} from './types'
import slug from 'slug'

export function royaltyFreeAssetSource(imageProvider: ImageProviderType): AssetSource {
  return {
    title: imageProvider,
    name: slug(imageProvider),
    component: (all) => Base({config: {imageProvider}, ...all}),
    icon: imageProvider === 'Pexels' ? PexelsIcon : PixabayIcon,
  }
}

export const royaltyFree = definePlugin<MyPluginConfig | void>(
  (imageProvider: ImageProviderType) => {
    return {
      name: 'sanity-plugin-asset-source-royalty-free',
      form: {
        image: {
          assetSources: (prev) => {
            return [...prev, royaltyFreeAssetSource('Pexels')]
          },
        },
      },
    }
  }
)
