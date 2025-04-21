import { ReactNode, useMemo } from 'react'

import Icon from '@mdi/react'
import {
  Avatar,
  Chip,
  ChipProps,
  darken,
  Palette,
  useTheme,
} from '@mui/material'
import { CommonComponentPropertys } from '../../componentProperty'
import { mdiClose } from '@mdi/js'
import { Button } from '../../../../components'

export type CChipProps = ChipProps & {
  icon?: string
} & CommonComponentPropertys

export type ChipWrapperProps = Omit<ChipProps, 'deleteIcon'> & {
  icon?: string
  iconColor?: string
  avatarInitials?: string
  avatarBgColor?: string
  avatarImage?: string
  deleteIcon?: string
} & CommonComponentPropertys & {
    rootInjection: ReactNode
  }
export const ChipWrapper = (props: ChipWrapperProps) => {
  const theme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    rootInjection,
    label,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    children,
    appController,
    editorStateUi,
    assets,
    id,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    avatarInitials,
    avatarBgColor,
    avatarImage: avatarImageAssetId,
    deleteIcon,
    iconColor,
    ...rest
  } = props

  const { images } = assets

  const labelComponent = (
    <>
      {label}
      {rootInjection}
    </>
  )

  const avatarColorSx = useMemo(() => {
    const potentialThemeColorPath = avatarBgColor
      ? avatarBgColor?.split('.')
      : []
    const themeColor =
      potentialThemeColorPath.length === 2
        ? theme.palette[potentialThemeColorPath?.[0] as 'primary']?.[
            potentialThemeColorPath?.[1] as 'main'
          ]
        : null
    return {
      bgcolor: themeColor
        ? themeColor + ' !important'
        : avatarBgColor
          ? avatarBgColor + ' !important'
          : 'inherit',
    }
  }, [avatarBgColor, theme])
  const avatarImageSrc = useMemo(() => {
    const assetImage = images.find((img) => img.asset_id === avatarImageAssetId)
    if (!assetImage) {
      return undefined
    }
    return assetImage?.src
  }, [images, avatarImageAssetId])

  const paletteColor = useMemo(
    () =>
      rest?.color &&
      (theme.palette?.[
        rest?.color as keyof typeof theme.palette
      ] as Palette['primary']),
    [rest?.color, theme]
  )

  const iconColorAdj = useMemo(() => {
    const potentialThemeColorPath = iconColor ? iconColor?.split('.') : []
    const themeColor =
      potentialThemeColorPath.length === 2
        ? theme.palette[potentialThemeColorPath?.[0] as 'primary']?.[
            potentialThemeColorPath?.[1] as 'main'
          ]
        : null
    return themeColor ? themeColor : iconColor
  }, [iconColor, theme])

  return (
    <Chip
      {...rest}
      label={labelComponent}
      avatar={
        avatarInitials || avatarImageAssetId ? (
          <Avatar sx={avatarColorSx} src={avatarImageSrc}>
            {!avatarImageSrc && avatarInitials}
          </Avatar>
        ) : undefined
      }
      deleteIcon={
        <Button
          iconButton
          icon={deleteIcon ?? mdiClose}
          iconSize={'16px'}
          size="small"
          sx={
            paletteColor?.contrastText
              ? {
                  background: paletteColor?.contrastText,
                  borderRadius: 9999,
                  height: 20,
                  width: 20,
                  '&:hover': {
                    background:
                      darken(paletteColor?.contrastText, 0.2) + ' !important',
                  },
                  // padding: 2,
                }
              : undefined
          }
          iconColor={paletteColor?.main}
        ></Button>
      }
      icon={
        !avatarInitials && !avatarImageAssetId && props?.icon ? (
          <Icon
            path={props.icon}
            size={'20px'}
            style={{ marginLeft: '8px' }}
            color={iconColorAdj}
          ></Icon>
        ) : undefined
      }
    ></Chip>
  )
}
