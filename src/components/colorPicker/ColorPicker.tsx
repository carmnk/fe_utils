import { CSSProperties, useCallback, useEffect } from 'react'
import { useState, useRef, useMemo, MouseEvent } from 'react'
import { Box, BoxProps, Popover, PopoverProps, Tooltip } from '@mui/material'
import { Theme, hexToRgb, useTheme } from '@mui/material'
import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color'
import { Button } from '../buttons/Button/Button'
import { mdiCheck } from '@mdi/js'
import { ThemeColorsSelector } from './ThemeColorsSelectors/ThemeColorsSelector'
import { PresetColor } from 'react-color/lib/components/sketch/Sketch'

type GenericColorPickerProps = {
  value: CSSProperties['color']
  selectorSize?: string | number
  disableThemeColors?: boolean
  resolveThemeColors?: boolean
  themeIn?: Theme
  highlightedThemeColor?: string
  presetColors?: PresetColor[]
  name?: string
  disableColorTransformations?: boolean
}
type DisabledColorPickerProps = GenericColorPickerProps & {
  disabled: true
  onChange?: (color: string) => void
}

type EnabledColorPickerProps = GenericColorPickerProps & {
  disabled?: false
  onChange: (color: string) => void
}

export type ColorPickerProps = Omit<BoxProps, 'onChange'> &
  (EnabledColorPickerProps | DisabledColorPickerProps)

export type ColorObject = {
  r: number
  g: number
  b: number
  a?: number
}

const simplifiedRgbaRegex =
  /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
const simplifiedHexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
const simplifiedHexARegex = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/

const rgbaToObj = (rgbaString?: string, defaultRgbaStr?: string) => {
  const colorParts =
    rgbaString
      ?.match(/rgba*\((.*)\)/)?.[1]
      ?.split(',')
      ?.map((val: string) => val?.trim?.()) ?? []
  const defaultColor: ColorObject = defaultRgbaStr
    ? rgbaToObj(defaultRgbaStr)
    : { r: 0, g: 0, b: 0, a: 1 }

  return {
    r: parseInt((colorParts?.[0] || defaultColor?.r?.toString()) ?? '0'),
    g: parseInt(colorParts?.[1] || defaultColor?.g?.toString()),
    b: parseInt(colorParts?.[2] || defaultColor?.b?.toString()),
    a: rgbaString?.match(/rgba\((.*)\)/)
      ? parseInt(colorParts?.[3]) || defaultColor?.a
      : 1,
  }
}

// const extractRgbaValuesFromString = (rgba: string) => {
//   return rgba.replaceAll(/^(?:\d+(?:,\d+)*,?)?$/, '')?.split(',')
// }

const popoverOrigins: Pick<PopoverProps, 'anchorOrigin' | 'transformOrigin'> = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
}

/** Colorpicker Component
 * @param value - color value supports rgb, rgba, hex, hexa (no color names like 'red')
 * @param onChange - callback function to handle color change
 */

