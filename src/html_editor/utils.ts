export const getSizeMode = (
  value: string | number | undefined,
  defaultValue = 'auto'
) => {
  return typeof value === 'number'
    ? 'px'
    : typeof value === 'string'
    ? value.includes('%')
      ? '%'
      : value.includes('vh')
      ? 'vh'
      : value.includes('vw')
      ? 'vw'
      : 'px'
    : defaultValue
}

export const getInitialStyles = (): React.CSSProperties => {
  return {
    display: 'block',
    position: 'static',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }
}
