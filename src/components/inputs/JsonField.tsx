import { mdiDelete, mdiPlus } from '@mdi/js'
import { Box, Typography, ClickAwayListener } from '@mui/material'
import { cloneDeep, isEqual } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { Flex } from '../_wrapper'
import { Button } from '../buttons'
import { GenericInputField } from './GenericInputField'

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
  } = props

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
  //   const [ui, setUi] = useState({
  //     editProperty: null as {
  //       path: (string | number)[]
  //       type: 'name' | 'value'
  //     } | null,
  //   })

  const toggleChangePropName = useCallback(
    (path: (string | number)[]) => {
      // sth is already in edit mode
      if (editing) {
        console.debug(
          'JsonField.tsx - toggleChangePropName editing=true -> close - path:',
          path
        )
        setEditing(null)
        return
      }
      const propertyKeyValue = path[path.length - 1]
      console.debug(
        'JsonField.tsx - toggleChangePropName - path:',
        path,
        propertyKeyValue
      )
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
        console.debug(
          'JsonField.tsx - toggleChangePropValue editing=true -> close - path:',
          path
        )
        setEditing(null)
        return
      }
      console.warn('JsonField.tsx - toggleChangePropValue - path:', path)
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
      console.debug('JsonField.tsx - handleChangeTempValue ', newValue, editing)
      setEditing(((prev: any) => {
        if (prev) {
          return { ...prev, tempValue: newValue }
        }
        return null
      }) as any)
    },
    [setEditing, editing]
  )

  const handleChangePropertyName = useCallback(
    (path: (string | number)[], name: string) => {
      console.debug(
        'JsonField.tsx - handleChangePropertyName',
        path,
        name,
        valueIn,
        keysDict
      )

      const previousName = path[path.length - 1]
      const valueInCopy = cloneDeep(valueIn)
      let newValue = valueInCopy
      const pathAdj = path?.slice(-1)
      for (let i = 0; i < pathAdj.length - 1; i++) {
        // console.log('Current Value', newValue, pathAdj[i], valueInCopy)
        if (!(pathAdj[i] in newValue)) {
          console.warn("Can't find path", pathAdj[i], newValue)
        }
        newValue = newValue[pathAdj[i]]
      }
      const newPropertyValue = keysDict?.[name] ?? newValue[previousName]

      newValue[name] = newPropertyValue
      if (name !== previousName) {
        delete newValue[previousName]
        console.debug(
          'JsonField.tsx - handleChangePropertyName - before onChange()',
          valueInCopy,
          { target: { name: nameIn ?? '' } }
        )
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

      console.debug(
        'JsonField.tsx - handleChangePropertyName',
        path,
        previousName,
        valueIn,
        keysDict,
        newValue
      )
      for (let i = 0; i < pathAdj.length - 1; i++) {
        // console.log('Current Value', newValue, pathAdj[i], valueInCopy)
        if (!(pathAdj[i] in newValue)) {
          console.warn("Can't find path", pathAdj[i], newValue)
        }
        newValue = newValue[pathAdj[i]]
        // console.log('NEW VALUSE STEP', newValue?.[pathAdj?.[i]], pathAdj?.[i])
      }
      //   console.log(
      //     'NEW VALUE',
      //     newValue,
      //     path,
      //     name,
      //     previousName,
      //     'V in',
      //     valueIn
      //   )
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
          console.warn("Can't find path", pathAdj[i], newValue)
        }
        newValue = newValue[pathAdj[i]]
      }

      if (newValue[previousName] !== undefined) {
        delete newValue[previousName]
        console.debug(
          'JsonField.tsx - handleRemoveProperty',
          path,
          valueInCopy,
          {
            target: { name: nameIn ?? '' },
          }
        )
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
      //   const pathAdj = path?.slice(-1)
      //   for (let i = 0; i < pathAdj.length; i++) {
      //     if (!(pathAdj[i] in newValue)) {
      //       console.warn("Can't find path", pathAdj[i], newValue)
      //     }
      //     newValue = newValue[pathAdj[i]]
      //   }
      newValue['~new'] = ''
      console.debug('JsonField.tsx - handleAddObjectProperty', e, valueInCopy, {
        target: { name: nameIn ?? '' },
      })
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

  return typeof valueIn === 'object' ? (
    <Box>
      {Object.keys(valueIn)?.length ? (
        <Fragment>
          <Typography color="lightseagreen">{`{`}</Typography>
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
                const pathUi = editing?.path
                const mappedPath = [..._path, key]
                console.debug(
                  'JsonField.tsx - Object keys - paths',
                  nameIn,
                  propertyValue,
                  editing,
                  [..._path, key]
                )
                return (
                  <Fragment key={key}>
                    <Flex
                      gap={2}
                      justifyContent="space-between"
                      //   alignItems="center"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.warn(
                          'Current path is',
                          _path,
                          key,
                          propertyValue
                        )
                        toggleChangePropName([..._path, key])
                      }}
                      position="relative"
                      minWidth={0}
                    >
                      {editing?.type === 'name' &&
                      isEqual(editing?.path, [..._path, key]) ? (
                        <ClickAwayListener
                          onClickAway={() => {
                            const newTempValue = editing?.tempValue
                            const newPropertyValue =
                              getNewPropertyValue(newTempValue)
                            // keysDict?.[newTempValue] ??
                            // (newTempValue.includes('&') ? {} : '')
                            console.debug(
                              'JsonField.tsx - PropertyName-Field Clickaway',
                              editing,
                              newPropertyValue
                            )
                            if (newTempValue) {
                              handleChangePropertyName(
                                [..._path, key],
                                newTempValue
                              )
                              // ;(setEditing as any)((current: any) => ({
                              //   ...current,
                              //   tempValue: newPropertyValue,
                              //   path: [..._path, newTempValue],
                              //   type: 'value',
                              // }))
                              if (
                                !Array.isArray(newPropertyValue) &&
                                typeof newPropertyValue !== 'object'
                              ) {
                                // eslint-disable-next-line no-extra-semi
                                ;(setEditing as any)((current: any) => ({
                                  ...current,
                                  tempValue: newPropertyValue,
                                  path: [..._path, newTempValue],
                                  type: 'value',
                                }))
                              }
                            } else {
                              setEditing(null)
                            }
                          }}
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
                              onClick={(e: any) => {
                                e.stopPropagation()
                              }}
                              onChange={(newValue: string, e) => {
                                e?.stopPropagation()
                                handleChangeTempValue(newValue)
                              }}
                              onKeyUp={(e: any) => {
                                const newValue = e?.target?.value
                                const name = editing?.path?.at(-1)
                                // const newName = editing?.tempValue
                                // console.log('NEWNAME', newName)
                                console.info(
                                  'JsonField.tsx - PropertyName Field - onKeyUp',
                                  e.key,
                                  name
                                )
                                if (
                                  (e.key === 'Enter' || e.key === 'Tab') &&
                                  name
                                ) {
                                  handleChangePropertyName(
                                    [..._path, key],
                                    newValue
                                  )

                                  const newPropertyValue =
                                    getNewPropertyValue(newValue)
                                  // keysDict?.[newValue] ??
                                  // (newValue.includes('&') ? {} : '')
                                  // ;(setEditing as any)((current: any) => ({
                                  //   ...(current ?? {}),
                                  //   tempValue: newPropertyValue,
                                  //   type: 'value',
                                  //   path: [..._path, newValue],
                                  // }))
                                  console.info(
                                    'JsonField.tsx - PropertyName Field - onKeyUp - Enter pressed',
                                    e.key,
                                    name,
                                    [..._path, key],
                                    editing,
                                    newPropertyValue
                                  )
                                  if (
                                    !Array.isArray(newPropertyValue) &&
                                    typeof newPropertyValue !== 'object'
                                  ) {
                                    // eslint-disable-next-line no-extra-semi
                                    ;(setEditing as any)((current: any) => ({
                                      ...(current ?? {}),
                                      tempValue: newPropertyValue,
                                      type: 'value',
                                      path: [..._path, newValue],
                                    }))
                                  }
                                }
                              }}
                              onChangeCompleted={(newValue: any) => {
                                handleChangePropertyName(
                                  [..._path, key],
                                  newValue
                                )
                                const newPropertyValue =
                                  getNewPropertyValue(newValue)
                                // keysDict?.[newValue] ??
                                // (newValue.includes('&') ? {} : '')
                                console.debug(
                                  'JsonField.tsx - PropertyName Field - OnChangeCompleted',
                                  newValue,
                                  [..._path, key]
                                )
                                if (
                                  !Array.isArray(newPropertyValue) &&
                                  typeof newPropertyValue !== 'object'
                                ) {
                                  // eslint-disable-next-line no-extra-semi
                                  ;(setEditing as any)((current: any) => ({
                                    ...(current ?? {}),
                                    tempValue: newPropertyValue,
                                    type: 'value',
                                    path: [..._path, newValue],
                                  }))
                                }
                              }}
                              size={'small'}
                              sx={{
                                width: '100%',
                                height: 'auto !important',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                              }}
                              slotProps={{
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
                              }}
                              disableHelperText
                              disableLabel
                            />
                          </Box>
                        </ClickAwayListener>
                      ) : (
                        <>
                          {`${key}:`}
                          <Button
                            iconButton
                            icon={mdiDelete}
                            iconSize={0.5}
                            sx={{ width: '1rem', height: '1rem', mt: 0.5 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              const path = [..._path, key]
                              console.debug('PATH', path)
                              handleRemoveProperty(path)
                            }}
                          />
                        </>
                      )}
                    </Flex>
                    {editing?.type === 'value' &&
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
                            onChange={(newValue: string, e) => {
                              e?.stopPropagation()
                              // handleChangePropertyName(
                              //   [..._path, key],
                              //   newValue
                              // )
                              handleChangeTempValue(newValue)
                            }}
                            onClick={(e: any) => {
                              e.stopPropagation()
                            }}
                            onChangeCompleted={(newValue: any) => {
                              console.warn('ARASRA', newValue, [..._path, key])
                              handleChangePropertyValue(
                                [..._path, key],
                                newValue
                              )
                            }}
                            onKeyUp={(e: any) => {
                              if (e.key === 'Enter') {
                                //   alert('NAME + ' + editing?.tempValue)
                                handleChangePropertyValue(
                                  [..._path, key],
                                  editing?.tempValue
                                )
                                setEditing(null)
                              }
                            }}
                            size={'small'}
                            sx={{
                              minWidth: 140,
                              width: '100%',
                              height: 'auto !important',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                            }}
                            slotProps={{
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
                            }}
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
                        onClick={(e) => {
                          e.stopPropagation()
                          if (
                            Array.isArray(propertyValue) ||
                            typeof propertyValue === 'object'
                          ) {
                            setEditing(null)
                            return
                          }
                          console.warn(
                            'Current path is',
                            _path,
                            key,
                            propertyValue
                          )
                          toggleChangePropValue([..._path, key])
                        }}
                      >
                        {Array.isArray(propertyValue) ? (
                          <JsonField
                            name={nameIn}
                            value={propertyValue}
                            _path={[..._path, key]}
                            editing={editing}
                            setEditing={setEditing as any}
                            onChange={(newValuePerSubobject: any) =>
                              onChange(
                                {
                                  ...valueIn,
                                  [key]: newValuePerSubobject,
                                },
                                { target: { name: nameIn ?? '' } }
                              )
                            }
                            keysDict={keysDict?.[key]}
                          />
                        ) : ['object'].includes(typeof propertyValue) ? (
                          <JsonField
                            name={nameIn}
                            value={propertyValue}
                            _path={[..._path, key]}
                            editing={editing}
                            setEditing={setEditing as any}
                            onChange={(newValuePerSubobject: any) =>
                              onChange(
                                {
                                  ...valueIn,
                                  [key]: newValuePerSubobject,
                                },
                                { target: { name: nameIn ?? '' } }
                              )
                            }
                            keysDict={keysDict?.[key]}
                          />
                        ) : typeof propertyValue === 'boolean' ? (
                          <Flex alignItems="center" gap={1}>
                            {propertyValue.toString()}{' '}
                            <GenericInputField
                              value={propertyValue}
                              type="bool"
                              size="small"
                              sx={{ p: 0, pl: 1 }}
                              onChange={() => {
                                handleChangePropertyValue(
                                  [..._path, key],
                                  !propertyValue as any
                                )
                                return
                              }}
                              onClick={(e: any) => {
                                e?.stopPropagation?.()
                                return
                              }}
                            />
                          </Flex>
                        ) : typeof propertyValue === 'string' ? (
                          `"${propertyValue}"`
                        ) : (
                          (propertyValue as number)
                        )}
                      </Box>
                    )}
                  </Fragment>
                )
              })}

            {/* <Flex justifyContent="flex-start" alignItems="center">
              <Button
                iconButton
                icon={mdiPlus}
                variant="outlined"
                size="small"
                sx={{ width: '1rem', height: '1rem' }}
                onClick={handleAddObjectProperty}
              />
            </Flex>
            <Button
              variant="text"
              slotProps={{
                typography: { variant: 'caption' },
              }}
              sx={{ width: 'max-content' }}
            >
              Add Item
            </Button> */}
            <Button
              icon={mdiPlus}
              variant="text"
              slotProps={{
                typography: { variant: 'caption' },
              }}
              sx={{ width: 'max-content', m: 0 }}
              onClick={handleAddObjectProperty}
              disabled={valueIn['~new'] !== undefined}
            >
              Add Prop
            </Button>
          </Box>
          <Typography color="lightseagreen">{`}`}</Typography>
        </Fragment>
      ) : (
        <Flex justifyContent="flex-start" alignItems="center" gap={1}>
          <Typography>{`{`}</Typography>

          <Button
            icon={mdiPlus}
            variant="text"
            slotProps={{
              typography: { variant: 'caption' },
            }}
            sx={{ width: 'max-content', m: 0 }}
            onClick={handleAddObjectProperty}
            disabled={valueIn['~new'] !== undefined}
          >
            Add Prop
          </Button>
          <Typography>{`}`}</Typography>
        </Flex>
      )}
    </Box>
  ) : null
}