export const ColorPicker = (props: ColorPickerProps) => {
  const {
    value,
    onChange,
    disabled,
    selectorSize = 28,
    disableThemeColors,
    resolveThemeColors,
    themeIn,
    highlightedThemeColor,
    presetColors,
    disableColorTransformations,
    ...rest
  } = props
  const theme = useTheme()
  const themeAdj = themeIn ?? theme
  const [color, setColor] = useState<ColorObject>(rgbaToObj(value))
  const [unchangedColor, setUnchangedColor] = useState(value)
  const [isThemeColor, setIsThemeColor] = useState(false)
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const handleToggleColorPicker = useCallback(() => {
    if (disabled) return
    setDisplayColorPicker((current) => !current)
  }, [disabled])

  const handleChangeColor: ColorChangeHandler = useCallback(
    (color: ColorResult) => {
      console.debug('handleChangeColor, ', color)
      setColor(color?.rgb)
      setIsThemeColor(false)
      // setUnchangedColor(color.rgb)
    },
    []
  )

  const handleTakeover = useCallback(() => {
    console.debug(
      'unchangedColor',
      unchangedColor,
      isThemeColor,
      resolveThemeColors
    )
    if ((isThemeColor && !resolveThemeColors) || disableColorTransformations) {
      onChange?.(
        disableColorTransformations
          ? `rgba(${color.r},${color.g},${color.b},${color.a})`
          : (unchangedColor as string)
      )
      setDisplayColorPicker(false)
      return
    }
    const defaultObjectColor =
      'r' in color
        ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        : null
    const colorAdj =
      typeof color === 'string'
        ? simplifiedRgbaRegex.test(color)
          ? color
          : simplifiedHexRegex.test(color)
            ? hexToRgb(color)
            : defaultObjectColor
        : defaultObjectColor
    if (!colorAdj) return
    // const colorCss = `rgba(${color?.r ?? 0}, ${color?.g ?? 0}, ${
    //   color?.b ?? 0
    // }, ${color?.a ?? 1})`;
    console.debug('handleTakeover, ', colorAdj)
    onChange?.(colorAdj)
    setDisplayColorPicker(false)
  }, [
    onChange,
    color,
    isThemeColor,
    unchangedColor,
    resolveThemeColors,
    disableColorTransformations,
  ])

  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const colorAdj =
      typeof value === 'string'
        ? simplifiedRgbaRegex.test(value)
          ? value
          : simplifiedHexRegex.test(value) || simplifiedHexARegex.test(value)
            ? hexToRgb(value)
            : value
        : value

    const colorObj = rgbaToObj(colorAdj)
    setColor(colorObj)
    setUnchangedColor(value)
    if (
      [
        'primary',
        'secondary',
        'warning',
        'error',
        'success',
        'info',
        'text',
        'background',
        'action',
      ].includes(value?.split?.('.')[0] ?? '')
    ) {
      setIsThemeColor(true)
    } else {
      setIsThemeColor(false)
    }
  }, [value])

  const inputContainerStyles: BoxProps['sx'] = useMemo(
    () => ({
      width: selectorSize,
      boxSizing: 'border-box',
      height: selectorSize,
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: disabled ? undefined : 'pointer',
    }),
    [selectorSize, disabled]
  )

  const transparentBgColor = 'rgba(255,255,255,1)'
  const transparentBgColor2 = 'rgba(255,255,255,0)'
  const inputStyles: BoxProps['sx'] = useMemo(
    () => ({
      width: selectorSize,
      borderRadius: '2px',
      border: '1px solid ' + theme.palette.divider,
      height: selectorSize,
      backgroundColor: !value
        ? undefined
        : isThemeColor
          ? (themeAdj?.['palette']?.[
              (value as any).split('.')?.[0] as 'primary'
            ]?.[(value as any).split('.')?.[1] as 'main'] ?? value)
          : 'r' in color
            ? `rgba(${color?.r ?? 0}, ${color?.g ?? 0}, ${color?.b ?? 0}, ${
                color?.a ?? 1
              })`
            : '#fff',
      background: !value
        ? `linear-gradient(to top left,
             ${transparentBgColor2} 0%,
             ${transparentBgColor2} calc(50% - 0.8px),
             rgba(255,0,0,0.9) 50%,
             ${transparentBgColor2} calc(50% + 0.8px),
             ${transparentBgColor2} 100%), 
             linear-gradient(to top right,
             ${transparentBgColor} 0%,
             ${transparentBgColor} calc(50% - 0.8px),
             rgba(255,0,0,0.9) 50%,
             ${transparentBgColor} calc(50% + 0.8px),
             ${transparentBgColor} 100%)`
        : undefined,
    }),
    [selectorSize, theme, color, value, isThemeColor, themeAdj]
  )

  const handleChangeThemeColor = useCallback(
    (__e: MouseEvent<HTMLDivElement>, colorName: string) => {
      const colorPath = colorName.split('.')
      const themeColorNameMain = colorPath?.[0]
      const themeColorNameVariant = colorPath?.[1]
      const colorGroup =
        themeAdj.palette[themeColorNameMain as keyof typeof themeAdj.palette]
      const colorRaw =
        colorGroup?.[themeColorNameVariant as keyof typeof colorGroup]
      const colorRgba =
        typeof colorRaw === 'string'
          ? simplifiedRgbaRegex.test(colorRaw)
            ? colorRaw
            : simplifiedHexRegex.test(colorRaw)
              ? hexToRgb(colorRaw)
              : null
          : null
      if (!colorRgba) return

      console.debug('handleChangeThemeColor, ', colorRgba, colorName, colorPath)
      setColor?.(rgbaToObj(colorRgba))
      setUnchangedColor(colorName)
      setIsThemeColor(true)
    },
    [themeAdj]
  )

  return (
    <div style={{ height: selectorSize, width: selectorSize }}>
      <Tooltip title={value} placement="top" arrow>
        <Box
          sx={inputContainerStyles}
          onClick={handleToggleColorPicker}
          ref={indicatorRef}
          {...rest}
        >
          <Box sx={inputStyles} />
        </Box>
      </Tooltip>
      {displayColorPicker ? (
        <Popover
          anchorEl={indicatorRef.current}
          open={displayColorPicker}
          {...popoverOrigins}
          onClose={handleToggleColorPicker}
        >
          <div onClick={handleToggleColorPicker} />
          <SketchPicker
            color={color}
            onChange={handleChangeColor}
            presetColors={presetColors}
          />

          {!disableThemeColors && (
            <ThemeColorsSelector
              handleChangeThemeColor={handleChangeThemeColor}
              themeIn={themeAdj}
              highlightedThemeColor={highlightedThemeColor}
            />
          )}
          <Box position="absolute" bottom={8} right={4}>
            <Button
              iconButton={true}
              icon={mdiCheck}
              onClick={handleTakeover}
            />
          </Box>
        </Popover>
      ) : null}
    </div>
  )
}
