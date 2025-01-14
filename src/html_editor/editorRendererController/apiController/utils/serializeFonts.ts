import { Font } from '../../../types/Font.js'

export const serializeFont = (font: Font, project_id: string): Font => {
  return {
    project_id,
    family: font.family,
    category: font.category,
    lastmodified: font?.lastmodified ?? (font as any)?.lastModified ?? null,
    version: font.version,
    font_id: font.font_id,
  }
}
export const serializeFonts = (fonts: Font[], project_id: string): Font[] => {
  return fonts?.map?.((font) => serializeFont(font, project_id)) ?? []
}
