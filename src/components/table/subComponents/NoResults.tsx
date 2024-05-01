import { Button } from '../../buttons/Button/Button'

export type NoResultsProps =
  | {
      clearFilters: () => any
      label?: string
      content?: React.ReactNode
      clearFilersLabel?: string
      disableClearFilters?: true
    }
  | {
      label?: string
      content?: React.ReactNode
      disableClearFilters?: true
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
    <section className="no-result">
      {content}
      {label ? label : 'No results found'}
      {!disableClearFilters && clearFilters && (
        <Button
          onClick={clearFilters}
          label={clearFilersLabel ? clearFilersLabel : 'remove all filters'}
          variant="outlined"
        />
      )}
    </section>
  )
}
