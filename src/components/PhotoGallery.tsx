import {ChangeEvent, useCallback, useState} from 'react'
import {useInfiniteQuery} from '@tanstack/react-query'
import type {Page, ExtendedImage, AssetSourceCompSuperExtendProps} from '../types'
import {debounce} from 'throttle-debounce'
import {PhotoGalleryUI} from './PhotoGalleryUI'
import {CACHE_TIME, DEFAULT_QUERY} from '../constants'
import {determine} from '../adapters'

export function PhotoGallery({onSelect, onClose, config, apiKey}: AssetSourceCompSuperExtendProps) {
  const {imageProvider} = config
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY)
  const {extractor, fetchData} = determine(imageProvider)

  const {data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery<
    Page,
    Error
  >({
    queryKey: ['photos', imageProvider, searchInput],
    queryFn: ({pageParam}) => fetchData(pageParam, searchInput, apiKey),
    enabled: !!searchInput,
    getNextPageParam: (lastPage) => {
      const url = lastPage.nextPage
      return extractor(url)
    },
    keepPreviousData: false,
    cacheTime: CACHE_TIME,
  })

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceHandler = useCallback(debounce(500, changeHandler), [setSearchInput])

  const handleSelect = useCallback(
    (_index: number, {highResImageToUpload}: ExtendedImage) => {
      onSelect([
        {
          kind: 'url',
          value: highResImageToUpload,
        },
      ])
    },
    [onSelect]
  )

  const handleFetchMore = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  const flattenedPhotos = data?.pages.reduce((aggregate: ExtendedImage[], latest: Page) => {
    return aggregate.concat(latest.allPhotos)
  }, [])

  const noResults = searchInput && flattenedPhotos?.length === 0

  if (status === 'error' && error.message) return <p>Error: {error?.message}</p>

  return (
    <PhotoGalleryUI
      flattenedPhotos={flattenedPhotos}
      imageProvider={imageProvider}
      handleClose={handleClose}
      debounceHandler={debounceHandler}
      handleSelect={handleSelect}
      hasNextPage={hasNextPage}
      handleFetchMore={handleFetchMore}
      isFetchingNextPage={isFetchingNextPage}
      noResults={noResults}
    />
  )
}
