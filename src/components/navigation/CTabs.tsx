import { CSSProperties, Ref, ReactNode } from 'react'
import { useMemo } from 'react'
import {
  Badge,
  BoxProps,
  Stack,
  Tab,
  TabProps,
  TooltipProps,
  TypographyProps,
} from '@mui/material'
import { Tooltip, Typography, useTheme, TabsProps } from '@mui/material'
import { Tabs as MTabs } from '@mui/material'
import Icon from '@mdi/react'
import { FlexProps } from '../_wrapper'
import { IconProps } from '@mdi/react/dist/IconProps'

export type CTabsProps = Omit<TabsProps, 'onChange' | 'value' | 'slotProps'> & {
  value: string
  onChange?: (value: string) => void
  items: {
    value: string
    label: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: string
    sx?: BoxProps['sx']
    isInitialValue?: boolean
    badge?: string
    badgeColor?: string
  }[]

  disableIndicator?: boolean
  indicatorColor?: 'primary' | 'secondary'
  centered?: boolean
  scrollButtons?: 'auto' | false | true
  textColor?: 'primary' | 'secondary' | 'inherit'
  variant?: 'standard' | 'scrollable' | 'fullWidth'
  tabVariant?: 'text' | 'outlined' | 'filled'
  activeTabFilledColor?: string

  visibleScrollbar?: boolean
  disableBorderBottom?: boolean
  // useTabBorders?: boolean
  sx?: TabsProps['sx']
  rootInjection?: ReactNode
  activeTabStylesIn?: TabProps['sx']
  ref?: Ref<HTMLDivElement>
  slotProps?: TabsProps['slotProps'] & {
    activeTab?: {
      tab?: TabProps
      tooltip?: Partial<TooltipProps>
      tabInnerContainer?: FlexProps
      icon?: Partial<IconProps>
      typography?: TypographyProps
    }
    inactiveTab?: {
      tab?: TabProps
      tooltip?: TooltipProps
      tabInnerContainer?: FlexProps
      icon?: IconProps
      typography?: TypographyProps
    }
  }
}

export const Tabs = (props: CTabsProps) => {
  const {
    value,
    onChange,
    items,
    disableIndicator,
    indicatorColor,
    centered,
    scrollButtons,
    textColor = 'inherit',
    visibleScrollbar,
    disableBorderBottom,
    // useTabBorders,
    sx,
    activeTabStylesIn,
    rootInjection,
    tabVariant = 'filled',
    activeTabFilledColor,
    ref,
    slotProps,
    ...rest
  } = props
  const theme = useTheme()

  const {
    activeTab: activeTabSlotProps,
    inactiveTab: inactiveTabSlotProps,
    ...tabsSlotProps
  } = slotProps ?? {}

  const activeTabStyles = useMemo(() => {
    const tabStyles =
      tabVariant === 'filled'
        ? {
            background: activeTabFilledColor ?? theme.palette.primary.main,
            color: activeTabFilledColor
              ? '#333'
              : theme.palette.primary.contrastText,
          }
        : tabVariant === 'outlined'
          ? {
              border: '1px solid #99999966',
              borderBottom: 0,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              background: 'transparent',
            }
          : {
              background: 'transparent',
            }
    return {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      ...tabStyles,
      ...activeTabStylesIn,
    }
  }, [theme, activeTabStylesIn, tabVariant, activeTabFilledColor])

  const handleChangeTab = useMemo(() => {
    return (
      items?.map?.((item) => () => {
        onChange?.(item.value)
      }) ?? []
    )
  }, [items, onChange])

  const TabIndicatorProps = useMemo(() => {
    return disableIndicator
      ? { sx: { display: 'none', overflowY: 'visible' } }
      : undefined
  }, [disableIndicator])

  return (
    <MTabs
      // TabScrollButtonProps={{ sx: { overflowY: 'visible' } }}
      ref={ref}
      TabIndicatorProps={TabIndicatorProps}
      value={value}
      indicatorColor={indicatorColor}
      centered={centered}
      scrollButtons={scrollButtons}
      textColor={textColor}
      visibleScrollbar={visibleScrollbar}
      {...rest}
      sx={{
        ...(sx ?? {}),
        borderBottom: disableBorderBottom
          ? undefined
          : '1px solid ' + theme.palette.divider,
        minHeight: 32,
        my: 1,
      }}
      slotProps={tabsSlotProps}
    >
      {items?.map?.((item, iIdx) => {
        const { icon: _i, ...restItem } = item ?? {}
        const isTabActive = item.value === value
        const tabSlotProps = isTabActive
          ? activeTabSlotProps
          : inactiveTabSlotProps

        const tabStyles = {
          p: 0,
          minWidth: 40,
          minHeight: 32,
          transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          opacity: 1,
          color: item?.disabled
            ? 'text.disabled'
            : isTabActive && tabVariant === 'filled'
              ? theme.palette.primary.contrastText
              : undefined,

          // ...injectTabBorders,
          ...((item?.sx as CSSProperties) ?? {}),
          ...(isTabActive
            ? activeTabStyles
            : tabVariant === 'outlined'
              ? {
                  border: '1px solid #99999966',
                  borderBottom: 0,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  background: 'transparent',
                }
              : {}),
          ...(tabSlotProps?.tab?.sx ?? {}),
        }

        return (
          <Badge
            key={iIdx}
            badgeContent={item?.badge}
            color={item?.badgeColor as 'primary'}
            slotProps={{
              badge: { style: { padding: 0, fontSize: '0.75rem !important' } },
            }}
          >
            <Tab
              {...(restItem ?? {})}
              disabled={item?.disabled}
              value={item.value}
              label={
                <Tooltip
                  title={item.tooltip ?? ''}
                  placement="top"
                  arrow
                  {...(tabSlotProps?.tooltip ?? {})}
                >
                  <Stack
                    direction="row"
                    gap={0}
                    alignItems="center"
                    {...(tabSlotProps?.tabInnerContainer ?? {})}
                  >
                    {item?.icon && (
                      <Icon
                        path={item.icon}
                        size={'16px'}
                        // color={
                        //   item.value === value
                        //     ? theme.palette.primary.contrastText
                        //     : theme.palette.text.primary
                        // }
                        style={{ marginLeft: '8px' }}
                        {...(tabSlotProps?.icon ?? {})}
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
                      color={'inherit'}
                      {...(tabSlotProps?.typography ?? {})}
                    >
                      {item.label}
                    </Typography>
                  </Stack>
                </Tooltip>
              }
              onClick={handleChangeTab?.[iIdx]}
              {...(tabSlotProps?.tab ?? {})}
              sx={tabStyles}
            />
          </Badge>
        )
      }) ?? null}
      {rootInjection}
    </MTabs>
  )
}
