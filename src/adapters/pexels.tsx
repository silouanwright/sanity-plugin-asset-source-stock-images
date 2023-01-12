import qs from 'qs'
import {createClient, Photo, ErrorResponse} from 'pexels'
import type {Page, ExtendedImage, ProviderData} from '../types'
import {COUNT_PER_PAGE} from '../constants'
import {BaseSVG} from '../components/Icon'

let client: any

// We don't like "any" in TS. Not sure how to remove it from here though.
// This comes directly from the Pexels library too
export function isError(x: any): x is ErrorResponse {
  return !!x.error
}

export const extractPagePexels = (url: string): string | null => {
  if (url) {
    const params = url.split('?')[1]
    const parsed = qs.parse(params)
    const page = parsed.page
    if (typeof page === 'string') return page
  }
  return null
}

export async function fetchDataPexels(
  pageParam: number = 1,
  query: string,
  apiKey: string
): Promise<Page> {
  client = client || createClient(apiKey)
  const data = await client.photos
    // The API wants camelcase. What do you want from me eslint?
    // eslint-disable-next-line camelcase
    .search({query, per_page: COUNT_PER_PAGE, page: pageParam})
    .then((photos: Photo[]) => photos)

  if (isError(data)) return Promise.reject(new Error(data.error))

  const allPhotos = data.photos.map(
    (item: Photo): ExtendedImage => ({
      src: item.src.medium,
      highResImageToUpload: item.src.large2x,
      height: item.height,
      width: item.width,
      tags: [{title: item.photographer, value: `by ${item.photographer}`}],
    })
  )

  return {allPhotos, nextPage: data.next_page}
}

export function PexelsIcon() {
  return (
    <BaseSVG>
      <path
        fill="currentColor"
        d="M4.314 2.011 4 2.026l.003 9.938c.003 5.466.006 9.96.009 9.987.003.046.484.049 5.498.049h5.493L15 19.278c-.003-2.463.003-2.726.045-2.738.045-.012.134-.03.296-.064.9-.174 2.039-.71 2.861-1.353a8.272 8.272 0 0 0 1.244-1.253c.215-.284.505-.71.505-.747 0-.012.024-.058.057-.1.087-.126.308-.57.428-.86.239-.586.424-1.247.487-1.738.009-.076.024-.17.03-.214.063-.371.063-1.408 0-1.768-.006-.042-.021-.137-.03-.213a1.735 1.735 0 0 0-.036-.198.875.875 0 0 1-.024-.137c-.012-.113-.122-.534-.224-.857a8.257 8.257 0 0 0-.724-1.579c-.12-.198-.547-.79-.69-.957a7.332 7.332 0 0 0-1.564-1.366c-.114-.073-.236-.152-.27-.17a9.237 9.237 0 0 0-.983-.476 7.392 7.392 0 0 0-1.51-.403 5.952 5.952 0 0 0-.792-.064c-.568-.021-9.37-.033-9.792-.012Zm9.956 2.875c.057.009.174.027.255.036.083.013.176.028.209.037l.128.027c.18.037.65.217.888.339a4.406 4.406 0 0 1 2.09 2.231c.111.253.225.6.249.75.006.049.027.14.041.201.1.39.09 1.208-.017 1.72-.368 1.759-1.738 3.146-3.424 3.472-.377.073-.604.088-1.582.091l-.906.004v5.35h-.484c-.52.003-4.428.003-4.733 0h-.188v-7.128c0-3.92.006-7.136.012-7.142.02-.019 7.343-.006 7.462.012Z"
      />
    </BaseSVG>
  )
}

export const pexelsProviderData: ProviderData = {
  fetchData: fetchDataPexels,
  extractor: extractPagePexels,
  ProviderIcon: PexelsIcon,
  homepage: 'https://www.pixabay.com',
  apiKey: 'pexelsAPIKey',
  secretKey: 'pexelsAPIKey',
  title: 'Enter your Pexels API token',
  configKeys: [
    {
      key: 'pexelsAPIKey',
      title: 'https://www.pexels.com/api/',
      description:
        'Editors generally should not touch this field. An incorrectly modified token can break the plugin.',
    },
  ],
}
