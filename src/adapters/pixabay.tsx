import qs from 'qs'
import type {Page, ExtendedImage} from '../types'
import {COUNT_PER_PAGE} from '../constants'

interface PixabayPhoto {
  webformatURL: string
  largeImageURL: string
  imageHeight: number
  imageWidth: number
  user: string
}

export const secretPixabayConfig = {
  key: 'pixabayAPIKey',
  title: 'Enter your secret API key. Docs are located at https://pixabay.com/api/docs/',
  description: 'nice description!',
}

export async function fetchDataPixabay(
  pageParam: number = 1,
  query: string,
  apiKey: string
): Promise<Page> {
  const data = {
    key: apiKey,
    q: query,
    // The API wants camelcase. What do you want from me eslint?
    // eslint-disable-next-line camelcase
    per_page: COUNT_PER_PAGE,
    page: pageParam,
  }

  const stringified = qs.stringify(data)

  const res = await fetch(`https://pixabay.com/api/?${stringified}`)
  const json = await res.json()

  const allPhotos = json.hits.map((item: PixabayPhoto): ExtendedImage => {
    return {
      src: item.webformatURL,
      highResImageToUpload: item.largeImageURL,
      height: item.imageHeight,
      width: item.imageWidth,
      tags: [{title: item.user, value: `by ${item.user}`}],
    }
  })

  const pageNumber = Number(pageParam)
  const incrementPage = pageNumber + 1
  const stringifyPage = incrementPage.toString()
  const isMore = pageNumber * COUNT_PER_PAGE < json.totalHits

  return {allPhotos, nextPage: isMore ? stringifyPage : ''}
}

export const extractPagePixabay = (url: string): string | null => {
  if (url === '') return null
  return url
}
