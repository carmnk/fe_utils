import { MouseEvent, useCallback, useMemo } from 'react'
import { Button, CButtonProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'
import { useTheme } from '@mui/material'

export const ButtonWrapper = (
  props: CButtonProps & CommonComponentPropertys & { html_id: string }
) => {
  const {
    appController,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    assets,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    id,
    html_id,
    iconColor,
    onClick,
    ...rest
  } = props

  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      appController.actions.changeButtonState(id)

      if (onClick && typeof onClick === 'function') {
        onClick(e)
      }
    },
    [onClick, appController, id]
  )

  const theme = useTheme()

  const iconColorAdj = useMemo(() => {
    const potentialThemeColorPath = iconColor ? iconColor?.split('.') : []
    const themeColor =
      potentialThemeColorPath.length === 2
        ? theme.palette[potentialThemeColorPath?.[0] as 'primary']?.[
            potentialThemeColorPath?.[1] as 'main'
          ]
        : null
    return themeColor ?? iconColor
  }, [iconColor, theme])

  return (
    <Button
      {...rest}
      onClick={handleOnClick}
      id={html_id ?? id}
      iconColor={iconColorAdj}
    />
  )
}
