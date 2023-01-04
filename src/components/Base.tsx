import {studioTheme, ThemeProvider} from '@sanity/ui'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {PhotoGallery} from './Photos'
import type {AssetSourceCompPropsExtendProps} from '../types'

export function Base({config, ...rest}: AssetSourceCompPropsExtendProps) {
  const queryClient = new QueryClient()

  return (
    <ThemeProvider theme={studioTheme}>
      <QueryClientProvider client={queryClient}>
        <PhotoGallery config={config} {...rest} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
