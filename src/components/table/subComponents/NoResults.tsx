import { Box } from '@mui/material'
import { Button } from '../../buttons/Button/Button'
import { ReactNode } from 'react'

export type NoResultsProps =
  | {
      clearFilters: () => void
      label?: string
      content?: ReactNode
      clearFilersLabel?: string
      disableClearFilters?: boolean
    }
  | {
      label?: string
      content?: ReactNode
      disableClearFilters?: boolean
    }

export const NoResults = (props: NoResultsProps) => {
  const {
    clearFilters,
    label,
    disableClearFilters,
    clearFilersLabel,
    content,
  } = {
    clearFilters: null,
    label: '',
    clearFilersLabel: null,
    disableClearFilters: null,
    ...props,
  }
  return (
    <Box>
      {content}
      {label ? label : 'No results found'}
      {!disableClearFilters && clearFilters && (
        <Button
          onClick={clearFilters}
          label={clearFilersLabel ? clearFilersLabel : 'remove all filters'}
          variant="outlined"
        />
      )}
    </Box>
  )
}
