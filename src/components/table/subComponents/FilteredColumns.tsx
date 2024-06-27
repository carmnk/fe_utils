import { ChangeEvent, Dispatch, KeyboardEvent, MouseEvent } from 'react'
import { SetStateAction, forwardRef, useCallback } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Popover, Stack } from '@mui/material'
import { Tooltip, Typography, MenuItem } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import Icon from '@mdi/react'
import { mdiArrowDownThin, mdiArrowUpThin, mdiCheck } from '@mdi/js'
import { mdiFilter, mdiLock, mdiMinus } from '@mdi/js'
import { Button } from '../../buttons/Button/Button'
import {
  FilteredTableHeaderCellProps as FilteredTableHeaderCellPropsIn,
  FilterType,
} from '../types'
import TextField from '../../inputs/TextField'

export interface FilteredTableHeaderCellProps
  extends FilteredTableHeaderCellPropsIn {
  // dynmic props
  onOpen?: () => void
  onClose?: () => void
  open: boolean
  selectedFilter?: string[]
  filters: FilterType[]
  onSetFilters?: (allValues: { value: string; filterKey: string }[]) => void
  changeSorting: (filterKey: string) => void
  // misc
  disableTableHeader?: boolean // not required anymore?
}

export const FilteredTableHeaderCell = forwardRef(
  (props: FilteredTableHeaderCellProps, ref: any) => {
    const {
      onOpen,
      onClose,
      open,
      selectedFilter,
      filterOptions = [],
      header = '',
      getIcon,
      getItemLabel,
      getFilterValue,
      renderFilterKey,
      filterKey,
      additionalFilterKeys,
      filters,
      isFilterLocked,
      sortKey,
      headerToolTip,
      onSetFilters,
      changeSorting,
      disableTableHeader,
    } = props

    const [searchValue, setSearchValue] = useState('')
    const initialFilters = useRef(selectedFilter)
    const initialAllFilters = useRef(filters)
    const filteredOptions = useMemo(() => {
      return !searchValue
        ? filterOptions
        : filterOptions?.filter((opt) =>
            (getItemLabel?.(opt)?.toLowerCase() || '').includes(
              searchValue.toLowerCase()
            )
          )
    }, [searchValue, filterOptions, getItemLabel])

    const handleOnFilter = useCallback(
      (val: any, key: any) => {
        const value = getFilterValue?.(val)
        if (value === undefined) return
        const keyAdj = renderFilterKey ? renderFilterKey(key, value) : key
        if (
          selectedFilter &&
          selectedFilter.length > 0 &&
          selectedFilter.includes(value)
        ) {
          const filteredAllFilters = filters.filter(
            (item) => item.value !== value
          )

          // setFilters(filteredAllFilters)
          onSetFilters?.(filteredAllFilters)
        } else {
          // setFilters((current) => [...current, { value, filterKey: keyAdj }])
          onSetFilters?.([...filters, { value, filterKey: keyAdj }])
        }
      },
      [getFilterValue, selectedFilter, filters, renderFilterKey, onSetFilters]
    )

    const handleSearchValueChange = useCallback(
      (newValue: string, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as any
        // console.debug('value', value)
        if (!value && value !== '' && value !== 0) return
        setSearchValue(value)
      },
      []
    )

    useEffect(() => {
      if (!open) {
        setSearchValue('')
        return
      }
      initialFilters.current = selectedFilter
      initialAllFilters.current = filters
    }, [open]) // only when open changes!

    const anchor = useRef(null)

    const handleToggleOpen = useCallback(() => {
      if (isFilterLocked) return
      if (open) onClose?.()
      else onOpen?.()
    }, [open, onOpen, onClose, isFilterLocked])

    const clearFilter = useCallback(() => {
      // setFilters((current) =>
      //   current.filter(
      //     (filter) =>
      //       ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
      //         filter?.filterKey
      //       )
      //   )
      // )
      onSetFilters?.(
        filters.filter(
          (filter) =>
            ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
              filter?.filterKey
            )
        )
      )
    }, [filterKey, additionalFilterKeys, filters, onSetFilters])

    const selectAll = useCallback(() => {
      if (!filterKey) return
      // setFilters((current) => [
      //   ...current.filter(
      //     (filter) =>
      //       ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
      //         filter?.filterKey
      //       ) || additionalFilterKeys?.includes?.(filter?.filterKey)
      //   ),
      //   ...(filterOptions?.map((opt) => ({
      //     value: getFilterValue?.(opt) ?? '',
      //     filterKey: renderFilterKey
      //       ? renderFilterKey(filterKey, getFilterValue?.(opt))
      //       : filterKey,
      //   })) ?? []),
      // ])
      onSetFilters?.([
        ...filters.filter(
          (filter) =>
            ![filterKey, ...(additionalFilterKeys ?? [])]?.includes?.(
              filter?.filterKey
            ) || additionalFilterKeys?.includes?.(filter?.filterKey)
        ),
        ...(filterOptions?.map((opt) => ({
          value: getFilterValue?.(opt) ?? '',
          filterKey: renderFilterKey
            ? renderFilterKey(filterKey, getFilterValue?.(opt))
            : filterKey,
        })) ?? []),
      ])
    }, [
      filterOptions,
      filterKey,
      getFilterValue,
      additionalFilterKeys,
      renderFilterKey,
      filters,
      onSetFilters,
    ])

    const handleResetFilter = useCallback(() => {
      // setFilters?.(initialAllFilters.current)
      onSetFilters?.(initialAllFilters.current)
      onClose?.()
    }, [onClose, onSetFilters])

    const handleKeyUpMenuItem = useCallback(
      (e: KeyboardEvent, item: any) => {
        if (e?.type !== 'keyup' || e?.key !== 'Enter') return
        handleOnFilter?.(item, filterKey)
      },
      [handleOnFilter, filterKey]
    )
    const handleClickMenuItem = useCallback(
      (e: MouseEvent, item: any) => {
        if (e?.type === 'keydown') return
        handleOnFilter?.(item, filterKey)
      },
      [handleOnFilter, filterKey]
    )

    // filter for the first item on Enter
    const handleKeyUpSearchField = useCallback(
      (e: KeyboardEvent) => {
        // if (e?.sourceEvent === 'onClear') {
        //   setSearchValue('')
        // }
        if (
          e?.type !== 'keyup' ||
          e?.key !== 'Enter' ||
          filteredOptions?.length > 1
          // ||
          // e?.sourceEvent === 'onClear'
        )
          return
        // console.debug('filteredOptions', filteredOptions, filterKey)
        handleOnFilter?.(filteredOptions?.[0], filterKey)
      },
      [filteredOptions, handleOnFilter, filterKey]
    )
    const sortings = useMemo(
      () => filters?.filter((filter) => filter?.filterKey?.includes('sorting')),

      [filters]
    )
    const colSorting = sortings?.find((sorting) =>
      sorting?.value?.includes(sortKey ?? '')
    )

    const handleChangeSorting = useCallback(
      (e: MouseEvent<HTMLButtonElement> & { target: { name: string } }) => {
        e?.stopPropagation?.()
        if (!sortKey) return
        changeSorting(sortKey)
      },
      [changeSorting, sortKey]
    )

    return (
      <>
        <Tooltip
          arrow
          title={!disableTableHeader && headerToolTip ? headerToolTip : ''}
          placement="top"
        >
          <td
            style={
              !isFilterLocked && selectedFilter && selectedFilter.length > 0
                ? { background: '#E5E5E5' }
                : {}
            }
            onClick={handleToggleOpen}
            ref={anchor}
            data-testid={`filter-${filterKey}`}
          >
            {!disableTableHeader && (
              <Stack
                alignItems="center"
                height="24px"
                mt="-3px"
                direction="row"
                gap={1}
                pr={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  flexGrow={
                    header || !(!isFilterLocked && !selectedFilter?.length)
                      ? 1
                      : 0
                  }
                  minWidth={0}
                  flexBasis={0}
                  pl={header ? 0 : 0.5}
                >
                  {!isFilterLocked &&
                    selectedFilter &&
                    selectedFilter.length > 0 && (
                      <Icon path={mdiFilter} size={1} color="#000" />
                    )}
                  {header && (
                    <Typography
                      fontWeight={
                        !isFilterLocked &&
                        selectedFilter &&
                        selectedFilter.length > 0
                          ? 700
                          : undefined
                      }
                    >
                      {header}
                    </Typography>
                  )}
                </Stack>

                {!!sortKey && (
                  <Button
                    variant="outlined"
                    iconButton={true}
                    name={sortKey}
                    data-testid={`sort-${sortKey}`}
                    onClick={handleChangeSorting}
                    icon={
                      colSorting?.value.includes('asc')
                        ? mdiArrowDownThin
                        : colSorting?.value.includes('desc')
                          ? mdiArrowUpThin
                          : mdiMinus
                    }
                  />
                )}
                {!!isFilterLocked && (
                  <Button variant="text" iconButton icon={mdiLock} disabled />
                )}

                {!isFilterLocked && !selectedFilter?.length && (
                  <Button
                    variant="outlined"
                    iconButton={true}
                    data-testid={`filter-btn-${filterKey}`}
                    name={filterKey}
                    icon={mdiFilter}
                  />
                )}
              </Stack>
            )}
          </td>
        </Tooltip>
        {open && !isFilterLocked && (
          <Popover
            data-testid={`filter-${filterKey}-popover`}
            anchorEl={anchor.current}
            open={!!open}
            onClose={onClose}
            sx={{
              height: 380,
              minWidth: 270,
            }}
            PaperProps={{ sx: { minWidth: 270, minHeight: 415 } }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className="relative">
              <Box sx={{ p: 2 }}>
                <Stack direction="row" gap={2}>
                  <Button variant="text" onClick={selectAll}>
                    Select All filters
                  </Button>
                  <Button variant="text" onClick={clearFilter}>
                    Remove all filters
                  </Button>
                </Stack>
                <div>
                  <TextField
                    fullWidth={true}
                    value={searchValue}
                    onChange={handleSearchValueChange as any}
                    // InputProps={{ sx: { background: '#fafafa' } }}
                    autoFocus={true}
                    onKeyUp={handleKeyUpSearchField}
                    slotProps={{
                      inputContainer: { sx: { background: '#fafafa' } },
                    }}
                  />
                </div>
              </Box>
              <div
                style={{
                  height: 220,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {filteredOptions &&
                  filteredOptions.length > 0 &&
                  filteredOptions.map((item, idx) => (
                    <MenuItem
                      tabIndex={0}
                      onClick={(e) => handleClickMenuItem?.(e, item)}
                      onKeyUp={(e) => handleKeyUpMenuItem(e, item)}
                      key={idx}
                      sx={{
                        borderBottom: '1px solid #efefef',
                        height: 55,
                      }}
                    >
                      <ListItemIcon>
                        <div className="flex items-center">
                          {selectedFilter &&
                            selectedFilter.length > 0 &&
                            selectedFilter.includes(getFilterValue!(item)) && (
                              <Icon path={mdiCheck} size={1} color="#5FC086" />
                            )}
                          <div className="pr-2">
                            {getIcon && getIcon?.(item)}
                          </div>
                        </div>
                      </ListItemIcon>

                      <Typography>
                        {getItemLabel && (
                          <div
                            className={
                              selectedFilter &&
                              selectedFilter.length > 0 &&
                              getFilterValue?.(item) &&
                              selectedFilter.includes(getFilterValue?.(item))
                                ? 'font-bold'
                                : ''
                            }
                          >
                            {getItemLabel(item)}
                          </div>
                        )}
                      </Typography>
                    </MenuItem>
                  ))}
              </div>
            </div>
            <Stack
              direction="row"
              position="absolute"
              width="100%"
              px={2}
              bottom={0}
              right={0}
              alignItems="center"
              justifyContent="flex-end"
              style={{ height: 75, gap: 24 }}
            >
              <Button
                variant="text"
                sx={{ height: 33 }}
                onClick={() => {
                  handleResetFilter?.()
                  onClose?.()
                }}
              >
                Cancel
              </Button>{' '}
              <Button
                sx={{ pl: 1, pr: 2 }}
                onClick={() => {
                  onClose?.()
                }}
              >
                Ok
              </Button>
            </Stack>
          </Popover>
        )}
      </>
    )
  }
)
FilteredTableHeaderCell.displayName = 'FilteredTableHeaderCell'
