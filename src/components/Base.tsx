import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {PhotoGallery} from './PhotoGallery'
import {useSecrets} from '@sanity/studio-secrets'
import type {AssetSourceCompPropsExtendProps, ProviderKeyObj} from '../types'
import {SecretsConfigView, namespace} from './SecretsConfigView'
import {useCallback, useEffect, useState} from 'react'
import {determineProviderData} from '../adapters'

export function Base({config, ...rest}: AssetSourceCompPropsExtendProps) {
  const queryClient = new QueryClient()
  const [showSettings, setShowSettings] = useState(false)
  const {secrets} = useSecrets<ProviderKeyObj>(namespace)
  const {apiKey} = determineProviderData(config.imageProvider)

  // Without setTimeout, secrets will be undefined, which will cause the modal
  // to show, even if the API key is available. setTimeout puts it on the
  // queue, and it generally always seems available then
  useEffect(() => {
    setTimeout(() => {
      if (secrets) {
        // eslint-disable-next-line no-console
        console.log(secrets)
        if (!secrets[apiKey]) {
          setShowSettings(true)
        }
      }
    }, 1)
  }, [secrets, showSettings, apiKey])

  const handleOnClose = useCallback(() => {
    setShowSettings(false)
  }, [])

  return (
    <>
      {showSettings && (
        <SecretsConfigView imageProvider={config.imageProvider} onClose={handleOnClose} />
      )}
      {!showSettings && secrets && secrets[apiKey] && (
        <QueryClientProvider client={queryClient}>
          <PhotoGallery config={config} apiKey={secrets[apiKey]} {...rest} />
        </QueryClientProvider>
      )}
    </>
  )
}
