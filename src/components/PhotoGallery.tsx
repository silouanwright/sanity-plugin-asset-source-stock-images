import {ChangeEvent, useCallback, useState} from 'react'
import {
  Dialog,
  Box,
  Stack,
  Button,
  usePrefersDark,
  Spinner,
  TextInput,
  Card,
  Flex,
} from '@sanity/ui'
import {useInfiniteQuery} from '@tanstack/react-query'
import {Gallery} from 'react-grid-gallery'
import {PlusIcon} from 'lucide-react'
import {PexelsIcon, PixabayIcon} from './Icon'
import type {
  Page,
  AssetSourceCompPropsExtendProps,
  ExtendedImage,
  ImageProviderType,
} from '../types'
import {tagStyle, tagStyleTheme} from '../styles'
import {fetchDataPexels, extractPagePexels} from '../adapters/pexels'
import {fetchDataPixabay, extractPagePixabay} from '../adapters/pixabay'
import {debounce} from 'throttle-debounce'

export const determineProvider = (provider: ImageProviderType) => {
  switch (provider) {
    case 'Pexels':
      return fetchDataPexels
    case 'Pixabay':
      return fetchDataPixabay
    default:
      throw new Error('invalid provider')
  }
}

export const determineExtractor = (provider: ImageProviderType) => {
  switch (provider) {
    case 'Pexels':
      return extractPagePexels
    case 'Pixabay':
      return extractPagePixabay
    default:
      throw new Error('invalid provider')
  }
}

export const determineIcon = (provider: ImageProviderType) => {
  switch (provider) {
    case 'Pexels':
      return PexelsIcon
    case 'Pixabay':
      return PixabayIcon
    default:
      throw new Error('invalid provider')
  }
}

export function PhotoGallery({onSelect, onClose, config}: AssetSourceCompPropsExtendProps) {
  const {imageProvider} = config
  const [query, setQuery] = useState('')
  const fetchDataFromProvider = determineProvider(imageProvider)
  const extractPageFromProvider = determineExtractor(imageProvider)
  const MediaProviderIcon = determineIcon(imageProvider)

  const {data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery<
    Page,
    Error
  >({
    queryKey: ['photos', query],
    queryFn: ({pageParam}) => fetchDataFromProvider(pageParam, query),
    enabled: !!query,
    getNextPageParam: (lastPage) => {
      const url = lastPage.nextPage
      return extractPageFromProvider(url)
    },
    keepPreviousData: true,
    cacheTime: 1 * 1440 * (60 * 1000), // a day (seconds in minute x milliseconds + amount)
  })

  const prefersDark = usePrefersDark()
  const scheme = prefersDark ? 'dark' : 'light'

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const secret = useCallback(debounce(500, changeHandler), [setQuery])

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

  const buttonText = useCallback(() => {
    if (isFetchingNextPage) return 'Loading more...'
    if (hasNextPage) return 'Load More'
    if (query && flattenedPhotos?.length === 0) return 'No results for that query'
    return 'No more results'
  }, [hasNextPage, isFetchingNextPage, query, flattenedPhotos])

  if (status === 'error' && error.message) return <p>Error: {error?.message}</p>
  return (
    <Dialog
      id="github-asset-source"
      header={
        <>
          <span style={{marginRight: 10}}>
            <MediaProviderIcon />
          </span>
          Select image from {imageProvider}
        </>
      }
      onClose={handleClose}
      width={4}
      open
    >
      <>
        <div
          style={{
            position: 'sticky',
            top: '0',
            zIndex: 1,
          }}
        >
          <Card>
            <Box padding={3}>
              <TextInput
                label={`Search ${imageProvider}.com`}
                placeholder="Search for free photos"
                onChange={secret}
                marginHeight={2}
                marginWidth={2}
              />
            </Box>
          </Card>
        </div>
        <Stack>
          {status === 'loading' || !flattenedPhotos ? (
            <Box padding={6}>
              <Flex justify="center">
                <Spinner muted />
              </Flex>
            </Box>
          ) : (
            <>
              <Gallery
                images={flattenedPhotos}
                tagStyle={{...tagStyle, ...tagStyleTheme[scheme]}}
                onSelect={handleSelect}
              />
              <Box padding={3}>
                <Stack>
                  <Button
                    onClick={handleFetchMore}
                    disabled={!hasNextPage || isFetchingNextPage}
                    fontSize={2}
                    icon={PlusIcon}
                    mode="ghost"
                    padding={3}
                    text={buttonText()}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </>
    </Dialog>
  )
}
