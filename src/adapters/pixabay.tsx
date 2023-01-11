import qs from 'qs'
import type {Page, ExtendedImage} from '../types'
import {COUNT_PER_PAGE} from '../constants'
import {BaseSVG} from '../components/Icon'

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

export function PixabayIcon() {
  return (
    <BaseSVG>
      <g fill="currentColor">
        <path d="M0 12v12h24V0H0v12Zm16.279-4.154c.886 1.33 1.241 1.832 1.282 1.8.028-.023.591-.854 1.251-1.846l1.196-1.795L21.268 6h1.26l-1.731 2.585a162.781 162.781 0 0 0-1.736 2.612c0 .01.873 1.246 1.939 2.742a188.567 188.567 0 0 1 1.939 2.746c0 .014-.559.023-1.242.023H20.46l-1.44-1.985c-.794-1.094-1.468-1.985-1.495-1.98-.033 0-.697.89-1.486 1.98l-1.431 1.985h-1.242c-.997 0-1.232-.014-1.214-.06.014-.033.882-1.265 1.93-2.733 1.047-1.472 1.901-2.695 1.901-2.723 0-.023-.757-1.177-1.684-2.561-.924-1.385-1.699-2.543-1.717-2.576-.028-.041.23-.055 1.213-.055h1.251l1.233 1.846Zm-7.08-1.703c1.956.397 3.563 2.003 4.033 4.034.065.29.083.55.079 1.223 0 .77-.014.9-.125 1.306-.53 1.985-1.947 3.388-3.955 3.914-.134.037-.896.065-2.193.083l-1.984.028-.014 2.132L5.03 21H3v-5.021c0-4.191.014-5.091.07-5.47.322-2.15 1.975-3.932 4.042-4.366a5.762 5.762 0 0 1 2.086 0Z" />
        <path d="M7.42 8.03c-.876.242-1.663.947-2.048 1.84-.319.73-.328.821-.35 3.099L5 15h1.721c1.93 0 1.991-.01 2.602-.353.62-.348 1.044-.831 1.35-1.537a4.82 4.82 0 0 0 .251-.73c.093-.404.102-1.321.018-1.714-.08-.383-.354-1.028-.57-1.361-.381-.58-1.036-1.068-1.647-1.23-.27-.075-1.097-.1-1.305-.045Z" />
      </g>
    </BaseSVG>
  )
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
