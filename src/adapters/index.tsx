import {ProviderData, ImageProviderType} from '../types'
import {pexelsProviderData} from './pexels'
import {pixabayProviderData} from './pixabay'

export const determineProviderData = (provider: ImageProviderType): ProviderData => {
  switch (provider) {
    case 'Pexels':
      return pexelsProviderData
    case 'Pixabay':
      return pixabayProviderData
    default:
      throw new Error('invalid provider')
  }
}
