export type Image = {
  _id: string
  image: typeof Image
  src: string
  fileName: string
  type: string
  edited_datetime?: string | null
  created_datetime?: string | null
}

export type ImageDb = {
  asset_id: string
  // image: typeof Image
  // src: string
  asset_filename: string
  project_id: string
  type: string
  edited_datetime?: string | null
  created_datetime?: string | null
}
