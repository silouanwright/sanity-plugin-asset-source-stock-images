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
import {PexelsIcon} from './Icon'
import type {Page, AssetSourceCompPropsExtendProps, ExtendedImage} from '../types'
import {tagStyle, tagStyleTheme} from '../styles'
import {extractPagePexels} from '../adapters/pexels'
import {debounce} from 'throttle-debounce'
import {fetchDataPexels} from '../adapters/pexels'

export function PhotoGallery({onSelect, onClose, config}: AssetSourceCompPropsExtendProps) {
  const {imageProvider} = config
  const [query, setQuery] = useState('')
  const {data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery<
    Page,
    Error
  >({
    queryKey: ['photos', query],
    queryFn: ({pageParam}) => fetchDataPexels(pageParam, query),
    enabled: !!query,
    getNextPageParam: (lastPage) => {
      const url = lastPage.nextPage
      return extractPagePexels(url)
    },
    keepPreviousData: true,
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
