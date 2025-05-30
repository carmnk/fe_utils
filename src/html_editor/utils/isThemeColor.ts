export const isThemeColor = (color: string) =>
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
  ].includes(color?.split?.('.')[0] ?? '')
