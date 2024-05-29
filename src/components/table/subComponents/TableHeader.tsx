import { mdiArrowDownThin, mdiArrowUpThin, mdiMinus } from '@mdi/js'
import { BoxProps, Box, Tooltip, Stack, useTheme } from '@mui/material'
import { Flex } from '../../_wrapper/Flex'
import { EllipsisTextWithTooltip } from '../../basics/EllipsisTooltip'
import { Button } from '../../buttons/Button'
import { FilteredTableHeaderCell } from './../subComponents/FilteredColumns'
import { FilterType, TableProps } from '../types'

const Thead = (props: BoxProps) => <Box component="thead" {...props} />

export type TableHeaderProps = {
  columns?: TableProps['columns']
  sortings?: FilterType[]
  openFilters?: boolean[]
  handleOpenFilters?: (() => void)[]
  handleCloseFilters?: (() => void)[]
  filters?: TableProps['filters']
  handleChangeSorting: (sortkey: string) => void
  disableTableHeader?: boolean
  headerBackground?: BoxProps['bgcolor']
  selectedRows?: (string | boolean | number)[]
  onUnselectAll?: TableProps['onUnselectAllFilters']
  onSelectAll?: TableProps['onSelectAllFilters']
  handleClickSelectAll?: () => void
  onSetFilters: TableProps['onSetFilters']
}

export const TableHeader = (props: TableHeaderProps) => {
  const {
    columns,
    sortings = [],
    openFilters,
    handleOpenFilters,
    handleCloseFilters,
    filters = [],
    handleChangeSorting,
    disableTableHeader,
    headerBackground,
    selectedRows,

    onUnselectAll,
    onSelectAll,
    handleClickSelectAll,
    onSetFilters,
  } = props

  const theme = useTheme()

  return (
    <Thead position="sticky" top={0} zIndex={20} bgcolor={headerBackground}>
      <tr
        // className="border border-gray-100 border-l-[5px] h-[0px]"
        style={{ visibility: disableTableHeader ? 'hidden' : 'visible' }}
      >
        {columns?.map((col, cIdx) => {
          const sortKeyInt =
            typeof col?.renderCell === 'string' ? col?.renderCell : col?.sortKey
          const colSorting = sortings?.find((sorting) =>
            sorting?.value?.includes(sortKeyInt ?? '')
          )

          const defaultSelectedFilter = filters
            ?.filter((aparam: any) => aparam.filterKey === col?.filterKey)
            ?.map?.((aparam: any) => aparam?.value)

          return col?.isRowSelect ? (
            <Tooltip
              key={cIdx}
              title={`Markiert alle sichtbaren Zeilen. Zum markieren aller Ergebnisse, "Einträge pro Seite" auf "Alle" stellen.`}
              placement="top"
              arrow
              disableFocusListener={!onUnselectAll || !onSelectAll}
              disableHoverListener={!onUnselectAll || !onSelectAll}
              disableInteractive={!onUnselectAll || !onSelectAll}
              disableTouchListener={!onUnselectAll || !onSelectAll}
            >
              <td
                // className={'hover:bg-gray-200 ' + col?.className || ''}
                style={(col as any)?.style}
              >
                {!disableTableHeader && onUnselectAll && onSelectAll && (
                  <Flex
                    // className="relative flex items-center justify-center cursor-pointer "
                    position="relative"
                    alignItems="center"
                    // justifyContent="center"
                    // cursor="pointer"
                    sx={{ cursor: 'pointer' }}
                    onClick={handleClickSelectAll}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.125 1.54167H1.54167V0.125C0.7625 0.125 0.125 0.7625 0.125 1.54167ZM0.125 7.20833H1.54167V5.79167H0.125V7.20833ZM2.95833 12.875H4.375V11.4583H2.95833V12.875ZM0.125 4.375H1.54167V2.95833H0.125V4.375ZM7.20833 0.125H5.79167V1.54167H7.20833V0.125ZM11.4583 0.125V1.54167H12.875C12.875 0.7625 12.2375 0.125 11.4583 0.125ZM1.54167 12.875V11.4583H0.125C0.125 12.2375 0.7625 12.875 1.54167 12.875ZM0.125 10.0417H1.54167V8.625H0.125V10.0417ZM4.375 0.125H2.95833V1.54167H4.375V0.125ZM5.79167 12.875H7.20833V11.4583H5.79167V12.875ZM11.4583 7.20833H12.875V5.79167H11.4583V7.20833ZM11.4583 12.875C12.2375 12.875 12.875 12.2375 12.875 11.4583H11.4583V12.875ZM11.4583 4.375H12.875V2.95833H11.4583V4.375ZM11.4583 10.0417H12.875V8.625H11.4583V10.0417ZM8.625 12.875H10.0417V11.4583H8.625V12.875ZM8.625 1.54167H10.0417V0.125H8.625V1.54167ZM2.95833 10.0417H10.0417V2.95833H2.95833V10.0417ZM4.375 4.375H8.625V8.625H4.375V4.375Z"
                        fill={
                          selectedRows?.length === 0
                            ? 'black'
                            : theme.palette.primary.main
                        }
                        //   cn({
                        //   black: selectedRows?.length === 0,
                        //   [theme.palette.primary.main]: selectedRows?.length !== 0,
                        // })}
                      />
                    </svg>
                  </Flex>
                )}
              </td>
            </Tooltip>
          ) : col?.filterOptions && col?.filterKey && col?.getFilterValue ? (
            <FilteredTableHeaderCell
              {...col}
              key={cIdx}
              onOpen={handleOpenFilters?.[cIdx]}
              onClose={handleCloseFilters?.[cIdx]}
              open={!!openFilters?.[cIdx]}
              selectedFilter={col?.selectedFilters ?? defaultSelectedFilter}
              getIcon={col?.getIcon}
              onSetFilters={onSetFilters}
              filters={filters}
              changeSorting={handleChangeSorting}
              disableTableHeader={disableTableHeader}
            />
          ) : (
            <td key={cIdx} style={(col as any)?.style}>
              {!disableTableHeader && (
                <Tooltip arrow title={col?.headerToolTip ?? ''} placement="top">
                  <Stack direction="row" gap="2px" pr={!col?.sortKey ? 0 : 1}>
                    <Box width="100%">
                      {typeof col?.header === 'string' ? (
                        <EllipsisTextWithTooltip
                          label={col?.header ?? ''}
                          fullWidth={true}
                          useTypography={true}
                        />
                      ) : (
                        col?.header
                      )}
                    </Box>
                    {col?.sortKey && (
                      <Stack
                        justifyContent="center"
                        width="24px"
                        height="24px"
                        mt="-3px"
                        gap={1}
                      >
                        <Button
                          variant="outlined"
                          iconButton={true}
                          icon={
                            colSorting?.value.includes('asc')
                              ? mdiArrowDownThin
                              : colSorting?.value.includes('desc')
                                ? mdiArrowUpThin
                                : mdiMinus
                          }
                          name={`${sortKeyInt}`}
                          data-testid={`sort-${sortKeyInt}`}
                          onClick={() =>
                            sortKeyInt && handleChangeSorting?.(sortKeyInt)
                          }
                          // sx={{
                          //   p: '2px',
                          //   border: '1px solid rgba(51, 51, 51, 0.5)',
                          //   borderRadius: '6px',
                          //   width: 18,
                          //   height: 18,
                          //   ml: '2px',
                          // }}
                        />
                      </Stack>
                    )}
                  </Stack>
                </Tooltip>
              )}
            </td>
          )
        })}
      </tr>
    </Thead>
  )
}
