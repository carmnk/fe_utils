import { mdiRedo, mdiPan, mdiCursorDefault, mdiPlusOutline, mdiArrowSplitVertical, mdiMenu, mdiPlusCircle, mdiPlus, mdiArrowRightThin, mdiArrowLeftRight, mdiHelp, mdiArrowAll, mdiArrowUpThin, mdiArrowTopRightThin, mdiArrowExpand, mdiArrowUpDown, mdiArrowTopLeftThin, mdiHandBackRightOff, mdiCancel, mdiCursorPointer, mdiProgressHelper, mdiArrowSplitHorizontal, mdiArrowDownThin, mdiArrowBottomRightThin, mdiArrowBottomLeftThin, mdiCursorText, mdiArrowLeftThin, mdiMagnifyPlusOutline, mdiMagnifyMinusOutline } from "@mdi/js";

export const CSS_CURSOR_OPTIONS = [
        { value: 'alias', label: 'alias', icon: mdiRedo, iconRotate: -90 },
        { value: 'all-scroll', label: 'all-scroll', icon: mdiPan },
        { value: 'auto', label: 'auto', icon: mdiCursorDefault },
        { value: 'cell', label: 'cell', icon: mdiPlusOutline },
        {
          value: 'col-resize',
          label: 'col-resize',
          icon: mdiArrowSplitVertical,
        },
        { value: 'context-menu', label: 'context-menu', icon: mdiMenu },
        { value: 'copy', label: 'copy', icon: mdiPlusCircle },
        { value: 'crosshair', label: 'crosshair', icon: mdiPlus },
        { value: 'default', label: 'default', icon: mdiCursorDefault },
        { value: 'e-resize', label: 'e-resize', icon: mdiArrowRightThin },
        { value: 'ew-resize', label: 'ew-resize', icon: mdiArrowLeftRight },
        // 'grab',
        // 'grabbing',
        { value: 'help', label: 'help', icon: mdiHelp },
        { value: 'move', label: 'move', icon: mdiArrowAll },
        { value: 'n-resize', label: 'n-resize', icon: mdiArrowUpThin },
        { value: 'ne-resize', label: 'ne-resize', icon: mdiArrowTopRightThin },
        { value: 'nesw-resize', label: 'nesw-resize', icon: mdiArrowExpand },
        { value: 'ns-resize', label: 'ns-resize', icon: mdiArrowUpDown },
        { value: 'nw-resize', label: 'nw-resize', icon: mdiArrowTopLeftThin },
        {
          value: 'nwse-resize',
          label: 'nwse-resize',
          icon: mdiArrowExpand,
          iconRotate: 90,
        },
        {
          value: 'no-drop',
          label: 'no-drop',
          icon: mdiHandBackRightOff,
        },
        {
          value: 'not-allowed',
          label: 'not-allowed',
          icon: mdiCancel,
        },
        {
          value: 'pointer',
          label: 'pointer',
          icon: mdiCursorPointer,
        },
        {
          value: 'progress',
          label: 'progress',
          icon: mdiProgressHelper,
        },
        {
          value: 'row-resize',
          label: 'row-resize',
          icon: mdiArrowSplitHorizontal,
        },

        {
          value: 's-resize',
          label: 's-resize',
          icon: mdiArrowDownThin,
        },
        {
          value: 'se-resize',
          label: 'se-resize',
          icon: mdiArrowBottomRightThin,
        },
        {
          value: 'sw-resize',
          label: 'sw-resize',
          icon: mdiArrowBottomLeftThin,
        },
        {
          value: 'text',
          label: 'text',
          icon: mdiCursorText,
        },
        {
          value: 'w-resize',
          label: 'w-resize',
          icon: mdiArrowLeftThin,
        },
        {
          value: 'wait',
          label: 'wait',
          icon: mdiProgressHelper,
        },
        {
          value: 'zoom-in',
          label: 'zoom-in',
          icon: mdiMagnifyPlusOutline,
        },
        {
          value: 'zoom-out',
          label: 'zoom-out',
          icon: mdiMagnifyMinusOutline,
        },

        {
          value: 'none',
          label: 'none',
          // icon: mdiHandBackRightOff,
        },
      ]