import { mdiDelete, mdiMinus, mdiPlus } from '@mdi/js'
import { Box, Typography, ClickAwayListener, Tooltip } from '@mui/material'
import { cloneDeep, isEqual } from 'lodash'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { Flex } from '../_wrapper'
import { Button } from '../buttons'
import { GenericInputField } from './GenericInputField'
import { JsonField } from './JsonField'

const tooltipSlotProps = { tooltip: { sx: { fontSize: 16 } } }
const buttonSlotProps = {
  typography: { variant: 'caption' as const },
}
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

const stopPropagation = (e: any) => e.stopPropagation()

type EditPropertyType = {
  path: (string | number)[]
  type: 'name' | 'value'
  tempValue: any
}

export type JsonObjectFieldProps = {
  value: Record<string, any>
  _path?: (string | number)[]
  editing?: EditPropertyType | null
  setEditing?: (prev: EditPropertyType | null) => EditPropertyType
  onChange: (
    value: Record<string, any>,
    e: { target: { name: string } }
  ) => void
  keysDict?: any
  name?: string
  disabled?: boolean
  _collapsedPaths?: string[]
  _setCollapsedPaths?: Dispatch<SetStateAction<string[]>>
  startCollapsed?: boolean
  startObjectsCollapsed?: boolean
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
  } = props
  const startCollapsedAdj = startObjectsCollapsed ?? startCollapsed

  const [editingInt, setEditingInt] = useState<EditPropertyType | null>(null)

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
        tempValue: valueIn[path[path.length - 1]],
      })
    },
    [editing, setEditing, valueIn]
  )

  const handleChangeTempValue = useCallback(
    (newValue: any) => {
      setEditing(((prev: any) => {
        if (prev) {
          return { ...prev, tempValue: newValue }
        }
        return null
      }) as any)
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
        newValue = newValue[pathAdj[i]]
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
        newValue = newValue[pathAdj[i]]
      }
      newValue[previousName] = value
      //   delete newValue[previousName]
      onChange(valueInCopy, { target: { name: nameIn ?? '' } })
    },
    [onChange, valueIn, nameIn, keysDict]
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
        newValue = newValue[pathAdj[i]]
      }

      if (newValue[previousName] !== undefined) {
        delete newValue[previousName]
        onChange(valueInCopy, { target: { name: nameIn ?? '' } })
      }
    },
    [valueIn, onChange, nameIn]
  )

  const handleAddObjectProperty = useCallback(
    (e: any) => {
      e.stopPropagation()
      const valueInCopy = cloneDeep(valueIn)
      const newValue = valueInCopy
      newValue['~new'] = ''
      onChange(valueInCopy, { target: { name: nameIn ?? '' } })
      const key = '~new'
      ;(setEditing as any)((current: any) => ({
        tempValue: valueInCopy[key],
        type: 'name',
        path: [..._path, key],
      }))
    },
    [valueIn, onChange, nameIn, _path, setEditing]
  )

  const handleToggleExpandObject = useCallback(() => {
    console.log('Collapsed Paths: ', _collapsedPaths, _path)
    _setCollapsedPaths?.((current) =>
      current.includes(_path.join('.'))
        ? current.filter((path) => path !== _path.join('.'))
        : [...current, _path.join('.')]
    )
  }, [_collapsedPaths, _path, _setCollapsedPaths])

  const expandedItems = useMemo(
    () => (startCollapsedAdj && _collapsedPaths ? _collapsedPaths : []),
    [startCollapsedAdj, _collapsedPaths]
  )
  const isCurrentFieldExpanded = startCollapsedAdj
    ? expandedItems.includes(_path.join('.'))
    : !_collapsedPaths?.includes(_path.join('.'))

  return valueIn && typeof valueIn === 'object' ? (
    <Box>
      {Object.keys(valueIn ?? {})?.length ? (
        <Fragment>
          <Flex>
            <Typography color="lightseagreen">{`{`}</Typography>
            <Button
              icon={isCurrentFieldExpanded ? mdiMinus : mdiPlus}
              iconButton
              variant="text"
              slotProps={buttonSlotProps}
              label={isCurrentFieldExpanded ? 'Collapse' : 'Expand'}
              onClick={handleToggleExpandObject}
            />
          </Flex>
          {isCurrentFieldExpanded && (
            <Box
              display="grid"
              gridTemplateColumns="max-content max-content"
              gap={'2px 24px'}
              ml={2}
            >
              {Object.keys(valueIn)
                .sort()
                ?.map((key) => {
                  const propertyValue = valueIn[key as keyof typeof valueIn]
                  // const pathUi = editing?.path
                  // const mappedPath = [..._path, key]
                  const handleClickPropName = (e: any) => {
                    e.stopPropagation()
                    console.debug('Current path is', _path, key, propertyValue)
                    toggleChangePropName([..._path, key])
                  }
                  const handleChangePropName = (newValue: string, e: any) => {
                    e?.stopPropagation()
                    handleChangeTempValue(newValue)
                  }
                  const handleKeyUpPropName = (e: any) => {
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
                        // eslint-disable-next-line no-extra-semi
                        ;(setEditing as any)((current: any) => ({
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
                  const handleChangeCompletedPropName = (newValue: any) => {
                    handleChangePropertyName([..._path, key], newValue)
                    const newPropertyValue = getNewPropertyValue(newValue)
                    if (
                      !Array.isArray(newPropertyValue) &&
                      typeof newPropertyValue !== 'object' &&
                      typeof newPropertyValue !== 'boolean'
                    ) {
                      // eslint-disable-next-line no-extra-semi
                      ;(setEditing as any)((current: any) => ({
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
                    const newPropertyValue = getNewPropertyValue(newTempValue)
                    if (newTempValue) {
                      handleChangePropertyName([..._path, key], newTempValue)
                      if (
                        !Array.isArray(newPropertyValue) &&
                        typeof newPropertyValue !== 'object' &&
                        typeof newPropertyValue !== 'boolean'
                      ) {
                        // eslint-disable-next-line no-extra-semi
                        ;(setEditing as any)((current: any) => ({
                          ...current,
                          tempValue: newPropertyValue,
                          path: [..._path, newTempValue],
                          type: 'value',
                        }))
                      } else {
                        setEditing(null)
                      }
                    } else {
                      setEditing(null)
                    }
                  }
                  const handleDeleteProperty = (e: any) => {
                    e.stopPropagation()
                    const path = [..._path, key]
                    // console.debug('PATH', path)
                    handleRemoveProperty(path)
                  }

                  const handleChangePropValue = (newValue: string, e: any) => {
                    e?.stopPropagation()
                    handleChangeTempValue(newValue)
                  }
                  const handleChangeCompletedPropValue = (
                    newValue: any,
                    e: any
                  ) => {
                    handleChangePropertyValue([..._path, key], newValue)
                  }

                  const handleKeyUpPropValue = (e: any) => {
                    if (e.key === 'Enter') {
                      handleChangePropertyValue(
                        [..._path, key],
                        editing?.tempValue
                      )
                      setEditing(null)
                    }
                  }
                  const handleToggleChangePropValue = (e: any) => {
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
                    newValuePerSubobject: any
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
                      !propertyValue as any
                    )
                    return
                  }

                  return (
                    <Fragment key={key}>
                      <Flex
                        gap={2}
                        justifyContent="space-between"
                        onClick={handleClickPropName}
                        position="relative"
                        minWidth={0}
                        maxWidth={200}
                      >
                        {!disabled &&
                        editing?.type === 'name' &&
                        isEqual(editing?.path, [..._path, key]) ? (
                          <ClickAwayListener
                            onClickAway={handleClickAwayOnEdit}
                          >
                            <Box
                              position={'relative'}
                              minWidth={0}
                              width="100%"
                              height={35}
                            >
                              <GenericInputField
                                {...{ options: proposedPropertyKeyOptions }}
                                autoFocus
                                type={
                                  proposedPropertyKeyOptions?.length
                                    ? 'autocomplete'
                                    : 'text'
                                }
                                value={editing?.tempValue}
                                onClick={stopPropagation}
                                onChange={handleChangePropName}
                                onKeyUp={handleKeyUpPropName}
                                onChangeCompleted={
                                  handleChangeCompletedPropName
                                }
                                size={'small'}
                                {...genericInputFieldProps}
                                disableHelperText
                                disableLabel
                              />
                            </Box>
                          </ClickAwayListener>
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
                              >
                                {`${key}:`}
                              </Typography>
                            </Tooltip>
                            {!disabled && (
                              <Button
                                iconButton
                                icon={mdiDelete}
                                iconSize={0.5}
                                sx={{ width: '1rem', height: '1rem', mt: 0.5 }}
                                onClick={handleDeleteProperty}
                              />
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
                              value={editing?.tempValue}
                              onChange={handleChangePropValue}
                              onClick={stopPropagation}
                              onChangeCompleted={handleChangeCompletedPropValue}
                              onKeyUp={handleKeyUpPropValue}
                              size={'small'}
                              {...genericInputFieldPropValueProps}
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
                          onClick={handleToggleChangePropValue}
                        >
                          {Array.isArray(propertyValue) ? (
                            <JsonField
                              disabled={disabled}
                              name={nameIn}
                              value={propertyValue}
                              _path={[..._path, key]}
                              editing={editing}
                              setEditing={setEditing as any}
                              onChange={handleChangeSubJsonField}
                              keysDict={keysDict?.[key]}
                            />
                          ) : ['object'].includes(typeof propertyValue) ? (
                            <JsonField
                              disabled={disabled}
                              name={nameIn}
                              value={propertyValue}
                              _path={[..._path, key]}
                              editing={editing}
                              setEditing={setEditing as any}
                              onChange={handleChangeSubJsonField}
                              keysDict={subJsonKeysDict}
                            />
                          ) : typeof propertyValue === 'boolean' ? (
                            <Flex alignItems="center" gap={1}>
                              {propertyValue.toString()}{' '}
                              <GenericInputField
                                value={propertyValue}
                                type="bool"
                                size="small"
                                sx={{ p: 0, pl: 1 }}
                                onChange={handleChangeBooleanValue}
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
                                width={200}
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                color="inherit"
                              >
                                {`"${propertyValue}"`}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              width={200}
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              color="inherit"
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
                  slotProps={buttonSlotProps}
                  sx={miniButtonStyles}
                  onClick={handleAddObjectProperty}
                  disabled={valueIn['~new'] !== undefined}
                >
                  Add Prop
                </Button>
              )}
            </Box>
          )}
          <Typography color="lightseagreen">{`}`}</Typography>
        </Fragment>
      ) : (
        <Flex justifyContent="flex-start" alignItems="center" gap={1}>
          <Typography>{`{`}</Typography>

          {!disabled && (
            <Button
              icon={mdiPlus}
              variant="text"
              slotProps={buttonSlotProps}
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
