import moment from 'moment'
import { Button } from '../buttons/Button/Button'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { DropzoneInputProps, useDropzone } from 'react-dropzone'
import { mdiDeleteOutline, mdiTrayArrowDown, mdiTrayArrowUp } from '@mdi/js'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
const REQUIRED_FIELD_HELPER_TEXT = 'This field is required'

const LOADING_TEXT = 'Loading...'
const SELECT_FILE_TEXT = 'Select File..'
const SELECT_OR_DROP_FILE_TEXT = 'Select or drop file here..'

const downloadFile = (file: File & { filename?: string }) => {
  const blob = new Blob([file], { type: file.type })
  const objectURL = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectURL
  link.setAttribute('download', file.filename ? file.filename : file.name)
  document.body.appendChild(link)
  link.click()
}

export type FileUploaderSyncedFileType = {
  file?: File
  filename: string
  upload_date: string
  document_id: number
}

export type FileUploaderNewFileType = { file: File; filename: string }

export type FileUploaderProps = {
  inputId: string
  isLoading: boolean
  handleUpload: (file: File[], e: unknown, idx?: number) => void
  accept: string
  label: ReactNode
  error?: boolean
  required?: boolean
  helperText?: string
  resetFile?: (fileIdx: number) => void
  disableDelete?: boolean
  files?: (FileUploaderNewFileType | FileUploaderSyncedFileType)[]
  enableMultipleFiles?: boolean
  handleReplaceFile?: (file: File[], e: unknown, idx?: number) => void
}

