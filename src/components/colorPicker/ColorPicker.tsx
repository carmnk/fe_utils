import {
  CSSProperties,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react'
import {
  Box,
  BoxProps,
  Popover,
  PopoverProps,
  hexToRgb,
  useTheme,
} from '@mui/material'
import { SketchPicker } from 'react-color'
import { Button } from '../buttons/Button/Button'
import { mdiCheck } from '@mdi/js'

type GenericColorPickerProps = {
  value: CSSProperties['color']
  selectorSize?: string | number
}
type DisabledColorPickerProps = GenericColorPickerProps & {
  disabled: true
  onChange?: (color: string) => void
}

type EnabledColorPickerProps = GenericColorPickerProps & {
  disabled?: false
  onChange: (color: string) => void
}

export type ColorPickerProps = BoxProps &
  (EnabledColorPickerProps | DisabledColorPickerProps)

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
  const defaultColor: any = defaultRgbaStr
    ? rgbaToObj(defaultRgbaStr)
    : { r: 0, g: 0, b: 0, a: 1 }
  console.log(
    rgbaString,
    colorParts,
    defaultColor,
    parseInt(colorParts?.[0] || defaultColor),
    'r',
    colorParts?.[0] || defaultColor
  )
  return {
    r: parseInt(colorParts?.[0] || defaultColor),
    g: parseInt(colorParts?.[1] || defaultColor),
    b: parseInt(colorParts?.[2] || defaultColor),
    a: rgbaString?.match(/rgba\((.*)\)/) ? colorParts?.[3] || defaultColor : 1,
  }
}

const extractRgbaValuesFromString = (rgba: string) => {
  return rgba.replaceAll(/^(?:\d+(?:,\d+)*,?)?$/, '')?.split(',')
}

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
  const { value, onChange, disabled, selectorSize = 28, ...rest } = props
  const theme = useTheme()
  const [color, setColor] = useState(rgbaToObj(value))
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const handleToggleColorPicker = useCallback(() => {
    if (disabled) return
    setDisplayColorPicker((current) => !current)
  }, [disabled])

  const handleChangeColor = useCallback((color: any) => {
    setColor(color.rgb)
  }, [])

  const handleTakeover = useCallback(() => {
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
    onChange?.(colorAdj)
    setDisplayColorPicker(false)
  }, [onChange, color])

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
  const inputStyles: BoxProps['sx'] = useMemo(
    () => ({
      width: selectorSize,
      borderRadius: '2px',
      border: '1px solid ' + theme.palette.divider,
      height: selectorSize,
      backgroundColor:
        'r' in color
          ? `rgba(${color?.r ?? 0}, ${color?.g ?? 0}, ${color?.b ?? 0}, ${
              color?.a ?? 1
            })`
          : '#fff',
    }),
    [selectorSize, theme, color]
  )

  return (
    <div style={{ height: selectorSize, width: selectorSize }}>
      <Box
        sx={inputContainerStyles}
        onClick={handleToggleColorPicker}
        ref={indicatorRef}
        {...rest}
      >
        <Box sx={inputStyles} />
      </Box>
      {displayColorPicker ? (
        <Popover
          anchorEl={indicatorRef.current}
          open={displayColorPicker}
          {...popoverOrigins}
          onClose={handleToggleColorPicker}
        >
          <div onClick={handleToggleColorPicker} />
          <SketchPicker color={color as any} onChange={handleChangeColor} />
          <Box position="absolute" bottom={4} right={4}>
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
