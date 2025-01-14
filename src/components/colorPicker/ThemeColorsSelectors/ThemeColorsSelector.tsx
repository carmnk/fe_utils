import { Box, Divider, Theme, Typography } from '@mui/material'
import {
  ThemeColorsEnum,
  ThemeActionColorsEnum,
  ThemeTextColorsEnum,
  ThemeBackgroundColorsEnum,
} from '../../../utils/types'
import { Flex } from '../../_wrapper'
import { ThemeColorObjectSelector } from './ThemeColorObjectSelector'
import { ThemeSingleColor } from './ThemeSingleColorSelector'
import { MouseEvent } from 'react'

export type ThemeColorsSelectorProps = {
  handleChangeThemeColor: (e: MouseEvent<HTMLDivElement>, color: string) => void
  themeIn: Theme
  highlightedThemeColor?: string
}

export const ThemeColorsSelector = (props: ThemeColorsSelectorProps) => {
  const { handleChangeThemeColor, themeIn, highlightedThemeColor } = props
  return (
    <Box bgcolor="#fff" position="relative" top={-6} pb={3}>
      <Divider sx={{ borderColor: 'rgb(238, 238, 238)' }} />

      <Box ml="10px" mt="10px">
        <Typography variant="caption" color="#000">
          Theme Colors
        </Typography>
        <Flex gap={'10px'} mt="10px">
          <ThemeColorObjectSelector
            themeColorName={ThemeColorsEnum.primary}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
          />
          <ThemeColorObjectSelector
            themeColorName={ThemeColorsEnum.secondary}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
          />
        </Flex>
        <Flex gap={'10px'} mt="10px">
          <ThemeColorObjectSelector
            themeColorName={ThemeColorsEnum.success}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
          />
          <ThemeColorObjectSelector
            themeColorName={ThemeColorsEnum.warning}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
          />
        </Flex>
        <Flex gap={'10px'} mt="10px">
          <ThemeColorObjectSelector
            themeColorName={ThemeColorsEnum.error}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
          />
          <ThemeColorObjectSelector
            themeColorName={ThemeColorsEnum.info}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
          />
        </Flex>
        {/* single colors */}

        <Flex gap={'10px'} mt="10px">
          <ThemeSingleColor
            color={ThemeActionColorsEnum.active}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeActionColorsEnum.active
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeActionColorsEnum.disabled}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeActionColorsEnum.disabled
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeActionColorsEnum.disabledBackground}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeActionColorsEnum.disabledBackground
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeActionColorsEnum.focus}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeActionColorsEnum.focus
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeActionColorsEnum.hover}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeActionColorsEnum.hover
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeActionColorsEnum.selected}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeActionColorsEnum.selected
                ? 'red'
                : undefined
            }
          />
        </Flex>
        <Flex gap={'10px'} mt="10px">
          <ThemeSingleColor
            color={ThemeTextColorsEnum.disabled}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeTextColorsEnum.disabled
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeTextColorsEnum.primary}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeTextColorsEnum.primary
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeTextColorsEnum.secondary}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeTextColorsEnum.secondary
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeBackgroundColorsEnum.default}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeBackgroundColorsEnum.default
                ? 'red'
                : undefined
            }
          />
          <ThemeSingleColor
            color={ThemeBackgroundColorsEnum.paper}
            onChange={handleChangeThemeColor}
            themeIn={themeIn}
            borderColor={
              highlightedThemeColor === ThemeBackgroundColorsEnum.paper
                ? 'red'
                : undefined
            }
          />
          {/* <ThemeSingleColor
                    color={ThemeBackgroundColorsEnum.paper}
                    hidden={true}
                    onChange={handleChangeThemeColor}
                    themeIn={themeIn}
                    borderColor={
                      highlightedThemeColor === ThemeBackgroundColorsEnum.paper
                        ? 'red'
                        : undefined
                    }
                  /> */}
        </Flex>
      </Box>
    </Box>
  )
}
