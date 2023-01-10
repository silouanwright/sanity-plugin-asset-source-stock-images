import qs from 'qs'
import type {Page} from '../types'
import {FIRST_PAGE} from '../constants'

/**
 * `pixabay-api` package on npm is un-maintained. Not going to use it.
 * https://github.com/dderevjanik/pixabay-api/issues/8
 */

export async function fetchDataPixabay(
  pageParam: number = FIRST_PAGE,
  query: string
): Promise<Page> {
  const PIXABAY_API_KEY = '32563583-6f40618199f98cae6d45327f5'

  const data = {
    key: PIXABAY_API_KEY,
    q: query,
  }

  const stringified = qs.stringify(data)
  console.log(stringified)

  const res = await fetch(`https://pixabay.com/api/?${stringified}`)
  const json = await res.json()
  console.log('json', json)

  const allPhotos = json.hits.map((item) => {
    return {
      src: item.webformatURL,
      highResImageToUpload: item.largeImageURL,
      height: item.imageHeight,
      width: item.imageWidth,
      tags: [{title: 'blah', value: 'blah'}],
    }
  })

  return {allPhotos, nextPage: 'https://example.com?page=2'}

  // const json = await ky.get('https://pixabay.com/api/', {body: searchParams})

  // console.log(json);

  // if (isError(data)) return Promise.reject(new Error(data.error))

  // const allPhotos = data.photos.map(
  //   (item: Photo): ExtendedImage => ({
  //     src: item.src.medium,
  //     highResImageToUpload: item.src.large2x,
  //     height: item.height,
  //     width: item.width,
  //     tags: [{title: item.photographer, value: `by ${item.photographer}`}],
  //   })
  // )

  return {allPhotos, nextPage: data.next_page}
}

export const extractPagePixabay = (url: string): string | null => {
  if (url) {
    const params = url.split('?')[1]
    const parsed = qs.parse(params)
    const page = parsed.page
    if (typeof page === 'string') return page
  }
  return null
}
