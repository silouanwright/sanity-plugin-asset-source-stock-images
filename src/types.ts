import type {AssetSourceComponentProps} from 'sanity'
import {Image} from 'react-grid-gallery'
import {ReactElement} from 'react'

/** Supported providers */
export type ImageProviderType = 'Pexels' | 'Pixabay' | 'Unsplash'
export interface ProviderKeyObj {
  pexelsAPIKey: string
  pixabayAPIKey: string
}

export type SanitySecretField = {
  key: string
  title: string
  description: string
}
export interface ExtendedImage extends Image {
  // react-grid-gallery does not use this prop. We add it so that
  // we can hand it to Sanity on image selection, without needing
  // to loop through all the images later to find it.

  // We can structure the data into an object of objects by "id"
  // so that lookup is inconsequential. Something to consider for
  // later.
  highResImageToUpload: string
}

export type ProviderKeyUnion = keyof ProviderKeyObj

export interface Page {
  allPhotos: ExtendedImage[]
  nextPage: string
}
export interface ProviderData {
  apiKey: ProviderKeyUnion
  homepage: string
  ProviderIcon: () => ReactElement
  configKeys: SanitySecretField[]
  fetchData: (pageParam: number | undefined, query: string, apiKey: string) => Promise<Page>
  extractor: (url: string) => string | null
  secretKey: ProviderKeyUnion
  title: string
}

export interface GalleryUIProps {
  status: 'loading' | 'error' | 'success'
  imageProvider: ImageProviderType
  handleClose: () => void
  debounceHandler: any
  handleSelect: (index: number, image: ExtendedImage) => void
  handleFetchMore: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  noResults: boolean | ''
  flattenedPhotos: ExtendedImage[] | undefined
  setShowSettings: (bool: boolean) => void
}

/** User provided configuration */
export interface MyPluginConfig {
  imageProvider: ImageProviderType
}

export interface AssetSourceCompPropsExtendProps extends AssetSourceComponentProps {
  config: MyPluginConfig
}

export interface AssetSourceCompSuperExtendProps extends AssetSourceCompPropsExtendProps {
  apiKey: string
  setShowSettings: (bool: boolean) => void
}
