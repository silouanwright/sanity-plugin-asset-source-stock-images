import type {AssetSourceComponentProps} from 'sanity'
import {Image} from 'react-grid-gallery'
import {ReactElement} from 'react'

/** Supported providers */
export type ImageProviderType = 'Pexels' | 'Pixabay' | 'Unsplash'
export interface Foo {
  pexelsAPIKey: string
  pixabayAPIKey: string
}

export type Secrets = {
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

export type FooKeys = keyof Foo

export interface Page {
  allPhotos: ExtendedImage[]
  nextPage: string
}
export interface Blah {
  apiKey: FooKeys
  ProviderIcon: () => ReactElement
  configKeys: Secrets[]
  fetchData: (pageParam: number | undefined, query: string, apiKey: string) => Promise<Page>
  extractor: (url: string) => string | null
  secretKey: FooKeys
  title: string
}

export interface GalleryUIProps {
  imageProvider: ImageProviderType
  handleClose: () => void
  debounceHandler: any
  handleSelect: (index: number, image: ExtendedImage) => void
  handleFetchMore: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  noResults: boolean | ''
  flattenedPhotos: ExtendedImage[] | undefined
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
}
