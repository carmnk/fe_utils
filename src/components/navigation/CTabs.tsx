import { ForwardedRef, ReactNode, forwardRef, useMemo } from 'react'
import {
  Stack,
  Tab,
  TabsProps,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { Tabs as MTabs } from '@mui/material'
import Icon from '@mdi/react'

export type CTabsProps = {
  value: string
  onChange: (value: string) => void
  items: {
    value: string
    label: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: string
  }[]

  disableIndicator?: boolean
  indicatorColor?: 'primary' | 'secondary'
  centered?: boolean
  scrollButtons?: 'auto' | false | true
  textColor?: 'primary' | 'secondary' | 'inherit'
  variant?: 'standard' | 'scrollable' | 'fullWidth'
  visibleScrollbar?: boolean
  disableBorderBottom?: boolean
  useTabBorders?: boolean
  sx?: TabsProps['sx']
  rootInjection?: ReactNode
}

export const Tabs = forwardRef(
  (props: CTabsProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      value,
      onChange,
      items,
      disableIndicator,
      indicatorColor,
      centered,
      scrollButtons,
      textColor,
      visibleScrollbar,
      disableBorderBottom,
      useTabBorders,
      sx,
      rootInjection,
    } = props
    const theme = useTheme()

    const activeTabStyles = useMemo(
      () => ({
        // borderTop: '1px solid ' + theme.palette.divider,
        // borderLeft: '1px solid ' + theme.palette.divider,
        // borderRight: '1px solid ' + theme.palette.divider,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }),
      [theme]
    )

    const handleChangeTab = useMemo(() => {
      return (
        items?.map((item) => () => {
          onChange?.(item.value)
        }) ?? []
      )
    }, [items, onChange])

    const TabIndicatorProps = useMemo(() => {
      return disableIndicator ? { sx: { display: 'none' } } : undefined
    }, [disableIndicator])

    const injectTabBorders = useMemo(
      () =>
        useTabBorders
          ? {
              border: '1px solid #99999966',
              borderBottom: 0,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }
          : {},
      [useTabBorders]
    )

    return (
      <MTabs
        ref={ref}
        sx={{
          ...(sx ?? {}),
          borderBottom: disableBorderBottom
            ? undefined
            : '1px solid ' + theme.palette.divider,
          minHeight: 32,
          my: 1,
        }}
        TabIndicatorProps={TabIndicatorProps}
        value={value}
        indicatorColor={indicatorColor}
        centered={centered}
        scrollButtons={scrollButtons}
        textColor={textColor}
        visibleScrollbar={visibleScrollbar}
      >
        {items?.map?.((item, iIdx) => (
          <Tab
            key={iIdx}
            sx={{
              p: 0,
              minWidth: 40,
              minHeight: 32,
              transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              opacity: 1,
              ...injectTabBorders,
              ...(item.value === value ? activeTabStyles : {}),
            }}
            disabled={item?.disabled}
            value={item.value}
            label={
              <Tooltip title={item.tooltip ?? ''}>
                <Stack direction="row" gap={0} alignItems="center">
                  {item?.icon && (
                    <Icon
                      path={item.icon}
                      size={'16px'}
                      color={
                        item.value === value
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary
                      }
                      style={{ marginLeft: '8px' }}
                    />
                  )}
                  <Typography
                    component="span"
                    textTransform="none"
                    minWidth={40}
                    fontWeight={800}
                    // color="text.primary"
                    lineHeight={'1em'}
                    p={0.5}
                    color={
                      item?.disabled
                        ? 'text.disabled'
                        : item.value === value
                          ? 'primary.contrastText'
                          : 'text.primary'
                    }
                  >
                    {item.label}
                  </Typography>
                </Stack>
              </Tooltip>
            }
            onClick={handleChangeTab?.[iIdx]}
          />
        )) ?? null}
        {rootInjection}
      </MTabs>
    )
  }
)
Tabs.displayName = 'CTabs'
