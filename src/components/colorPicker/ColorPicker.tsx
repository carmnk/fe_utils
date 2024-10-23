import {
  CSSProperties,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  MouseEvent,
} from 'react'
import {
  Box,
  BoxProps,
  Divider,
  Popover,
  PopoverProps,
  Typography,
  hexToRgb,
  useTheme,
} from '@mui/material'
import { SketchPicker } from 'react-color'
import { Button } from '../buttons/Button/Button'
import { mdiCheck } from '@mdi/js'
import { Flex } from '../_wrapper'
import { ThemeColors } from './ThemeColors'
import {
  ThemeActionColorsEnum,
  ThemeBackgroundColorsEnum,
  ThemeColorsEnum,
  ThemeTextColorsEnum,
} from '../../utils/types'
import { ThemeSingleColor } from './ThemeSingleColor'

type GenericColorPickerProps = {
  value: CSSProperties['color']
  selectorSize?: string | number
  disableThemeColors?: boolean
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
  const {
    value,
    onChange,
    disabled,
    selectorSize = 28,
    disableThemeColors,
    ...rest
  } = props
  const theme = useTheme()
  const [color, setColor] = useState(rgbaToObj(value))
  const [unchangedColor, setUnchangedColor] = useState(value)
  const [isThemeColor, setIsThemeColor] = useState(false)
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const handleToggleColorPicker = useCallback(() => {
    if (disabled) return
    setDisplayColorPicker((current) => !current)
  }, [disabled])

  const handleChangeColor = useCallback((color: any) => {
    console.log('handleChangeColor, ', color)
    setColor(color.rgb)
    setIsThemeColor(false)
    // setUnchangedColor(color.rgb)
  }, [])

  const handleTakeover = useCallback(() => {
    if (isThemeColor) {
      onChange?.(unchangedColor as any)
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
    onChange?.(colorAdj)
    setDisplayColorPicker(false)
  }, [onChange, color, isThemeColor, unchangedColor])

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
        'primary.',
        'secondary.',
        'warning.',
        'error.',
        'success.',
        'info.',
        'text.',
        'background.',
        'action.',
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

  const handleChangeThemeColor = useCallback(
    (e: MouseEvent<HTMLDivElement>, colorName: string) => {
      const colorPath = colorName.split('.')
      const themeColorNameMain = colorPath?.[0]
      const themeColorNameVariant = colorPath?.[1]
      const colorGroup =
        theme.palette[themeColorNameMain as keyof typeof theme.palette]
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

      setColor?.(rgbaToObj(colorRgba))
      setUnchangedColor(colorName)
      setIsThemeColor(true)
    },
    [theme]
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

          {!disableThemeColors && (
            <Box bgcolor="#fff" position="relative" top={-6}>
              <Divider sx={{ borderColor: 'rgb(238, 238, 238)' }} />

              <Box ml="10px" mt="10px">
                <Typography variant="caption">Theme Colors</Typography>
                <Flex gap={'10px'} mt="10px">
                  <ThemeColors
                    themeColorName={ThemeColorsEnum.primary}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeColors
                    themeColorName={ThemeColorsEnum.secondary}
                    onChange={handleChangeThemeColor}
                  />
                </Flex>
                <Flex gap={'10px'} mt="10px">
                  <ThemeColors
                    themeColorName={ThemeColorsEnum.success}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeColors
                    themeColorName={ThemeColorsEnum.warning}
                    onChange={handleChangeThemeColor}
                  />
                </Flex>
                <Flex gap={'10px'} mt="10px">
                  <ThemeColors
                    themeColorName={ThemeColorsEnum.error}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeColors
                    themeColorName={ThemeColorsEnum.info}
                    onChange={handleChangeThemeColor}
                  />
                </Flex>
                {/* single colors */}

                <Flex gap={'10px'} mt="10px">
                  <ThemeSingleColor
                    color={ThemeActionColorsEnum.active}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeActionColorsEnum.disabled}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeActionColorsEnum.disabledBackground}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeActionColorsEnum.focus}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeActionColorsEnum.hover}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeActionColorsEnum.selected}
                    onChange={handleChangeThemeColor}
                  />
                </Flex>
                <Flex gap={'10px'} mt="10px">
                  <ThemeSingleColor
                    color={ThemeTextColorsEnum.disabled}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeTextColorsEnum.primary}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeTextColorsEnum.secondary}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeBackgroundColorsEnum.default}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeBackgroundColorsEnum.paper}
                    onChange={handleChangeThemeColor}
                  />
                  <ThemeSingleColor
                    color={ThemeBackgroundColorsEnum.paper}
                    hidden={true}
                    onChange={handleChangeThemeColor}
                  />
                </Flex>
              </Box>
            </Box>
          )}
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
