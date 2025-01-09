import { Image } from '../../../types'

export const deserializeImages = (
  imagesIn: Omit<Image, 'image' | 'src'>[],
  editorStateImages: Image[],
  project_id: string
): Image[] => {
  const imagesOut = imagesIn?.map?.((image) => ({
    image: null as any,
    src: '',
    project_id: project_id,
    ...(editorStateImages?.find?.((img) => img.asset_id === image.asset_id) ??
      {}),
    asset_id: image.asset_id,
    type: image.type,
    asset_filename: image.asset_filename,
    created_datetime: image.created_datetime ?? null,
    edited_datetime: image.edited_datetime ?? null,
    // src:
  }))

  return imagesOut
}
