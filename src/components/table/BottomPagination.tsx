import { ReactNode, useCallback, useMemo } from 'react'
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import { Button } from '../buttons/Button/Button'
import { Grid } from '../_wrapper/Grid'

const defaultItemsPerPageOptions = [
  { value: 2, label: '2 (dev)' },
  { value: 20 },
  { value: 50 },
  { value: 100 },
  // { value: 99999, label: 'ALL' },
]
const additionalDesktopItemsPerPageOptions = [{ value: 99999, label: 'ALL' }]

export type BottomPaginationType = {
  number: number
  pageNumber: number
  changePage: (newpage: number) => void
  changeSize: (newSize: number) => void
  itemPerPage: number | 'ALL'
  label?: ReactNode
  // disableContainer?: boolean
  // disablePaginationSizeInLocalStorage?: boolean
  // itemsPerPageStorageKey: string
}

const calculatePagesCount = (pageSize: number, totalCount: number) => {
  // we suppose that if we have 0 items we want 1 empty page
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize)
}

export const BottomPagination = (props: BottomPaginationType) => {
  const {
    number,
    pageNumber,
    changePage,
    changeSize,
    itemPerPage,
    label,
    // disablePaginationSizeInLocalStorage,
    // itemsPerPageStorageKey,
  } = props
  const theme = useTheme()
  const isDesktopViewport = useMediaQuery(theme.breakpoints.up('xl'))
  const itemsPerPageAdj = itemPerPage === 'ALL' ? number : itemPerPage

  const arrowButtonStyles = useMemo(
    () => ({
      border:
        theme?.palette?.mode === 'light'
          ? '1px solid #21252933'
          : '1px solid #cccccc66',
    }),
    [theme]
  )

  const handleChangePage = useCallback(
    (size: number) => {
      // if (!disablePaginationSizeInLocalStorage) {
      //   const current =
      //     JSON?.parse?.(localStorage?.getItem?.('userSettings') || '{}') || {}
      //   const newPrefs = {
      //     paginationSize: {
      //       ...current?.paginationSize,
      //       [itemsPerPageStorageKey]: size === number ? 100 : size,
      //     },
      //   }
      //   localStorage.setItem('userSettings', JSON.stringify(newPrefs))
      // }
      changeSize(size)
      changePage(1)
    },
    [changePage, changeSize]
  )

  const handlePageChange2 = useMemo(() => {
    return (
      defaultItemsPerPageOptions?.map?.(
        (item) => () => handleChangePage(item.value)
      ) ?? []
    )
  }, [handleChangePage])

  const handlePageChangeDesktop = useMemo(() => {
    return (
      additionalDesktopItemsPerPageOptions?.map?.(
        (item) => () => handleChangePage(item.value)
      ) ?? []
    )
  }, [handleChangePage])

  const handleChangePageBackwards = useCallback(() => {
    changePage(pageNumber - 1)
  }, [changePage, pageNumber])

  const handleChangePageForwards = useCallback(() => {
    changePage(pageNumber + 1)
  }, [changePage, pageNumber])

  return (
    <div>
      <div>
        <Grid
          gridTemplateColumns={'auto auto auto'}
          justifyItems={'center'}
          justifyContent={'space-between'}
          alignItems={'center'}
          height={'100%'}
          mr={'auto'}
          ml={'auto'}
          pt={1}
        >
          <Stack direction="row" gap={1} alignItems="center">
            <Typography>Einträge pro Seite:</Typography>

            <Stack direction="row" gap={1} alignItems="center">
              {defaultItemsPerPageOptions.map((item, iIdx) => (
                <Button
                  size="small"
                  onClick={handlePageChange2?.[iIdx]}
                  variant={
                    itemsPerPageAdj === item.value ? 'contained' : 'outlined'
                  }
                >
                  {item.label ?? item.value}
                </Button>
              ))}
              {!!isDesktopViewport &&
                additionalDesktopItemsPerPageOptions.map((item, iIdx) => (
                  <Button
                    size="small"
                    onClick={handlePageChangeDesktop?.[iIdx]}
                    variant={
                      itemsPerPageAdj === item.value ? 'contained' : 'outlined'
                    }
                  >
                    {item.label ?? item.value}
                  </Button>
                ))}
            </Stack>
          </Stack>
          <Stack direction="row" gap={1} alignItems="center">
            <Button
              variant="text"
              iconButton={true}
              icon={mdiArrowLeft}
              onClick={handleChangePageBackwards}
              disabled={pageNumber === 1}
              sx={arrowButtonStyles}
              // color={
              //   pageNumber === 1
              //     ? theme?.palette?.action?.disabled ?? 'action.disabled'
              //     : 'primary'
              // }
            />

            <Typography>
              Seite {pageNumber} /{' '}
              {calculatePagesCount(itemsPerPageAdj, number)}{' '}
            </Typography>

            <Button
              variant="text"
              iconButton={true}
              icon={mdiArrowRight}
              onClick={handleChangePageForwards}
              disabled={
                pageNumber === calculatePagesCount(itemsPerPageAdj, number)
              }
              sx={arrowButtonStyles}
              // color={
              //   pageNumber === calculatePagesCount(itemsPerPageAdj, number)
              //     ? theme?.palette?.action?.disabled ?? 'action.disabled'
              //     : 'primary'
              // }
            />
          </Stack>
          <Stack direction="row">
            {typeof label === 'object' ? (
              label
            ) : (
              <Typography>{label}</Typography>
            )}
          </Stack>
        </Grid>
      </div>
    </div>
  )
}
