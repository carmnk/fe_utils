import { Image } from '../../../types'

// TODO: is it used at all???
export const serializeImages = (images: Image[], project_id: string) => {
  const imagesOut = images?.map((image) => {
    return {
      asset_id: image.asset_id,
      // image: typeof Image
      // src: string
      project_id,
      asset_filename: image.asset_filename,
      type: image.type,
      edited_datetime: image.edited_datetime,
      created_datetime: image.created_datetime,
    }
  })
//   const imageFiles = images
//     ?.filter((img) => (img as typeof img & { _upload: boolean })._upload)
//     ?.map((image) => {
//       return {
//         asset_id: image.asset_id,
//         image: image.image as unknown as File,
//         // image: includeBase64Images && image.image
//         //   ? toBase64(image.image as any)
//         //   : (image.image as any),
//         // src: string
//         //   asset_filename: image.asset_filename,
//       }
//     })
  return { images: imagesOut, imageFiles:[] }
}
