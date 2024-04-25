var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState, useRef, useMemo, } from 'react';
import { Box, Popover, hexToRgb, useTheme, } from '@mui/material';
import { SketchPicker } from 'react-color';
import { Button } from '../buttons/Button/Button';
import { mdiCheck } from '@mdi/js';
var simplifiedRgbaRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
var simplifiedHexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
var simplifiedHexARegex = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/;
var rgbaToObj = function (rgbaString, defaultRgbaStr) {
    var _a, _b, _c, _d;
    var colorParts = (_d = (_c = (_b = (_a = rgbaString === null || rgbaString === void 0 ? void 0 : rgbaString.match(/rgba*\((.*)\)/)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.map(function (val) { var _a; return (_a = val === null || val === void 0 ? void 0 : val.trim) === null || _a === void 0 ? void 0 : _a.call(val); })) !== null && _d !== void 0 ? _d : [];
    var defaultColor = defaultRgbaStr
        ? rgbaToObj(defaultRgbaStr)
        : { r: 0, g: 0, b: 0, a: 1 };
    console.log(rgbaString, colorParts, defaultColor, parseInt((colorParts === null || colorParts === void 0 ? void 0 : colorParts[0]) || defaultColor), 'r', (colorParts === null || colorParts === void 0 ? void 0 : colorParts[0]) || defaultColor);
    return {
        r: parseInt((colorParts === null || colorParts === void 0 ? void 0 : colorParts[0]) || defaultColor),
        g: parseInt((colorParts === null || colorParts === void 0 ? void 0 : colorParts[1]) || defaultColor),
        b: parseInt((colorParts === null || colorParts === void 0 ? void 0 : colorParts[2]) || defaultColor),
        a: (rgbaString === null || rgbaString === void 0 ? void 0 : rgbaString.match(/rgba\((.*)\)/)) ? (colorParts === null || colorParts === void 0 ? void 0 : colorParts[3]) || defaultColor : 1,
    };
};
var extractRgbaValuesFromString = function (rgba) {
    var _a;
    return (_a = rgba.replaceAll(/^(?:\d+(?:,\d+)*,?)?$/, '')) === null || _a === void 0 ? void 0 : _a.split(',');
};
var popoverOrigins = {
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
    },
    transformOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
    },
};
/** Colorpicker Component
 * @param value - color value supports rgb, rgba, hex, hexa (no color names like 'red')
 * @param onChange - callback function to handle color change
 */
export var ColorPicker = function (props) {
    var value = props.value, onChange = props.onChange, disabled = props.disabled, _a = props.selectorSize, selectorSize = _a === void 0 ? 28 : _a, rest = __rest(props, ["value", "onChange", "disabled", "selectorSize"]);
    var theme = useTheme();
    var _b = useState(rgbaToObj(value)), color = _b[0], setColor = _b[1];
    var _c = useState(false), displayColorPicker = _c[0], setDisplayColorPicker = _c[1];
    var handleToggleColorPicker = useCallback(function () {
        if (disabled)
            return;
        setDisplayColorPicker(function (current) { return !current; });
    }, [disabled]);
    var handleChangeColor = useCallback(function (color) {
        setColor(color.rgb);
    }, []);
    var handleTakeover = useCallback(function () {
        var defaultObjectColor = 'r' in color
            ? "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(color.a, ")")
            : null;
        var colorAdj = typeof color === 'string'
            ? simplifiedRgbaRegex.test(color)
                ? color
                : simplifiedHexRegex.test(color)
                    ? hexToRgb(color)
                    : defaultObjectColor
            : defaultObjectColor;
        if (!colorAdj)
            return;
        // const colorCss = `rgba(${color?.r ?? 0}, ${color?.g ?? 0}, ${
        //   color?.b ?? 0
        // }, ${color?.a ?? 1})`;
        onChange === null || onChange === void 0 ? void 0 : onChange(colorAdj);
        setDisplayColorPicker(false);
    }, [onChange, color]);
    var indicatorRef = useRef(null);
    useEffect(function () {
        var colorAdj = typeof value === 'string'
            ? simplifiedRgbaRegex.test(value)
                ? value
                : simplifiedHexRegex.test(value) || simplifiedHexARegex.test(value)
                    ? hexToRgb(value)
                    : value
            : value;
        var colorObj = rgbaToObj(colorAdj);
        setColor(colorObj);
    }, [value]);
    var inputContainerStyles = useMemo(function () { return ({
        width: selectorSize,
        boxSizing: 'border-box',
        height: selectorSize,
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: disabled ? undefined : 'pointer',
    }); }, [selectorSize, disabled]);
    var inputStyles = useMemo(function () {
        var _a, _b, _c, _d;
        return ({
            width: selectorSize,
            borderRadius: '2px',
            border: '1px solid ' + theme.palette.divider,
            height: selectorSize,
            backgroundColor: 'r' in color
                ? "rgba(".concat((_a = color === null || color === void 0 ? void 0 : color.r) !== null && _a !== void 0 ? _a : 0, ", ").concat((_b = color === null || color === void 0 ? void 0 : color.g) !== null && _b !== void 0 ? _b : 0, ", ").concat((_c = color === null || color === void 0 ? void 0 : color.b) !== null && _c !== void 0 ? _c : 0, ", ").concat((_d = color === null || color === void 0 ? void 0 : color.a) !== null && _d !== void 0 ? _d : 1, ")")
                : '#fff',
        });
    }, [selectorSize, theme, color]);
    return (_jsxs("div", { style: { height: selectorSize, width: selectorSize }, children: [_jsx(Box, __assign({ sx: inputContainerStyles, onClick: handleToggleColorPicker, ref: indicatorRef }, rest, { children: _jsx(Box, { sx: inputStyles }) })), displayColorPicker ? (_jsxs(Popover, __assign({ anchorEl: indicatorRef.current, open: displayColorPicker }, popoverOrigins, { onClose: handleToggleColorPicker, children: [_jsx("div", { onClick: handleToggleColorPicker }), _jsx(SketchPicker, { color: color, onChange: handleChangeColor }), _jsx(Box, { position: "absolute", bottom: 4, right: 4, children: _jsx(Button, { iconButton: true, icon: mdiCheck, onClick: handleTakeover }) })] }))) : null] }));
};
