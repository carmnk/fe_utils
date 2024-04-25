import { Button } from '../../buttons/Button/Button'
import { ButtonType } from '../../buttons/Button'

export type NoResultsProps =
  | {
      clearFilters: () => any
      label?: string
      clearFilersLabel?: string
    }
  | {
      label?: string
      disableClearFilters?: boolean
    }

export const NoResults = (props: NoResultsProps) => {
  const { clearFilters, label, disableClearFilters, clearFilersLabel } = {
    clearFilters: null,
    label: '',
    clearFilersLabel: null,
    disableClearFilters: null,
    ...props,
  }
  return (
    <section className="no-result">
      <div>
        <img
          id="image0_1274_9403"
          width="512"
          height="512"
          src="/search_magnifier.png"
        />
      </div>
      {label ? label : 'No results found'}
      {!disableClearFilters && clearFilters && (
        <Button
          onClick={clearFilters}
          label={clearFilersLabel ? clearFilersLabel : 'remove all filters'}
          type={ButtonType.secondary}
        />
      )}
    </section>
  )
}
