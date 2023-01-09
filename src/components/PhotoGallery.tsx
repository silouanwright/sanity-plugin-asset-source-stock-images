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
import {createClient, Photo, ErrorResponse} from 'pexels'
import {useInfiniteQuery} from '@tanstack/react-query'
import {Gallery} from 'react-grid-gallery'
import {PlusIcon} from 'lucide-react'
import {PexelsIcon} from './Icon'
import type {Page, AssetSourceCompPropsExtendProps, ExtendedImage} from '../types'
import {tagStyle, tagStyleTheme} from '../styles'
import qs from 'qs'

const API_KEY = '563492ad6f9170000100000149862a1244444390bd1a26feec676661'
const COUNT_PER_PAGE = 20
const FIRST_PAGE = 1

const client = createClient(API_KEY)
const manualQuery = 'Orthodox Christianity'

// We don't like "any" in TS. Not sure how to remove it from here though.
// This comes directly from the Pexels library too
export function isError(x: any): x is ErrorResponse {
  return !!x.error
}

async function fetchData({pageParam = FIRST_PAGE}) {
  const data = await client.photos
    // The API wants camelcase. What do you want from me eslint?
    // eslint-disable-next-line camelcase
    .search({query: manualQuery, per_page: COUNT_PER_PAGE, page: pageParam})
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

export function PhotoGallery({onSelect, onClose, config}: AssetSourceCompPropsExtendProps) {
  const {imageProvider} = config
  const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status} =
    useInfiniteQuery<Page, Error>({
      queryKey: ['photos'],
      queryFn: fetchData,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          const params = lastPage.nextPage.split('?')[1]
          const parsed = qs.parse(params)
          return parsed.page
        }
        return null
      },
    })

  const [query, setQuery] = useState('')
  // eslint-disable-next-line no-console
  console.log(query)

  const prefersDark = usePrefersDark()
  const scheme = prefersDark ? 'dark' : 'light'

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value)
    },
    [setQuery]
  )

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

  const buttonText = useCallback(() => {
    if (isFetchingNextPage) return 'Loading more...'
    if (hasNextPage) return 'Load More'
    return 'No more results'
  }, [hasNextPage, isFetchingNextPage])

  const flattenedPhotos = data?.pages.reduce((aggregate: ExtendedImage[], latest: Page) => {
    return aggregate.concat(latest.allPhotos)
  }, [])

  if (status === 'error' && error.message) return <p>Error: {error?.message}</p>
  return (
    <Dialog
      id="github-asset-source"
      header={
        <>
          <span style={{marginRight: 10}}>
            <PexelsIcon />
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
                onChange={handleQueryChange}
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
