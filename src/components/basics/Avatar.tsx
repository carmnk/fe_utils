import { CSSProperties, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { AvatarProps as MAvatarProps, Avatar as MAvatar } from '@mui/material'
import { Tooltip, Box, Typography } from '@mui/material'

export type AvatarProps = Omit<MAvatarProps, 'title'> & {
  size?: CSSProperties['width']
  fullName?: string
  fontSize?: CSSProperties['fontSize']
  disableInitials?: boolean
  customTooltip?: React.ReactNode
  bgColor?: string
}

/** Simple composite component building on top of mui's
 * [Avatar](https://mui.com/material-ui/react-avatar/) component
 * <br/><br/>Additional features:
 * - convenience props for size, bgColor, color, fontSize, fullName
 * - display initials when no image is provided and !disableInitials (future: maybe outsource initialsFn)
 * - display tooltip with customTooltip or fallback fullName, to disableTooltip set customTooltip to ""<br/>
 * - props: additional to [Mui' Avatar Props](https://mui.com/material-ui/api/avatar/) <br/>
 * @prop size - size of the avatar (all size dimensions ?)<br/>
 * @prop fullName - full name of the user<br/>
 * @prop fontSize - font size of the initials<br/>
 * @prop disableInitials - disable initials display<br/>
 * @prop customTooltip - custom tooltip to display<br/>
 * @prop bgColor - background color of the avatar
 */
export const Avatar = (props: AvatarProps) => {
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
    ...rest
  } = props

  const fontSizeAdj = typeof fontSize === 'number' ? fontSize + 'px' : fontSize

  const avatarStyles = useMemo(
    () => ({
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
    [size, style, rest?.sx, bgColor]
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
    >
      <MAvatar {...rest} sx={avatarStyles} src={src} color={color}>
        {fullName && !disableInitials ? (
          <Typography
            variant="caption"
            textAlign="center"
            component="div"
            fontSize={fontSizeAdj}
            lineHeight={fontSizeAdj}
            color={color}
            height={fontSizeAdj}
            sx={{ fontSize: fontSizeAdj }}
            // lineHeight={1}
          >
            {initials}
          </Typography>
        ) : null}
      </MAvatar>
    </Tooltip>
  )
}
