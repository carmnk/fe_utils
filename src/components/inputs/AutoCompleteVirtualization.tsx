import { ListSubheader, Typography, useTheme } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { HTMLAttributes, ReactElement, createContext } from 'react'
import { forwardRef, useContext, useEffect, useRef } from 'react'
import { VariableSizeList, ListChildComponentProps } from 'react-window'

const LISTBOX_PADDING = 8 // px
const OuterElementContext = createContext({})

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props
  const dataSet = data[index] as {
    value: string
    label: string
    textLabel: string
    group: string
    key: string
  }
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    height: 32,
  }

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    )
  }
  // TODO: BUG ?
  const { key, ...optionProps } = (dataSet as any)[0]

  return (
    <Typography
      key={key}
      component="li"
      {...optionProps}
      noWrap
      style={inlineStyle}
    >
      {(dataSet as any)?.[1]?.value || ''}
    </Typography>
  )
}
function useResetCache(data: unknown) {
  const ref = useRef<VariableSizeList>(null)
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext<Record<string, unknown>>(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})
// Adapter for react-window
export const ListboxComponent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props
  const itemData: ReactElement[] = []
  ;(children as ReactElement[]).forEach(
    (item: ReactElement & { children?: ReactElement[] }) => {
      itemData.push(item)
      itemData.push(...(item.children || []))
    }
  )

  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child: ReactElement) => {
    if (child.hasOwnProperty('group')) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})
