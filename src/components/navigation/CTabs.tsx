import { CSSProperties, Ref, ReactNode, MouseEvent } from 'react'
import { useMemo } from 'react'
import {
  BadgeProps,
  BoxProps,
  TabProps,
  TooltipProps,
  TypographyProps,
} from '@mui/material'
import { useTheme, TabsProps } from '@mui/material'
import { Tabs as MTabs } from '@mui/material'
import { FlexProps } from '../_wrapper'
import { IconProps } from '@mdi/react/dist/IconProps'
import { CTab } from './CTab'

export type CTabsProps = Omit<TabsProps, 'onChange' | 'value' | 'slotProps'> & {
  value: string
  onChange?: (value: string) => void
  items: {
    value: string
    label?: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: string
    sx?: BoxProps['sx']
    isInitialValue?: boolean
    badge?: string
    badgeColor?: string
    badgeProps?: BadgeProps
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

  // tabs
  const TabIndicatorProps = useMemo(() => {
    return disableIndicator
      ? { sx: { display: 'none', overflowY: 'visible' } }
      : undefined
  }, [disableIndicator])

  const tabsSx = useMemo(() => {
    return {
      ...(sx ?? {}),
      borderBottom: disableBorderBottom
        ? undefined
        : '1px solid ' + theme.palette.divider,
      minHeight: 32,
      my: 1,
    }
  }, [disableBorderBottom, theme, sx])

  // tab
  const {
    activeTab: activeTabSlotProps,
    inactiveTab: inactiveTabSlotProps,
    ...tabsSlotProps
  } = useMemo(() => slotProps ?? {}, [slotProps])

  const activeTabStyles: CSSProperties = useMemo(() => {
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
      ...(tabStyles as any),
      ...(activeTabStylesIn as any),
    }
  }, [theme, activeTabStylesIn, tabVariant, activeTabFilledColor])

  const handleChangeTab = useMemo(() => {
    return (
      items?.map?.((item) => (_e: MouseEvent<HTMLElement>) => {
        onChange?.(item.value)
      }) ?? []
    )
  }, [items, onChange])

  return (
    <MTabs
      ref={ref}
      TabIndicatorProps={TabIndicatorProps}
      value={value}
      indicatorColor={indicatorColor}
      centered={centered}
      scrollButtons={scrollButtons}
      textColor={textColor}
      visibleScrollbar={visibleScrollbar}
      {...rest}
      sx={tabsSx}
      slotProps={tabsSlotProps}
    >
      {items?.map?.((item, iIdx) => {
        return (
          <CTab
            key={iIdx as any}
            disabled={item?.disabled}
            value={item.value}
            label={item.label}
            icon={item?.icon}
            badge={item?.badge}
            badgeColor={item?.badgeColor}
            badgeProps={item?.badgeProps}
            sx={item?.sx}
            tooltip={item?.tooltip}
            activeValue={value}
            activeTabSlotProps={activeTabSlotProps}
            inactiveTabSlotProps={inactiveTabSlotProps}
            tabVariant={tabVariant}
            activeTabStyles={activeTabStyles}
            onClick={handleChangeTab?.[iIdx]}
          />
        )
      }) ?? null}
      {rootInjection}
    </MTabs>
  )
}
