export type Image = {
  _id: string
  image: typeof Image
  src: string
  fileName: string
  type: string
}

export type ImageDb = {
  asset_id: string
  // image: typeof Image
  // src: string
  asset_filename: string
  project_id: string
  type: string
}
