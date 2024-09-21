import { CSSProperties, PropsWithChildren, ReactNode, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import {
  AvatarProps as MAvatarProps,
  Avatar as MAvatar,
  TypographyProps,
  TooltipProps,
} from '@mui/material'
import { Tooltip, Typography } from '@mui/material'

export type AvatarProps = Omit<MAvatarProps, 'title' | 'slotProps'> & {
  size?: CSSProperties['width']
  fullName?: string
  fontSize?: CSSProperties['fontSize']
  disableInitials?: boolean
  customTooltip?: ReactNode
  bgColor?: string
  slotProps?: MAvatarProps['slotProps'] & {
    typography?: TypographyProps
    tooltip?: TooltipProps
  }
  borderRadius?: CSSProperties['borderRadius']
}

/** Simple composite component building on top of mui's
 * [Avatar](https://mui.com/material-ui/react-avatar/) component
 * <br/><br/>Additional features:
 * - convenience props for size, bgColor, color, fontSize, fullName
 * - display initials when no image is provided and !disableInitials (future: maybe outsource initialsFn)
 * - display tooltip with customTooltip or fallback fullName, to disableTooltip set customTooltip to ""<br/>
 * - props: additional to [Mui' Avatar Props](https://mui.com/material-ui/api/avatar/) <br/>
 * @prop size - size of the avatar (all size dimensions ?)<br/>
 * @prop children - Unformated text content to display in the avatar - PRECEEDS fullName<br/>
 * @prop fullName - full name of the user to display as initials (initial letter of first and last word) in the avator or tooltip<br/>
 * @prop fontSize - font size of the initials<br/>
 * @prop disableInitials - disable initials display<br/>
 * @prop customTooltip - custom tooltip to display<br/>
 * @prop bgColor - background color of the avatar
 * @prop color - color of the initials<br/>
 * @prop slotProps - additional slotProps for typography, tooltip and mui's img <br/>
 */
export const Avatar = (props: PropsWithChildren<AvatarProps>) => {
  const {
    size = 32,
    src,
    fullName,
    style,
    fontSize,
    disableInitials,
    customTooltip,
    bgColor,
    color,
    children,
    slotProps,
    borderRadius,
    ...rest
  } = props
  const { typography, tooltip, ...muiSlotProps } = slotProps ?? {}

  const fontSizeAdj = typeof fontSize === 'number' ? fontSize + 'px' : fontSize

  const avatarStyles = useMemo(
    () => ({
      borderRadius,
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: bgColor || undefined,
      ...(!fullName || disableInitials ? { '& svg': { color } } : {}),
      ...style,
      ...(rest?.sx ?? {}),
    }),
    [
      size,
      style,
      rest?.sx,
      bgColor,
      color,
      fullName,
      disableInitials,
      borderRadius,
    ]
  )

  const initials = useMemo(() => {
    const segments = fullName?.split?.(' ')
    return typeof fullName === 'string'
      ? segments?.length === 1
        ? fullName
        : segments?.length
          ? (segments?.[0]?.slice?.(0, 1)?.[0] ?? '') +
            (segments?.[segments?.length - 1]?.slice?.(0, 1)?.[0] ?? '')
          : ''
      : ''
  }, [fullName])

  return (
    // alternate method to squeeze wide avatars into a square
    // false ? (
    //   <Flex alignItems="center" justifyContent="center" width="max-content">
    //     <Tooltip
    //       placement="top"
    //       arrow
    //       title={customTooltip ?? fullName}
    //       disableInteractive
    //     >
    //       <Img
    //         // component="img"
    //         style={imageStyles}
    //         src={src}
    //         alt="profile"
    //         {...rest}
    //       />
    //     </Tooltip>
    //   </Flex>
    // ) :
    <Tooltip
      placement="top"
      arrow
      title={customTooltip ?? fullName}
      disableInteractive
      {...tooltip}
    >
      <MAvatar
        {...rest}
        sx={avatarStyles}
        slotProps={muiSlotProps}
        src={src}
        color={color}
      >
        {children || (fullName && !disableInitials) ? (
          <Typography
            variant="caption"
            textAlign="center"
            component="div"
            fontSize={fontSizeAdj}
            lineHeight={fontSizeAdj}
            color={color}
            height={fontSizeAdj}
            sx={{ fontSize: fontSizeAdj }}
            {...typography}
          >
            {children ?? initials}
          </Typography>
        ) : null}
      </MAvatar>
    </Tooltip>
  )
}