export type JsonFieldProps = {
  label?: string
  value: Record<string, any> | Record<string, any>[]
  _path?: (string | number)[]
  editing: EditPropertyType | null
  setEditing: (prev: EditPropertyType) => EditPropertyType
  onChange: (
    value: Record<string, any>,
    e: {
      target: { name: string }
    }
  ) => void
  keysDict?: any
  name?: string
}

export const JsonField = (props: JsonFieldProps) => {
  const {
    value,
    _path = [],
    editing,
    setEditing,
    onChange,
    label,
    keysDict,
    name,
  } = props
  return (
    <Box>
      {!_path?.length && <Typography variant="caption">{label}</Typography>}
      {Array.isArray(value) ? (
        value.length ? (
          <Box>
            <Typography color="gold">{`[`}</Typography>
            {value.map((item, index) => (
              <Box key={index} ml={2} position="relative">
                <JsonField
                  name={name}
                  keysDict={keysDict?.[0]}
                  value={item}
                  _path={[..._path, index]}
                  editing={editing}
                  setEditing={setEditing}
                  onChange={(newValuePerItem: any) =>
                    onChange(
                      value?.map((v, vIdx) =>
                        vIdx === index ? newValuePerItem : v
                      ) || [],
                      { target: { name: name ?? '' } }
                    )
                  }
                />
                <Button
                  icon={mdiDelete}
                  variant="text"
                  slotProps={{
                    typography: { variant: 'caption' },
                  }}
                  sx={{ position: 'absolute', bottom: 0, left: '16px' }}
                  label="Delete Item"
                  onClick={() => {
                    onChange(value?.filter((v, vIdx) => vIdx !== index) || [], {
                      target: { name: name ?? '' },
                    })
                  }}
                />
              </Box>
            ))}
            <Button
              icon={mdiPlus}
              variant="text"
              slotProps={{
                typography: { variant: 'caption' },
              }}
              sx={{ width: 'max-content', m: 0 }}
              onClick={() => {
                if (Array.isArray(keysDict)) {
                  const newItem = keysDict?.[0]
                  onChange([...value, newItem], {
                    target: { name: name ?? '' },
                  })
                }
                console.debug(
                  'VALUE: ',
                  value,
                  'Path: ',
                  _path,
                  'Editing',
                  editing,
                  keysDict
                )
              }}
            >
              Add Item
            </Button>
            <Typography color="gold">{`]`}</Typography>
          </Box>
        ) : (
          <Flex>
            <Typography>{`[`}</Typography>
            <Button
              icon={mdiPlus}
              variant="text"
              slotProps={{
                typography: { variant: 'caption' },
              }}
              sx={{ width: 'max-content', m: 0 }}
              onClick={() => {
                if (Array.isArray(keysDict)) {
                  const newItem = keysDict?.[0]
                  onChange([...value, newItem], {
                    target: { name: name ?? '' },
                  })
                }
                console.debug(
                  'VALUE: ',
                  value,
                  'Path: ',
                  _path,
                  'Editing',
                  editing,
                  keysDict
                )
              }}
            >
              Add Item
            </Button>
            <Typography>{`]`}</Typography>
          </Flex>
        )
      ) : (
        <JsonObjectField
          name={name}
          value={value}
          _path={[..._path]}
          editing={editing}
          setEditing={setEditing as any}
          onChange={onChange}
          keysDict={keysDict}
        />
      )}
    </Box>
  )
}
