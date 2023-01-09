import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {PhotoGallery} from './PhotoGallery'
import type {AssetSourceCompPropsExtendProps} from '../types'

export function Base({config, ...rest}: AssetSourceCompPropsExtendProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PhotoGallery config={config} {...rest} />
    </QueryClientProvider>
  )
}
