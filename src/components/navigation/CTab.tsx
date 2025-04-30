import Icon from '@mdi/react'
import {
  Tab,
  Stack,
  Tooltip,
  Badge,
  Typography,
  useTheme,
  TabProps,
  TooltipProps,
  TypographyProps,
} from '@mui/material'
import { CSSProperties, MouseEvent, ReactNode } from 'react'
import { FlexProps } from '../_wrapper'
import { IconProps } from '@mdi/react/dist/IconProps'

export const CTab = (props: {
  key?: string | number
  disabled?: boolean
  value: string | number
  tooltip?: string
  icon?: string
  badge?: string
  label?: ReactNode
  badgeColor?: string
  badgeProps?: any
  sx?: any
  activeValue: string | number
  activeTabSlotProps?: {
    tab?: TabProps
    tooltip?: Partial<TooltipProps>
    tabInnerContainer?: FlexProps
    icon?: Partial<IconProps>
    typography?: TypographyProps
  }
  inactiveTabSlotProps?: {
    tab?: TabProps
    tooltip?: TooltipProps
    tabInnerContainer?: FlexProps
    icon?: IconProps
    typography?: TypographyProps
  }
  tabVariant?: 'text' | 'outlined' | 'filled'
  activeTabStyles?: CSSProperties
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}) => {
  const {
    activeValue,
    activeTabSlotProps,
    inactiveTabSlotProps,
    tabVariant,
    activeTabStyles,
    key,
    onClick,
    tooltip,
    icon,
    disabled,
    badge,
    value,
    label,
    badgeColor,
    badgeProps,
    sx,
  } = props

  const theme = useTheme()

  const isTabActive = activeValue === value
  const tabSlotProps = isTabActive ? activeTabSlotProps : inactiveTabSlotProps

  const tabStyles = {
    p: 0,
    minWidth: 40,
    minHeight: 32,
    transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    opacity: 1,
    color: disabled
      ? 'text.disabled'
      : isTabActive && tabVariant === 'filled'
        ? theme.palette.primary.contrastText
        : undefined,
    overflow: 'visible',
    // ...injectTabBorders,
    ...((sx as CSSProperties) ?? {}),
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
    <Tab
      key={key}
      disabled={disabled}
      value={value}
      label={
        <Tooltip
          title={tooltip ?? ''}
          placement="top"
          arrow
          {...(tabSlotProps?.tooltip ?? {})}
        >
          <Badge
            badgeContent={badge}
            color={badgeColor as 'primary'}
            slotProps={{
              badge: {
                style: {
                  padding: 0,
                  fontSize: '0.75rem !important',
                  zIndex: 10000,
                },
                ...(badgeProps ?? {}),
              },
            }}
          >
            <Stack
              direction="row"
              gap={0}
              alignItems="center"
              {...(tabSlotProps?.tabInnerContainer ?? {})}
            >
              {icon && typeof icon === 'string' && (
                <Icon
                  path={icon}
                  size={1}
                  style={{ marginLeft: label ? '8px' : 0 }}
                  {...(tabSlotProps?.icon ?? {})}
                />
              )}

              {label ? (
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
                  {label}
                </Typography>
              ) : (
                (null as any)
              )}
            </Stack>
          </Badge>
        </Tooltip>
      }
      onClick={onClick}
      {...(tabSlotProps?.tab ?? {})}
      sx={tabStyles}
    />
  )
}
