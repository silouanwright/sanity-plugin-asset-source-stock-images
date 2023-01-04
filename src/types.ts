import type {AssetSourceComponentProps} from 'sanity'
import {Image} from 'react-grid-gallery'

export type ImageProviderType = 'Pexels' | 'Pixabay' | 'Unsplash'

export interface AssetSourceCompPropsExtendProps extends AssetSourceComponentProps {
  /** User provided configuration to customize royalty plugin */
  config: {
    imageProvider: ImageProviderType
  }
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

export interface Page {
  allPhotos: ExtendedImage[]
  nextPage: string
}
