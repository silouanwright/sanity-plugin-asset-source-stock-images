import {ProviderData, ImageProviderType} from '../types'
import {extractPagePexels, fetchDataPexels, secretPexelsConfig, PexelsIcon} from './pexels'
import {extractPagePixabay, fetchDataPixabay, secretPixabayConfig, PixabayIcon} from './pixabay'

export const determineProviderData = (provider: ImageProviderType): ProviderData => {
  switch (provider) {
    case 'Pexels':
      return {
        configKeys: [secretPexelsConfig],
        fetchData: fetchDataPexels,
        extractor: extractPagePexels,
        ProviderIcon: PexelsIcon,
        apiKey: 'pexelsAPIKey',
        title: 'Pexels Access',
        secretKey: 'pexelsAPIKey',
      }
    case 'Pixabay':
      return {
        configKeys: [secretPixabayConfig],
        fetchData: fetchDataPixabay,
        extractor: extractPagePixabay,
        ProviderIcon: PixabayIcon,
        apiKey: 'pixabayAPIKey',
        title: 'Pexels Access',
        secretKey: 'pixabayAPIKey',
      }
    default:
      throw new Error('invalid provider')
  }
}
