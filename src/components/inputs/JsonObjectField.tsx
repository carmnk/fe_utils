import {
  mdiArrowDownDropCircleOutline,
  mdiDelete,
  mdiMinus,
  mdiPlus,
} from '@mdi/js'
import { Box, Typography, ClickAwayListener, Tooltip } from '@mui/material'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import {
  ChangeEvent,
  Dispatch,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Fragment } from 'react/jsx-runtime'
import { Flex } from '../_wrapper'
import { Button } from '../buttons'
import { GenericInputField } from './GenericInputField'
import { JsonField } from './JsonField'
import { getAmountJsonChildren } from './getAmountJsonChildren'
import { DropdownMenu } from '../dropdown'

const tooltipSlotProps = { tooltip: { sx: { fontSize: 16 } } }

const genericInputFieldProps = {
  sx: {
    width: '100%',
    height: 'auto !important',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slotProps: {
    input: {
      sx: {
        py: '4px !important',
        px: '2px',
        pl: '0px !important',
      },
    },
    inputContainer: {
      sx: {
        height: 'auto !important',
        pl: '0px !important',
      },
    },
    popper: {
      sx: { width: 'auto !important' },
    },
  },
}

const genericInputFieldPropValueProps = {
  sx: {
    minWidth: 140,
    width: '100%',
    height: 'auto !important',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slotProps: {
    input: {
      sx: {
        py: '4px !important',
        px: '2px',
        pl: '0px !important',
      },
    },
    inputContainer: {
      sx: {
        height: 'auto !important',
        pl: '0px !important',
      },
    },
  },
}
const miniButtonStyles = { width: 'max-content', m: 0 }

const stopPropagation: MouseEventHandler = (e) => e.stopPropagation()

type EditPropertyType = {
  path: (string | number)[]
  type: 'name' | 'value'
  tempValue: string | number | boolean | Record<string, unknown>
}

export type JsonObjectFieldProps = {
  value: Record<string, unknown>
  _path?: (string | number)[]
  editing?: EditPropertyType | null
  setEditing?: Dispatch<SetStateAction<EditPropertyType | null>>
  onChange: (
    value: Record<string, unknown>,
    e: { target: { name: string } }
  ) => void
  keysDict?: Record<string, string>
  name?: string
  disabled?: boolean
  _collapsedPaths?: string[]
  _setCollapsedPaths?: Dispatch<SetStateAction<string[]>>
  startCollapsed?: boolean
  startObjectsCollapsed?: boolean
  _index?: number
  hideLineNumbers?: boolean
  itemsWindowEndIndex?: number
  itemsWindowStartIndex?: number
  fontSize?: number
}

export const JsonObjectField = (props: JsonObjectFieldProps) => {
  const {
    value: valueIn,
    _path = [],
    editing: editingIn,
    setEditing: setEditingIn,
    onChange,
    keysDict,
    name: nameIn,
    disabled,
    _collapsedPaths,
    _setCollapsedPaths,
    startCollapsed,
    startObjectsCollapsed,
    _index,
    hideLineNumbers,
    itemsWindowStartIndex,
    itemsWindowEndIndex,
    fontSize,
  } = props
  const startCollapsedAdj = startObjectsCollapsed ?? startCollapsed

  const [editingInt, setEditingInt] = useState<EditPropertyType | null>(null)
  const [openChangeTypeDialog, setOpenChangeTypeDialog] = useState<
    string | null
  >(null)

  const editing = editingIn ?? editingInt
  const setEditing = setEditingIn ?? setEditingInt

  const proposedPropertyKeyOptions = useMemo(
    () =>
      (keysDict &&
        Object.keys(keysDict)?.length &&
        Object.keys(keysDict).map((val) => ({
          value: val,
          label: val,
        }))) ||
      [],
    [keysDict]
  )

  const getNewPropertyValue = useCallback(
    (newValue: string) =>
      keysDict?.[newValue] ?? (newValue.includes('&') ? {} : ''),
    [keysDict]
  )

  const toggleChangePropName = useCallback(
    (path: (string | number)[]) => {
      // sth is already in edit mode
      if (editing) {
        setEditing(null)
        return
      }
      const propertyKeyValue = path[path.length - 1]
      setEditing({
        path,
        type: 'name',
        tempValue: propertyKeyValue?.toString?.()?.startsWith('~new')
          ? ''
          : propertyKeyValue,
      })
    },
    [editing, setEditing]
  )
  const toggleChangePropValue = useCallback(
    (path: (string | number)[]) => {
      // sth is already in edit mode
      if (editing) {
        setEditing(null)
        return
      }
      setEditing({
        path,
        type: 'value',
        tempValue: valueIn[path[path.length - 1]] as string,
      })
    },
    [editing, setEditing, valueIn]
  )

  const handleChangeTempValue = useCallback(
    (newValue: string) => {
      setEditing((prev: EditPropertyType | null) => {
        if (prev) {
          return { ...prev, tempValue: newValue }
        }
        return null
      })
    },
    [setEditing]
  )

  const handleChangePropertyName = useCallback(
    (path: (string | number)[], name: string) => {
      const previousName = path[path.length - 1]
      const valueInCopy = cloneDeep(valueIn)
      let newValue = valueInCopy
      const pathAdj = path?.slice(-1)
      for (let i = 0; i < pathAdj.length - 1; i++) {
        if (!(pathAdj[i] in newValue)) {
          console.debug("Can't find path", pathAdj[i], newValue)
        }
        newValue = newValue[pathAdj[i]] as Record<string, unknown>
      }
      const newPropertyValue = keysDict?.[name] ?? newValue[previousName]

      newValue[name] = newPropertyValue
      if (name !== previousName) {
        delete newValue[previousName]
        onChange(valueInCopy, { target: { name: nameIn ?? '' } })
      }
    },
    [onChange, valueIn, keysDict, nameIn]
  )

  const handleChangePropertyValue = useCallback(
    (path: (string | number)[], value: string) => {
      const previousName = path[path.length - 1]
      const valueInCopy = cloneDeep(valueIn)
      let newValue = valueInCopy
      const pathAdj = path?.slice(-1)
      for (let i = 0; i < pathAdj.length - 1; i++) {
        if (!(pathAdj[i] in newValue)) {
          console.debug("Can't find path", pathAdj[i], newValue)
        }
        newValue = newValue[pathAdj[i]] as Record<string, unknown>
      }
      newValue[previousName] = value
      //   delete newValue[previousName]
      onChange(valueInCopy, { target: { name: nameIn ?? '' } })
    },
    [onChange, valueIn, nameIn]
  )

  const handleRemoveProperty = useCallback(
    (path: (string | number)[]) => {
      const previousName = path[path.length - 1]
      const valueInCopy = cloneDeep(valueIn)
      let newValue = valueInCopy
      const pathAdj = path?.slice(-1)
      for (let i = 0; i < pathAdj.length - 1; i++) {
        if (!(pathAdj[i] in newValue)) {
          console.debug("Can't find path", pathAdj[i], newValue)
        }
        newValue = newValue[pathAdj[i]] as Record<string, unknown>
      }

      if (newValue[previousName] !== undefined) {
        delete newValue[previousName]
        onChange(valueInCopy, { target: { name: nameIn ?? '' } })
      }
    },
    [valueIn, onChange, nameIn]
  )

  const handleAddObjectProperty = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      const valueInCopy = cloneDeep(valueIn)
      const newValue = valueInCopy
      newValue['~new'] = ''
      onChange(valueInCopy, { target: { name: nameIn ?? '' } })
      const key = '~new'
      setEditing({
        tempValue: valueInCopy[key] as string,
        type: 'name',
        path: [..._path, key],
      })
    },
    [valueIn, onChange, nameIn, _path, setEditing]
  )

  const handleToggleExpandObject = useCallback(() => {
    _setCollapsedPaths?.((current) => {
      return current.includes(_path.join('.'))
        ? current.filter((path) => path !== _path.join('.'))
        : [...current, _path.join('.')]
    })
  }, [_path, _setCollapsedPaths])

  const expandedItems = useMemo(
    () => (startCollapsedAdj && _collapsedPaths ? _collapsedPaths : []),
    [startCollapsedAdj, _collapsedPaths]
  )
  const isCurrentFieldExpanded = startCollapsedAdj
    ? expandedItems.includes(_path.join('.'))
    : !_collapsedPaths?.includes(_path.join('.'))

  const valueInKeysSorted = useMemo(
    () => Object.keys(valueIn ?? {}).sort(),
    [valueIn]
  )
  const previosItemsAmountArrRaw = valueInKeysSorted.map((key) =>
    getAmountJsonChildren(valueIn[key], [..._path, key], _collapsedPaths ?? [])
  )
  const previosItemsAmountArr = previosItemsAmountArrRaw.map((val) => {
    // const key = valueInKeysSorted[vIDx]
    const newPath = [..._path]
    if (_collapsedPaths?.includes(newPath.join('.'))) {
      return 0
    }
    return val
  })
  const previousItemsForChildren = previosItemsAmountArrRaw.map((val, vIDx) => {
    const key = valueInKeysSorted[vIDx]
    const newPath = [..._path, key]
    if (_collapsedPaths?.includes(newPath.join('.'))) {
      return 2
    }
    return val
  })

  const startLineIndex = (_index ?? 0) + 1
  const endLineIndex =
    startLineIndex +
    previosItemsAmountArr.reduce((acc, curr) => acc + curr, 0) +
    1

  return valueIn && typeof valueIn === 'object' ? (
    <Box>
      {Object.keys(valueIn ?? {})?.length ? (
        <Fragment>
          <Flex>
            <Typography color="lightseagreen">{`${
              !hideLineNumbers ? startLineIndex.toString() + ':' : ''
            }{`}</Typography>
            <Button
              icon={isCurrentFieldExpanded ? mdiMinus : mdiPlus}
              iconButton
              variant="text"
              // slotProps={buttonSlotProps}
              label={isCurrentFieldExpanded ? 'Collapse' : 'Expand'}
              onClick={handleToggleExpandObject}
            />
          </Flex>
          {isCurrentFieldExpanded && (
            <Box
              display="grid"
              gridTemplateColumns="max-content max-content"
              gap={'0px 24px'}
              ml={2}
            >
              {valueInKeysSorted?.map((key, kIdx) => {
                const propertyValue = valueIn[key as keyof typeof valueIn]
                // const pathUi = editing?.path
                // const mappedPath = [..._path, key]
                const handleClickPropName = (e: MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation()
                  toggleChangePropName([..._path, key])
                }
                const handleChangePropName = (
                  newValue: string,
                  e?: ChangeEvent<HTMLInputElement>
                ) => {
                  e?.stopPropagation()
                  handleChangeTempValue(newValue)
                }
                const handleKeyUpPropName = (
                  e: ChangeEvent<HTMLInputElement> & KeyboardEvent
                ) => {
                  const newValue = e?.target?.value
                  const name = editing?.path?.at(-1)
                  if ((e.key === 'Enter' || e.key === 'Tab') && name) {
                    handleChangePropertyName([..._path, key], newValue)
                    const newPropertyValue = getNewPropertyValue(newValue)
                    if (
                      !Array.isArray(newPropertyValue) &&
                      typeof newPropertyValue !== 'object' &&
                      typeof newPropertyValue !== 'boolean'
                    ) {
                      setEditing((current) => ({
                        ...(current ?? {}),
                        tempValue: newPropertyValue,
                        type: 'value',
                        path: [..._path, newValue],
                      }))
                    } else {
                      setEditing(null)
                    }
                  }
                }
                const handleChangeCompletedPropName = (newValue: string) => {
                  handleChangePropertyName([..._path, key], newValue)
                  const newPropertyValue = getNewPropertyValue(newValue)
                  if (
                    !Array.isArray(newPropertyValue) &&
                    typeof newPropertyValue !== 'object' &&
                    typeof newPropertyValue !== 'boolean'
                  ) {
                    setEditing((current) => ({
                      ...(current ?? {}),
                      tempValue: newPropertyValue,
                      type: 'value',
                      path: [..._path, newValue],
                    }))
                  } else {
                    setEditing(null)
                  }
                }
                const handleClickAwayOnEdit = () => {
                  const newTempValue = editing?.tempValue
                  const newPropertyValue = getNewPropertyValue(
                    newTempValue as string
                  )
                  if (newTempValue) {
                    handleChangePropertyName(
                      [..._path, key],
                      newTempValue as string
                    )
                    if (
                      !Array.isArray(newPropertyValue) &&
                      typeof newPropertyValue !== 'object' &&
                      typeof newPropertyValue !== 'boolean'
                    ) {
                      setEditing((current) => ({
                        ...current,
                        tempValue: newPropertyValue as string,
                        path: [..._path, newTempValue as string],
                        type: 'value',
                      }))
                    } else {
                      setEditing(null)
                    }
                  } else {
                    setEditing(null)
                  }
                }
                const handleDeleteProperty = (
                  e: MouseEvent<HTMLButtonElement>
                ) => {
                  e.stopPropagation()
                  const path = [..._path, key]
                  handleRemoveProperty(path)
                }
                const handlePropertyOpenChangeTypeDialog = (
                  e: MouseEvent<HTMLButtonElement>
                ) => {
                  e.stopPropagation()
                  // const path = [..._path, key]
                  // handleRemoveProperty(path)
                  // alert('change type dialog not yet implemented')
                  setOpenChangeTypeDialog(key)
                }
                const handleChangePropValueType = (
                  newValueType: string,
                  e?: ChangeEvent<HTMLInputElement>
                ) => {
                  e?.stopPropagation()
                  const newValue =
                    newValueType === 'object'
                      ? {}
                      : newValueType === 'number'
                        ? 0
                        : newValueType === 'boolean'
                          ? false
                          : ''
                  handleChangePropertyValue([..._path, key], newValue as string)
                  setEditing(null)
                }

                const handleChangePropValue = (
                  newValue: string,
                  e?: ChangeEvent<HTMLInputElement>
                ) => {
                  e?.stopPropagation()
                  handleChangeTempValue(newValue)
                }
                const handleChangeCompletedPropValue = (
                  newValue: string
                  // e: any
                ) => {
                  console.log('handleChangeCompletedPropValue', newValue)
                  handleChangePropertyValue([..._path, key], newValue)
                }

                const handleKeyUpPropValue: KeyboardEventHandler<
                  HTMLInputElement
                > = (e) => {
                  if (e.key === 'Enter') {
                    handleChangePropertyValue(
                      [..._path, key],
                      editing?.tempValue as string
                    )
                    setEditing(null)
                  }
                }
                const handleToggleChangePropValue = (
                  e: MouseEvent<HTMLDivElement>
                ) => {
                  e.stopPropagation()
                  if (
                    disabled ||
                    Array.isArray(propertyValue) ||
                    typeof propertyValue === 'object'
                  ) {
                    setEditing(null)
                    return
                  }
                  toggleChangePropValue([..._path, key])
                }
                const handleChangeSubJsonField = (
                  newValuePerSubobject: unknown
                ) =>
                  onChange(
                    {
                      ...valueIn,
                      [key]: newValuePerSubobject,
                    },
                    { target: { name: nameIn ?? '' } }
                  )
                const subJsonKeysDict =
                  [..._path, key]?.length &&
                  [..._path, key]?.length >= 1 &&
                  [..._path, key]?.at(-1)?.toString().includes('&') // last item of path is a jss subobject
                    ? keysDict
                    : keysDict?.[key]

                const handleChangeBooleanValue = () => {
                  if (disabled) {
                    return
                  }
                  handleChangePropertyValue(
                    [..._path, key],
                    !propertyValue as unknown as string // typing issue ?
                  )
                  return
                }

                const currentLineIndex =
                  startLineIndex +
                  1 +
                  previousItemsForChildren
                    .slice(0, kIdx)
                    .reduce((acc, curr) => acc + curr, 0)
                const isOutsideVirtualizationWindow =
                  currentLineIndex < (itemsWindowStartIndex ?? 0) - 10 ||
                  currentLineIndex > (itemsWindowEndIndex ?? 0) + 10

                const adjGenericInputFieldProps = {
                  ...genericInputFieldProps,
                  sx: {
                    ...genericInputFieldProps.sx,
                    p: 0,
                  },
                  slotProps: {
                    ...genericInputFieldProps.slotProps,
                    input: {
                      ...genericInputFieldProps.slotProps?.input,
                      sx: {
                        ...genericInputFieldProps.slotProps?.input?.sx,
                        fontSize: fontSize ? fontSize : '1rem',
                        p: 0.25,
                      },
                    },
                    inputContainer: {
                      ...genericInputFieldProps.slotProps?.input,
                      sx: {
                        ...genericInputFieldProps.slotProps?.input?.sx,
                        height: 'auto',
                        p: '0px !important',
                        pt: '0px !important',
                        pb: '0px !important',
                        px: '0px !important',
                        lineHeight: 0,
                      },
                    },
                  },
                }
                const adjGenericInputFieldPropValueProps = {
                  ...genericInputFieldPropValueProps,
                  sx: {
                    ...genericInputFieldPropValueProps.sx,
                    p: 0,
                  },
                  slotProps: {
                    input: {
                      ...genericInputFieldPropValueProps.slotProps?.input,
                      sx: {
                        fontSize: fontSize ? fontSize : '1rem',
                        p: 0.25,
                      },
                    },
                    inputContainer: {
                      ...genericInputFieldPropValueProps.slotProps
                        ?.inputContainer,
                      sx: {
                        ...genericInputFieldPropValueProps.slotProps
                          ?.inputContainer?.sx,
                        p: '0px !important',
                        pt: '0px !important',
                        pb: '0px !important',
                        px: '0px !important',
                        height: 'auto',
                      },
                    },
                  },
                }
                const changeTypes =
                  typeof propertyValue === 'number'
                    ? ['string', 'boolean', 'object']
                    : typeof propertyValue === 'string'
                      ? ['number', 'boolean', 'object']
                      : typeof propertyValue === 'boolean'
                        ? ['number', 'string', 'object']
                        : typeof propertyValue === 'object'
                          ? ['number', 'string', 'boolean']
                          : ['number', 'string', 'boolean', 'object']
                const changeTypeOptions = changeTypes.map((type) => ({
                  id: type,
                  label: type,
                  onClick: (e: MouseEvent) => {
                    e?.preventDefault?.()
                    e?.stopPropagation?.()
                    console.debug('change type to', type, e)
                    setOpenChangeTypeDialog(null)
                    handleChangePropValueType(type)
                  },
                }))

                return (
                  <Fragment key={key}>
                    <Flex
                      gap={2}
                      justifyContent="space-between"
                      onClick={handleClickPropName}
                      position="relative"
                      minWidth={0}
                      alignItems={'flex-start'}
                      // maxWidth={200}
                    >
                      {!disabled &&
                      editing?.type === 'name' &&
                      isEqual(editing?.path, [..._path, key]) ? (
                        <ClickAwayListener onClickAway={handleClickAwayOnEdit}>
                          <Box
                            position={'relative'}
                            minWidth={0}
                            width="100%"
                            height={35}
                            fontSize={fontSize}
                          >
                            {!hideLineNumbers &&
                              currentLineIndex.toString() + ':'}
                            <GenericInputField
                              {...{ options: proposedPropertyKeyOptions }}
                              autoFocus
                              type={
                                proposedPropertyKeyOptions?.length
                                  ? 'autocomplete'
                                  : 'text'
                              }
                              value={editing?.tempValue as string}
                              onClick={stopPropagation}
                              onChange={handleChangePropName}
                              onKeyUp={
                                handleKeyUpPropName as unknown as KeyboardEventHandler<HTMLInputElement>
                              }
                              onChangeCompleted={handleChangeCompletedPropName}
                              size={'small'}
                              {...adjGenericInputFieldProps}
                              disableHelperText
                              disableLabel
                            />
                          </Box>
                        </ClickAwayListener>
                      ) : isOutsideVirtualizationWindow ? (
                        <Box height={28.8} width="120px" visibility="hidden">
                          _
                        </Box>
                      ) : (
                        <>
                          <Tooltip
                            placement="top"
                            arrow
                            title={key}
                            slotProps={tooltipSlotProps}
                            disableInteractive
                          >
                            <Typography
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              color="inherit"
                              fontSize={fontSize}
                            >
                              {!hideLineNumbers &&
                                currentLineIndex.toString() + ':'}
                              {`${key}:`}
                            </Typography>
                          </Tooltip>
                          {!disabled && (
                            <Flex alignItems={'center'} gap={0.5}>
                              <Button
                                iconButton
                                icon={mdiDelete}
                                iconSize={'100%'}
                                sx={{
                                  width: fontSize ? fontSize * 1.5 : '1rem',
                                  height: fontSize ? fontSize * 1.5 : '1rem',
                                  // mt: 0.5,
                                }}
                                onClick={handleDeleteProperty}
                                tooltip={'Delete Property'}
                              />
                              <Button
                                id={'changeTypeButton' + key}
                                iconButton
                                icon={mdiArrowDownDropCircleOutline}
                                iconSize={'100%'}
                                sx={{
                                  width: fontSize ? fontSize * 1.5 : '1rem',
                                  height: fontSize ? fontSize * 1.5 : '1rem',
                                  // mt: 0.5,
                                }}
                                onClick={handlePropertyOpenChangeTypeDialog}
                                tooltip={'Change Value Type'}
                              />
                              <DropdownMenu
                                items={changeTypeOptions}
                                open={openChangeTypeDialog === key}
                                anchorEl={document.getElementById(
                                  'changeTypeButton' + key
                                )}
                                onClose={(e: unknown) => {
                                  if (e) {
                                    const event = e as MouseEvent
                                    event?.preventDefault?.()
                                    event?.stopPropagation?.()
                                  }
                                  setOpenChangeTypeDialog(null)
                                }}
                              />
                            </Flex>
                          )}
                        </>
                      )}
                    </Flex>
                    {!disabled &&
                    editing?.type === 'value' &&
                    isEqual(editing?.path, [..._path, key]) ? (
                      <ClickAwayListener onClickAway={() => setEditing(null)}>
                        <Box position={'relative'} minWidth={0} height={35}>
                          <GenericInputField
                            type={
                              typeof propertyValue === 'number'
                                ? 'number'
                                : 'text'
                            }
                            {...{ disableNumberSeparator: true }}
                            autoFocus
                            value={editing?.tempValue as string}
                            onChange={handleChangePropValue}
                            onClick={stopPropagation}
                            onChangeCompleted={handleChangeCompletedPropValue}
                            onKeyUp={handleKeyUpPropValue}
                            size={'small'}
                            {...adjGenericInputFieldPropValueProps}
                            disableHelperText
                            disableLabel
                          />
                        </Box>
                      </ClickAwayListener>
                    ) : (
                      <Box
                        color={
                          typeof propertyValue === 'number'
                            ? 'lightgreen'
                            : typeof propertyValue === 'string'
                              ? 'orange'
                              : typeof propertyValue === 'boolean'
                                ? 'royalblue'
                                : 'gray'
                        }
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        onClick={
                          typeof propertyValue === 'boolean'
                            ? undefined
                            : handleToggleChangePropValue
                        }
                      >
                        {Array.isArray(propertyValue) ? (
                          <JsonField
                            disabled={disabled}
                            name={nameIn}
                            value={propertyValue}
                            _path={[..._path, key]}
                            editing={editing}
                            setEditing={setEditing}
                            onChange={handleChangeSubJsonField}
                            keysDict={
                              keysDict?.[key] as unknown as Record<
                                string,
                                string
                              >
                            }
                            _index={startLineIndex + kIdx} // array start in the same line of the containing object prop
                            _collapsedPaths={_collapsedPaths}
                            _setCollapsedPaths={_setCollapsedPaths}
                            itemsWindowStartIndex={itemsWindowStartIndex}
                            itemsWindowEndIndex={itemsWindowEndIndex}
                            fontSize={fontSize}
                          />
                        ) : ['object'].includes(typeof propertyValue) ? (
                          <JsonField
                            disabled={disabled}
                            name={nameIn}
                            value={propertyValue as Record<string, unknown>}
                            _path={[..._path, key]}
                            editing={editing}
                            setEditing={setEditing}
                            onChange={handleChangeSubJsonField}
                            keysDict={subJsonKeysDict as Record<string, string>}
                            _index={startLineIndex + kIdx} // start on the same line as containing object prop
                            _collapsedPaths={_collapsedPaths}
                            _setCollapsedPaths={_setCollapsedPaths}
                            itemsWindowStartIndex={itemsWindowStartIndex}
                            itemsWindowEndIndex={itemsWindowEndIndex}
                            fontSize={fontSize}
                          />
                        ) : isOutsideVirtualizationWindow ? (
                          <Box height={28.8} width="120px" visibility="hidden">
                            _
                          </Box>
                        ) : typeof propertyValue === 'boolean' ? (
                          <Flex alignItems="center" gap={1}>
                            {propertyValue.toString()}{' '}
                            <GenericInputField
                              value={propertyValue}
                              type="bool"
                              size="small"
                              sx={{ p: 0, pl: 1 }}
                              onChange={handleChangeBooleanValue}
                              onClick={stopPropagation}
                            />
                          </Flex>
                        ) : typeof propertyValue === 'string' ? (
                          <Tooltip
                            title={propertyValue}
                            slotProps={tooltipSlotProps}
                            placement="top"
                            arrow
                            disableInteractive
                          >
                            <Typography
                              // width={200}
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              color="inherit"
                              fontSize={fontSize}
                            >
                              {`"${propertyValue}"`}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography
                            // width={200}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            color="inherit"
                            fontSize={fontSize}
                          >
                            {propertyValue as number}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Fragment>
                )
              })}

              {!disabled && (
                <Button
                  icon={mdiPlus}
                  variant="text"
                  // slotProps={buttonSlotProps}
                  sx={miniButtonStyles}
                  onClick={handleAddObjectProperty}
                  disabled={valueIn['~new'] !== undefined}
                >
                  Add Prop
                </Button>
              )}
            </Box>
          )}
          <Typography color="lightseagreen">
            {!hideLineNumbers && endLineIndex.toString() + ':'}
            {`}`}
          </Typography>
        </Fragment>
      ) : (
        <Flex justifyContent="flex-start" alignItems="center" gap={1}>
          <Typography>{`{`}</Typography>

          {!disabled && (
            <Button
              icon={mdiPlus}
              variant="text"
              // slotProps={buttonSlotProps}
              sx={miniButtonStyles}
              onClick={handleAddObjectProperty}
              disabled={valueIn['~new'] !== undefined}
            >
              Add Prop
            </Button>
          )}
          <Typography>{`}`}</Typography>
        </Flex>
      )}
    </Box>
  ) : null
}
