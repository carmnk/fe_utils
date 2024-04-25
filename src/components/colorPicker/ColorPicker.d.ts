import { CSSProperties } from 'react';
import { BoxProps } from '@mui/material';
type GenericColorPickerProps = {
    value: CSSProperties['color'];
    selectorSize?: string | number;
};
type DisabledColorPickerProps = GenericColorPickerProps & {
    disabled: true;
    onChange?: (color: string) => void;
};
type EnabledColorPickerProps = GenericColorPickerProps & {
    disabled?: false;
    onChange: (color: string) => void;
};
export type ColorPickerProps = BoxProps & (EnabledColorPickerProps | DisabledColorPickerProps);
/** Colorpicker Component
 * @param value - color value supports rgb, rgba, hex, hexa (no color names like 'red')
 * @param onChange - callback function to handle color change
 */
export declare const ColorPicker: (props: ColorPickerProps) => import("react/jsx-runtime").JSX.Element;
export {};
