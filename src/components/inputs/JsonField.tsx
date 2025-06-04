import { mdiDelete, mdiMinus, mdiPencil, mdiPlus } from '@mdi/js'
import { Box, Typography } from '@mui/material'
import { Flex } from '../_wrapper/Flex'
import { Button } from '../buttons/Button'
import { JsonObjectField, JsonObjectFieldProps } from './JsonObjectField'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { Modal } from '../surfaces/Modal'
import Icon from '@mdi/react'
import { getAmountJsonChildren } from './getAmountJsonChildren'

const lineHeight = 28.8 // 28.8 + 2px gap

type JsonFieldValue = Record<string, unknown> | Record<string, unknown>[]

export type JsonFieldProps = Omit<
  JsonObjectFieldProps,
  'value' | 'onChange'
> & {
  label?: string
  value: JsonFieldValue
  useModal?: boolean
  disableLabel?: boolean
  _collapsedPaths?: string[]
  _setCollapsedPaths?: Dispatch<SetStateAction<string[]>>
  startCollapsed?: boolean
  _index?: number
  hideLineNumbers?: boolean
  onChange: (newValue: JsonFieldValue, e: { target: { name: string } }) => void
  fontSize?: number
}

// const buttonSlotProps = {
//   typography: { variant: 'caption' as const },
// }
const miniButtonStyles = { width: 'max-content' as const, m: 0 }

export const RawJsonField = (props: JsonFieldProps) => {
  const {
    value,
    _path = [],
    editing,
    setEditing,
    onChange,
    label,
    keysDict,
    name,
    useModal,
    disabled,
    disableLabel,
    _collapsedPaths,
    _setCollapsedPaths,
    startCollapsed,
    hideLineNumbers = true,
    itemsWindowStartIndex,
    itemsWindowEndIndex,
    fontSize,
    _index,
  } = props

  const startCollapsedAdj = startCollapsed

  const expandedItems =
    startCollapsedAdj && _collapsedPaths ? _collapsedPaths : []
  const isCurrentFieldExpanded = startCollapsedAdj
    ? expandedItems.includes(_path.join('.'))
    : !_collapsedPaths?.includes(_path.join('.'))

  const handleAddItem = useCallback(() => {
    if (Array.isArray(keysDict)) {
      const newItem = keysDict?.[0]
      onChange([...((value as unknown[]) || []), newItem], {
        target: { name: name ?? '' },
      })
    }
  }, [value, keysDict, onChange, name])

  const newPath = useMemo(() => [..._path], [_path])
  const newIndexesArrayRaw = useMemo(
    () =>
      Array.isArray(value)
        ? value.map((val, vIdx) =>
            getAmountJsonChildren(
              val,
              [...newPath, vIdx],
              _collapsedPaths ?? []
            )
          )
        : [],
    [value, newPath, _collapsedPaths]
  )

  const newIndexesArray = newIndexesArrayRaw.map((val) => {
    // const key = valueInKeysSorted[vIDx]
    const newPath = [..._path]
    if (_collapsedPaths?.includes(newPath.join('.'))) {
      return 0
    }
    return val
  })

  // const newIndexesArrayForChildren = newIndexesArrayRaw.map((val, vIDx) => {
  //   const key = value[vIDx]
  //   const newPath = [..._path, key]
  //   if (_collapsedPaths?.includes(newPath.join('.'))) {
  //     return 0
  //   }
  //   return val
  // })

  return (
    <Box>
      {!_path?.length && !disableLabel && (
        <Typography variant="caption">{label}</Typography>
      )}
      {Array.isArray(value) ? (
        value.length ? (
          <Box>
            <Flex>
              <Typography component="span" color="gold">{`[`}</Typography>
              {/* Collapse/Expand Array */}
              <Button
                icon={isCurrentFieldExpanded ? mdiMinus : mdiPlus}
                iconButton
                variant="text"
                // slotProps={buttonSlotProps}
                label={isCurrentFieldExpanded ? 'Collapse' : 'Expand'}
                onClick={() => {
                  _setCollapsedPaths?.((current) =>
                    current.includes(_path.join('.'))
                      ? current.filter((path) => path !== _path.join('.'))
                      : [...current, _path.join('.')]
                  )
                }}
              />
            </Flex>
            {isCurrentFieldExpanded &&
              value.map((item, arrIdx) => {
                const handleDeleteItem = () => {
                  onChange(
                    value?.filter((__v, vIdx) => vIdx !== arrIdx) || [],
                    {
                      target: { name: name ?? '' },
                    }
                  )
                }
                const handleChangeJsonField = (
                  newValuePerItem: JsonFieldValue
                ) =>
                  onChange(
                    (value?.map((v, vIdx) =>
                      vIdx === arrIdx ? newValuePerItem : v
                    ) || []) as JsonFieldValue,
                    { target: { name: name ?? '' } }
                  )

                const newPath = [..._path, arrIdx]
                const indexesBefore = newIndexesArray
                  .slice(0, arrIdx)
                  .reduce((acc, item) => acc + item, 0)

                return (
                  <Box key={arrIdx} ml={2} position="relative">
                    <JsonField
                      _collapsedPaths={_collapsedPaths}
                      _setCollapsedPaths={_setCollapsedPaths}
                      useModal={useModal}
                      disabled={disabled}
                      name={name}
                      // TODO: bug ?
                      keysDict={
                        keysDict?.[0] as unknown as Record<string, string>
                      }
                      value={item}
                      _path={newPath}
                      editing={editing}
                      setEditing={setEditing}
                      onChange={handleChangeJsonField}
                      _index={(_index ?? 0) + 1 + indexesBefore}
                      hideLineNumbers={hideLineNumbers}
                      itemsWindowStartIndex={itemsWindowStartIndex}
                      itemsWindowEndIndex={itemsWindowEndIndex}
                      fontSize={fontSize}
                    />
                    {!disabled && (
                      <Button
                        icon={mdiDelete}
                        variant="text"
                        // slotProps={buttonSlotProps}
                        sx={{ position: 'absolute', bottom: 0, left: '16px' }}
                        label="Delete Item"
                        onClick={handleDeleteItem}
                      />
                    )}
                  </Box>
                )
              })}
            {!disabled && (
              <Button
                icon={mdiPlus}
                variant="text"
                // slotProps={buttonSlotProps}
                sx={miniButtonStyles}
                onClick={handleAddItem}
              >
                Add Item__
              </Button>
            )}
            <Typography color="gold">
              {!hideLineNumbers
                ? (
                    (_index ?? 0) +
                    1 +
                    newIndexesArray.reduce((acc, item) => acc + item, 0) +
                    1
                  ).toString() + ':'
                : ''}
              {`]`}
            </Typography>
          </Box>
        ) : (
          <Flex>
            <Typography>{`[`}</Typography>
            {!disabled && (
              <Button
                icon={mdiPlus}
                variant="text"
                // slotProps={buttonSlotProps}
                sx={miniButtonStyles}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            )}
            <Typography>{`]`}</Typography>
          </Flex>
        )
      ) : (
        <JsonObjectField
          disabled={disabled}
          name={name}
          value={value}
          _path={newPath}
          editing={editing}
          setEditing={setEditing}
          onChange={onChange}
          keysDict={keysDict}
          _collapsedPaths={_collapsedPaths}
          _setCollapsedPaths={_setCollapsedPaths}
          startCollapsed={startCollapsed}
          _index={_index}
          hideLineNumbers={hideLineNumbers}
          itemsWindowStartIndex={itemsWindowStartIndex}
          itemsWindowEndIndex={itemsWindowEndIndex}
          fontSize={fontSize}
        />
      )}
    </Box>
  )
}

