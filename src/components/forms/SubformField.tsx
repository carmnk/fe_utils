import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import { GenericForm, GenericFormProps } from './GenericForm'
import { Button } from '../buttons'
import { DynamicFieldDefinition } from './fields'
import { Fragment } from 'react/jsx-runtime'
import { Table } from '../table'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type SubformFieldProps = {
  field: DynamicFieldDefinition
  formData: any
  rootFormData: any
  onChangeFormData: any
  showError: boolean
  subforms?: Record<string, any>
  settings: any
  useAlwaysArraysInFormData: boolean
  _path?: any[]
  fIdx: any
  slotProps: GenericFormProps['slotProps']
}

export const SubformField = (props: SubformFieldProps) => {
  const {
    field,
    formData,
    rootFormData,
    onChangeFormData,
    showError,
    subforms,
    settings,
    useAlwaysArraysInFormData,
    _path,
    fIdx,
    slotProps,
  } = props

  const [ui, setUi] = useState({
    open: null as number | 'new' | null,
  })

  const handleSetOpen = useCallback((newUi: number | 'new' | null) => {
    setUi((current) => ({
      open: current?.open !== null && current.open === newUi ? null : newUi,
    }))
  }, [])

  const theme = useTheme()

  const arrayIdxRaw = _path?.slice(-1)?.[0]
  const ArrayIdx = typeof arrayIdxRaw === 'number' ? arrayIdxRaw : undefined

  const fieldName: string | undefined = field?.name
  const subform = subforms?.[fieldName ?? '']

  const sub = subforms?.[field?.name ?? '']
  const subFieldsForList = useMemo(
    () => sub?.fields?.filter((f: any) => f?.form?.showInArrayList) || [],
    [sub?.fields]
  )

  const makeOnChangeArraySub = useCallback(
    (arrayIndex: number) => {
      return (
        newFormData: any,
        changedPropertyName: any,
        changedPropertyValue: any,
        prevFormData: any
      ) => {
        if (!fieldName) return
        const transformedNewFormData = {
          ...formData,
          [fieldName]: formData?.[fieldName]?.length
            ? formData?.[fieldName]?.map((f: any, fIdx: number) =>
                fIdx === arrayIndex ? newFormData?.[fieldName]?.[arrayIndex] : f
              )
            : [newFormData],
        }
        onChangeFormData?.(
          transformedNewFormData,
          changedPropertyName,
          changedPropertyValue,
          formData,
          fieldName
        )
      }
    },
    [fieldName, formData, onChangeFormData]
  )

  const handleRemoveArrayItem = useCallback(
    (removeIdx: number) => {
      if (!ui?.open || ui?.open === 'new' || !fieldName) return
      const newFormData = {
        ...formData,
        [fieldName]: formData?.[fieldName]?.filter(
          (f: any, fIdx2: number) => fIdx2 !== removeIdx
        ),
      }
      console.log(newFormData, fieldName, formData)
      onChangeFormData?.(
        newFormData,
        fieldName,
        formData?.[fieldName],
        formData,
        fieldName
      )
    },
    [ui?.open, formData, fieldName, onChangeFormData]
  )

  const arrayTableProps = useMemo(
    () =>
      ({
        getTrProps: (item: any, rIdx: number) =>
          rIdx === ui.open
            ? {
                sx: { bgcolor: theme.palette.action.selected + ' !important' },
              }
            : undefined,
        data: formData?.[fieldName ?? ''] || [],
        columns: [
          ...subFieldsForList.map((f: any) => ({
            header: f.label,
            renderCell: f.name,
          })),
          {
            header: (
              <Button
                icon={mdiPlus}
                iconButton
                variant={ui?.open === 'new' ? 'outlined' : 'text'}
                sx={
                  ui?.open === 'new'
                    ? { bgcolor: theme.palette.action.selected }
                    : undefined
                }
                // variant="outlined"
                // color="secondary"
                onClick={() => {
                  handleSetOpen('new')
                }}
              />
            ),
            renderCell: (item: any, cIdx: number, rIdx: number) => (
              <Box component="td" display="flex" alignItems="center" gap={1}>
                <Button
                  icon={mdiPencil}
                  iconButton
                  variant={ui?.open === rIdx ? 'outlined' : 'text'}
                  onClick={() => {
                    handleSetOpen(rIdx)
                  }}
                />
                <Button
                  icon={mdiDelete}
                  iconButton
                  variant="text"
                  onClick={() => handleRemoveArrayItem(rIdx)}
                />
              </Box>
            ),
            style: {
              width: '64px',
              display: 'flex',
              justifyContent: 'flex-end',
              pr: 0,
            },
          },
        ],
      }) as any,
    [
      formData,
      fieldName,
      subFieldsForList,
      ui,
      theme.palette,
      handleSetOpen,
      handleRemoveArrayItem,
    ]
  )

  const [tempFormData, setTempFormData] = useState<any>({})

  useEffect(() => {
    if (ui?.open === 'new') {
      setTempFormData(
        sub?.injections?.initialFormData?.(formData, rootFormData, ArrayIdx) ||
          {}
      )
    } else if (typeof ui?.open === 'number') {
      console.log(
        'FORMDATA',
        formData,
        fieldName,
        ui?.open,
        formData?.[fieldName ?? '']?.[ui?.open]
      )
      setTempFormData(formData?.[fieldName ?? '']?.[ui?.open] ?? {})
    }
  }, [ui?.open])

  if (!fieldName || !subform) return null
  const onChangeObjectSub = (
    newFormData: any,
    changedPropertyName: any,
    changedPropertyValue: any,
    prevFormData: any
  ) => {
    const transformedNewFormData = {
      ...formData,
      [fieldName]: useAlwaysArraysInFormData ? [newFormData] : newFormData,
    }
    onChangeFormData?.(
      transformedNewFormData,
      changedPropertyName,
      changedPropertyValue,
      formData,
      fieldName
    )
  }

  const addnewItemArraySub = (changedPropertyName: any, prevFormData: any) => {
    if (!fieldName) return
    const prevArrayFormData = prevFormData?.[fieldName]

    const injectedFormDataRaw =
      subforms?.[fieldName]?.injections?.initialFormData
    const injectedRawFormData =
      (typeof injectedFormDataRaw === 'function'
        ? injectedFormDataRaw(formData, rootFormData, (ArrayIdx ?? -1) + 1)
        : injectedFormDataRaw) ?? {}
    const newItem = {
      ...injectedFormDataRaw,
      ...tempFormData,
    }

    const newValue = [...(prevArrayFormData ?? []), newItem]
    const transformedNewFormData = {
      ...formData,
      [fieldName]: newValue,
    }
    onChangeFormData?.(
      transformedNewFormData,
      changedPropertyName,
      newValue,
      formData
    )
  }

  return field.type === 'object' &&
    !Array.isArray(subform) &&
    subform?.fields ? (
    <Fragment key={fIdx}>
      <Box pb={2}>
        <Divider />
      </Box>
      <Box>
        <Typography fontWeight="bold" paddingBottom={1}>
          {fieldName}
        </Typography>
        <GenericForm
          useAlwaysArraysInFormData={useAlwaysArraysInFormData}
          key={fIdx}
          fields={subform?.fields}
          injections={subform?.injections}
          settings={settings}
          formData={
            useAlwaysArraysInFormData
              ? formData?.[fieldName]?.[0]
              : formData?.[fieldName]
          } //?? subforms?.[fieldName]?.injections?.initialFormData ?? {}}
          onChangeFormData={onChangeObjectSub}
          rootFormData={formData}
          onChangeFormDataRoot={onChangeFormData as (newValue: any) => void}
          _path={[...(_path ?? []), field.name]}
          showError={showError}
          subforms={subform?.subforms}
          slotProps={slotProps}
        />
      </Box>
    </Fragment>
  ) : field.type === 'array' ? (
    <Fragment key={fIdx}>
      <Box py={2}>
        <Divider />
      </Box>
      <Typography fontWeight="bold">{fieldName}</Typography>
      <Box>
        <Box>
          <Table {...arrayTableProps} />
          {/* <Box
          display="grid"
          gridTemplateColumns={subFieldsForList
            .map(() => 'max-content')
            .join(' ')}
          gap={'0 16px'}
          
        >
          {subFieldsForList?.map((f: any, fIdx2: number) => (
            <Box key={fIdx + '_' + fIdx2} fontWeight={700} bgcolor="silver">
              {f.label}
            </Box>
          ))}
          {(formData?.[fieldName]?.length
            ? formData?.[fieldName]
            : [{}]
          )?.map?.((f: any, fIdx2: number) => {
            const removeItemArraySub = () => {
              if (!field?.name) return

              const newValue = formData?.[field?.name]?.filter(
                (dat: any, dIdx: number) => dIdx !== fIdx
              )
              const transformedNewFormData = {
                ...formData,
                [field.name]: newValue,
              }

              const injectedFormData =
                (
                  subforms?.[fieldName] as any
                )?.injections?.onBeforeRemoveArrayItem?.(
                  transformedNewFormData,
                  formData,
                  field.name,
                  fIdx
                ) ?? transformedNewFormData

              onChangeFormData?.(
                injectedFormData,
                field.name,
                newValue,
                formData
              )
            }

            const injectedFormDataRaw = sub.injections?.initialFormData
            const injectedFormData =
              (typeof injectedFormDataRaw === 'function'
                ? injectedFormDataRaw(formData, rootFormData, ArrayIdx)
                : injectedFormDataRaw) ?? {}

            console.log('sub', sub)
            return formData?.[fieldName]?.map((f: any) =>
              sub?.fields
                ?.filter((f: any) => f?.form?.showInArrayList)
                ?.map((field) => (
                  <Box key={fIdx + '_' + fIdx2}>{f?.[field?.name]}</Box>
                ))
            )
            {
              /* {fIdx2 ? (
                  <Box mb={2} paddingX={4}>
                    <Divider variant="middle" />
                  </Box>
                ) : null} */}
          {/* <GenericForm
                  useAlwaysArraysInFormData={useAlwaysArraysInFormData}
                  fields={sub?.fields}
                  injections={sub?.injections}
                  settings={settings}
                  onChangeFormData={makeOnChangeArraySub(fIdx2)}
                  onChangeFormDataRoot={
                    onChangeFormData as (newValue: any) => void
                  }
                  formData={formData?.[fieldName]?.[fIdx2] ?? injectedFormData}
                  rootFormData={rootFormData}
                  _removeFormFromArray={removeItemArraySub}
                  _path={[...(_path ?? []), field.name, fIdx2]}
                  showError={showError}
                  disableTopSpacing={true}
                  slotProps={slotProps}
                /> 
            }

            // )
          })}
        </Box> */}
        </Box>
        {ui?.open !== null && (
          <Box mt={2}>
            <Typography>
              {ui?.open === 'new'
                ? `Add ${field.name} item`
                : `Edit ${field.name} item`}
            </Typography>
            <GenericForm
              useAlwaysArraysInFormData={useAlwaysArraysInFormData}
              fields={sub?.fields}
              injections={sub?.injections}
              settings={settings}
              onChangeFormData={setTempFormData}
              // onChangeFormDataRoot={onChangeFormData as (newValue: any) => void}
              // formData={formData?.[fieldName]?.[fIdx2] ?? injectedFormData}
              // rootFormData={rootFormData}
              // _removeFormFromArray={removeItemArraySub}
              // _path={[...(_path ?? []), field.name, fIdx2]}
              showError={showError}
              disableTopSpacing={true}
              slotProps={slotProps}
              formData={tempFormData}
              // onChangeFormData={onChangeObjectSub}
            />
            {ui?.open !== null && (
              <Button
                variant="outlined"
                label={ui?.open === 'new' ? 'Add' : 'Edit'}
                // onClick={() => addnewItemArraySub(field.name, formData)}
                // onClick={() => setUi({ open: 'new' })}
                onClick={
                  ui?.open === 'new'
                    ? () => addnewItemArraySub(field.name ?? '', formData)
                    : () => {
                        if (!ui?.open || ui?.open === 'new') return
                        const newFormData = {
                          ...formData,
                          [fieldName]: formData?.[fieldName]?.map(
                            (f: any, fIdx2: number) =>
                              fIdx2 === ui?.open ? tempFormData?.[fieldName] : f
                          ),
                        }
                        console.log(newFormData, fieldName, formData)
                        makeOnChangeArraySub(ui?.open)(
                          newFormData,
                          fieldName,
                          newFormData[fieldName],
                          formData
                        )
                      }
                }
                icon={ui?.open === 'new' ? mdiPlus : mdiPencil}
              />
            )}
          </Box>
        )}
        <Box py={3}>
          <Divider />
        </Box>
      </Box>
    </Fragment>
  ) : null
}
