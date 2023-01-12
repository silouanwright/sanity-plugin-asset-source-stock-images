import {
  Dialog,
  Box,
  Stack,
  Button,
  Spinner,
  TextInput,
  Card,
  Flex,
  usePrefersDark,
} from '@sanity/ui'
import {LockIcon, PlusIcon} from 'lucide-react'
import {useCallback} from 'react'
import {Gallery} from 'react-grid-gallery'
import {determineProviderData} from '../adapters'
import {tagStyle, tagStyleTheme} from '../styles'
import {GalleryUIProps} from '../types'

export const PhotoGalleryUI = ({
  flattenedPhotos,
  imageProvider,
  handleClose,
  debounceHandler,
  handleSelect,
  handleFetchMore,
  hasNextPage,
  isFetchingNextPage,
  noResults,
  setShowSettings,
  status,
}: GalleryUIProps) => {
  const prefersDark = usePrefersDark()
  const scheme = prefersDark ? 'dark' : 'light'
  const {ProviderIcon} = determineProviderData(imageProvider)

  const buttonText = useCallback(() => {
    if (isFetchingNextPage) return 'Loading more...'
    if (hasNextPage) return 'Load More'
    if (noResults) return 'No results for that query'
    return 'No more results'
  }, [hasNextPage, isFetchingNextPage, noResults])

  const handleOnClick = useCallback(() => {
    setShowSettings(true)
  }, [setShowSettings])

  return (
    <Dialog
      id="github-asset-source"
      header={
        <Flex justify="space-between" align="center">
          <span>
            <span style={{marginRight: 10}}>
              <ProviderIcon />
            </span>
            Select image from {imageProvider}
          </span>
          <Button
            text="API token"
            padding={2}
            fontSize={1}
            mode="bleed"
            icon={<LockIcon size={14} />}
            onClick={handleOnClick}
          />
        </Flex>
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
                onChange={debounceHandler}
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