export const JsonField = (props: JsonFieldProps) => {
  const {
    useModal,
    _collapsedPaths,
    _setCollapsedPaths,
    itemsWindowEndIndex,
    itemsWindowStartIndex,
    ...rest
  } = props
  const [open, setOpen] = useState(false)

  const isChildComponent = !!_collapsedPaths // shall not be used by the dev user
  const [collapsedPaths, setCollapsedPaths] = useState<string[]>([])

  const handleClose = useCallback(() => setOpen(false), [])
  const handleOpen = useCallback(() => setOpen(true), [])

  const [scrollPosition, setScrollPosition] = useState(0)
  const rootContainerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (open) {
      setScrollPosition(window.scrollY)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      window.scrollTo(0, scrollPosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    const rootContainer = rootContainerRef.current
    if (isChildComponent) {
      return
    }
    const handleScroll = () => {
      if (rootContainer) {
        setScrollPosition(rootContainer.scrollTop)
        // const scrollPos = rootContainer.scrollTop
      }
    }
    rootContainer?.addEventListener('scroll', handleScroll)
    return () => {
      rootContainer?.removeEventListener?.('scroll', handleScroll)
    }
  }, [isChildComponent])

  useEffect(() => {
    if (isChildComponent) {
      return
    }
  }, [isChildComponent])

  const collapsedPathsAdj = isChildComponent ? _collapsedPaths : collapsedPaths
  const setCollapsedPathsAdj = isChildComponent
    ? _setCollapsedPaths
    : setCollapsedPaths

  const itemsWindowStartIndexAdj = isChildComponent
    ? itemsWindowStartIndex
    : Math.floor(scrollPosition / lineHeight)
  const itemsWindowEndIndexAdj = isChildComponent
    ? itemsWindowEndIndex
    : Math.ceil(
        (scrollPosition + (rootContainerRef.current?.clientHeight ?? 0)) /
          lineHeight
      )

  return useModal ? (
    <Fragment>
      <RawJsonField
        {...props}
        _collapsedPaths={collapsedPathsAdj}
        _setCollapsedPaths={setCollapsedPathsAdj}
        itemsWindowStartIndex={itemsWindowStartIndexAdj}
        itemsWindowEndIndex={itemsWindowEndIndexAdj}
      />
      {!isChildComponent && (
        <Button label={'Edit'} onClick={handleOpen} variant="outlined" />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        header={
          <Flex alignItems={'center'} gap={1}>
            <Typography>{props.label}</Typography>
            <Icon path={mdiPencil} size={0.75} />
          </Flex>
        }
        disableTopRightCloseButton
      >
        <RawJsonField
          {...props}
          useModal={false}
          disableLabel
          _collapsedPaths={collapsedPathsAdj}
          _setCollapsedPaths={setCollapsedPathsAdj}
          itemsWindowStartIndex={itemsWindowStartIndexAdj}
          itemsWindowEndIndex={itemsWindowEndIndexAdj}
        />
      </Modal>
    </Fragment>
  ) : isChildComponent ? (
    <RawJsonField
      {...rest}
      useModal={false}
      _collapsedPaths={collapsedPathsAdj}
      _setCollapsedPaths={setCollapsedPathsAdj}
      itemsWindowStartIndex={itemsWindowStartIndexAdj}
      itemsWindowEndIndex={itemsWindowEndIndexAdj}
    />
  ) : (
    <Box height="100%" overflow="auto" ref={rootContainerRef}>
      <RawJsonField
        {...rest}
        useModal={false}
        _collapsedPaths={collapsedPathsAdj}
        _setCollapsedPaths={setCollapsedPathsAdj}
        itemsWindowStartIndex={itemsWindowStartIndexAdj}
        itemsWindowEndIndex={itemsWindowEndIndexAdj}
      />
    </Box>
  )
}
