import { ExtendedTheme } from '../../../theme/muiTheme'
import { SerializedThemeType } from '../../../types/serializedTheme'
import { v4 as uuid } from 'uuid'
import { serializeTheme } from './serializeTheme'

export const serializeThemes = (
  themes: ExtendedTheme[],
  project_id: string
): SerializedThemeType[] => {
  return themes?.map?.((theme) => serializeTheme(theme, project_id)) ?? []
}
