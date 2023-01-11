import {SettingsView} from '@sanity/studio-secrets'
import type {ImageProviderType} from '../types'
import {determine} from '../adapters'

export const namespace = 'stockImageAssets'

export type Secrets = {
  cloudName: string
  apiKey: string
  description: string
}

type Props = {
  onClose: () => void
  imageProvider: ImageProviderType
}

export const SecretsConfigView = ({onClose, imageProvider}: Props) => {
  const {title, configKeys} = determine(imageProvider)
  return <SettingsView title={title} namespace={namespace} keys={configKeys} onClose={onClose} />
}
