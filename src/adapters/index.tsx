import {PexelsIcon, PixabayIcon} from '../components/Icon'
import {Blah, ImageProviderType} from '../types'
import {extractPagePexels, fetchDataPexels, secretPexelsConfig} from './pexels'
import {extractPagePixabay, fetchDataPixabay, secretPixabayConfig} from './pixabay'

export const determine = (provider: ImageProviderType): Blah => {
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
