import qs from 'qs'
import {createClient, Photo, ErrorResponse} from 'pexels'
import type {Page, ExtendedImage} from '../types'
import {COUNT_PER_PAGE, FIRST_PAGE, API_KEY} from '../constants'

const client = createClient(API_KEY)

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
  pageParam: number = FIRST_PAGE,
  query: string
): Promise<Page> {
  const data = await client.photos
    // The API wants camelcase. What do you want from me eslint?
    // eslint-disable-next-line camelcase
    .search({query, per_page: COUNT_PER_PAGE, page: pageParam})
    .then((photos) => photos)

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