export const FileUploader = (props: FileUploaderProps) => {
  const {
    inputId,
    isLoading,
    handleUpload,
    accept,
    label,
    error,
    required,
    helperText,
    resetFile,
    disableDelete,
    files,
    enableMultipleFiles,
    handleReplaceFile,
  } = props
  const theme = useTheme()

  const [userFiles, setUserFiles] = useState<{
    files: File[]
    fileIdx?: number
  }>({ files: [] })

  const onDropRejected = useCallback(() => {
    // showToast(TOASTS.documents.uploadError)
    alert('error / not yet implemented')
  }, [])

  // eslint-disable-next-line
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDropAccepted: handleUpload,
    onDropRejected,
    accept: { [accept]: [] },
    noClick: true,
  })
  const { ref: HiddenInputRef } = getInputProps<
    DropzoneInputProps & { ref: { current: HTMLInputElement } }
  >()
  const uploadFileIdx = useRef<undefined | number>()

  const errorBorderStyle = {
    border: '1px solid ' + theme.palette.error.main,
  }

  const themePrimaryTextColor = {
    color: theme.palette.primary.main,
    fontWeight: 700,
  }

  const handleDelete = async (fileIdx: number) => {
    const file = files?.[fileIdx]
    if (!file) return
    if ('document_id' in file && file?.document_id) {
      //   await deleteDocument(file?.document_id)
      alert('not yet implemented')
    }
    HiddenInputRef.current.value = ''
    resetFile?.(fileIdx)
  }

  const handleDownloadFile = useCallback(
    (fileIdx: number) => {
      const file = files?.[fileIdx]
      if (!file) return
      //   showToast(TOASTS.documents.downloading)
      if ('document_id' in file) {
        // downloadDocument({ document_id: file.document_id }, [file.document_id])
        alert('not yet implemented')
      } else if ('file' in file) {
        // es
        const downloadedFile: File = file.file
        ;(downloadedFile as File & { filename: string }).filename =
          file.filename
        downloadFile(downloadedFile)
      }
    },
    [files]
  )

  useEffect(() => {
    if (!userFiles?.files?.length) return
    if (typeof uploadFileIdx.current === 'number') {
      // currently not a possible path, just for future
      handleReplaceFile?.(userFiles.files, null, uploadFileIdx.current)
    } else {
      handleUpload(userFiles.files, null, uploadFileIdx.current)
    }
    // eslint-disable-next-line
  }, [userFiles])

  const hiddenInputProps = useMemo(() => {
    const allProps = getInputProps()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mutliple, ...restProps } = allProps as DropzoneInputProps & {
      mutliple: boolean
    }
    return restProps
  }, [getInputProps])

  return (
    <Box position="relative" width="100%">
      <Box mb="8px">
        <Typography variant="caption" htmlFor={inputId} component="label">
          {label} {required && <strong style={themePrimaryTextColor}>*</strong>}
        </Typography>
      </Box>
      <Box
        sx={{
          borderWidth: 2,
          borderRadius: '8px',
          borderColor: '#eeeeee',
          borderStyle: 'dashed',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
          px: 1,
          py: 1,
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
          ...(error ? errorBorderStyle : {}),
        }}
        {...getRootProps()}
        onClick={() => {
          HiddenInputRef?.current?.click?.()
        }}
      >
        <Stack
          alignItems="center"
          width="100%"
          height="100%"
          gap="18px"
          padding={2}
          sx={{ cursor: 'pointer' }}
        >
          <Box>
            <Button
              label={isLoading ? LOADING_TEXT : SELECT_FILE_TEXT}
              loading={isLoading}
              onClick={(e) => {
                e?.stopPropagation?.()
                HiddenInputRef?.current?.click?.()
              }}
              variant="outlined"
              // className="min-w-[195px]"
              icon={mdiTrayArrowUp}
              id={inputId + '_select'}
            />
            <input
              ref={HiddenInputRef}
              type="file"
              id={inputId}
              accept={accept}
              onChange={(e) => {
                const fileList = e.target.files
                if (!fileList) return
                setUserFiles({ files: fileList as unknown as File[] })
              }}
              style={{ visibility: 'hidden', height: 0, position: 'absolute' }}
              {...hiddenInputProps}
              multiple={enableMultipleFiles ? true : undefined}
            />
          </Box>

          <Typography
            variant="body2"
            color="primary.main"
            fontWeight={700}
            textAlign={'center'}
            sx={{ cursor: 'pointer' }}
          >
            {SELECT_OR_DROP_FILE_TEXT}
          </Typography>
        </Stack>
      </Box>
      <Stack mt="16px" gap="2px">
        {files?.map((file, fIdx) => (
          <Stack
            direction="row"
            bgcolor="#FAFAFA"
            key={fIdx}
            justifyContent="space-between"
            alignItems="center"
            px="16px"
            py="5px"
          >
            <Box>
              <Typography
                variant="body2"
                color="text.primary"
                fontWeight={700}
                textAlign={'center'}
                sx={{ cursor: 'pointer' }}
              >
                {'filename' in file
                  ? file.filename
                  : 'file' in file
                    ? (file as any).file?.name
                    : ''}
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center">
              <Box>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={700}
                  textAlign={'center'}
                  sx={{ cursor: 'pointer', paddingRight: '32px' }}
                >
                  {moment(
                    'upload_date' in file ? file.upload_date : undefined
                  ).format('DD.MM.YYYY HH:mm')}
                </Typography>
              </Box>

              <Button
                variant="text"
                iconButton={true}
                icon={mdiTrayArrowDown}
                tooltip="download file"
                onClick={() => handleDownloadFile(fIdx)}
              />
              <Button
                variant="text"
                iconButton={true}
                icon={mdiDeleteOutline}
                tooltip="delete file"
                onClick={() => handleDelete(fIdx)}
                disabled={disableDelete}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
      {error && (
        <Typography
          fontStyle="italic"
          variant="body2"
          color="text.primary"
          fontWeight={700}
          textAlign={'center'}
          sx={{ cursor: 'pointer', mt: '8px' }}
        >
          {helperText ? helperText : REQUIRED_FIELD_HELPER_TEXT}
        </Typography>
      )}
    </Box>
  )
}
