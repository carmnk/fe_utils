import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { Box, Divider, Typography, useTheme } from '@mui/material'
import { GenericForm } from './GenericForm'
import { Button } from '../buttons'
import { DynamicFieldDefinition } from './fields'
import { Fragment } from 'react/jsx-runtime'
import { Table } from '../table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormDataType, GenericFormParams, GenericFormProps } from './types'

export type SubformFieldProps = {
  field: DynamicFieldDefinition
  formData: FormDataType
  rootFormData?: FormDataType
  onChangeFormData: GenericFormProps['onChangeFormData']
  showError: boolean
  subforms?: Record<string, GenericFormParams>
  settings: GenericFormProps['settings']
  useAlwaysArraysInFormData: boolean
  _path?: (string | number)[]
  fIdx: number
  slotProps: GenericFormProps['slotProps']
  disableUseFormElement?: boolean
  injections?: GenericFormProps['injections']
  disableInitialDivider?: boolean
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
    disableUseFormElement,
    injections,
    disableInitialDivider,
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
    () =>
      // TODO - add support for fn() fields getter
      (sub?.fields as DynamicFieldDefinition<'array'>[])
        ?.filter((f) => f?.form?.showInArrayList)
        ?.map((f) => ({
          header: f.label,
          renderCell: f.name,
        })) || [],
    [sub?.fields]
  )

  // const makeOnChangeArraySub = useCallback(
  //   (arrayIndex: number) => {
  //     return (
  //       newFormData: any,
  //       changedPropertyName: any,
  //       changedPropertyValue: any,
  //       prevFormData: any
  //     ) => {
  //       if (!fieldName) return
  //       const transformedNewFormData = {
  //         ...formData,
  //         [fieldName]: formData?.[fieldName]?.length
  //           ? formData?.[fieldName]?.map((f: any, fIdx: number) =>
  //               fIdx === arrayIndex ? newFormData?.[fieldName]?.[arrayIndex] : f
  //             )
  //           : [newFormData],
  //       }
  //       const transformedAdjNewFormData = injections?.onBeforeChange?.(
  //         transformedNewFormData,
  //         formData,
  //         changedPropertyName,
  //         changedPropertyValue
  //       )

  //       onChangeFormData?.(
  //         transformedAdjNewFormData ?? transformedNewFormData,
  //         changedPropertyName,
  //         changedPropertyValue,
  //         formData,
  //         fieldName
  //       )
  //     }
  //   },
  //   [fieldName, formData, onChangeFormData, injections]
  // )

  const handleRemoveArrayItem = useCallback(
    (removeIdx: number) => {
      if (!fieldName) return
      const newFormData = {
        ...formData,
        [fieldName]: (
          (Array.isArray(formData?.[fieldName])
            ? formData[fieldName]
            : []) as unknown[]
        )?.filter((f: unknown, fIdx2: number) => fIdx2 !== removeIdx),
      }

      const AdjNewFormData = injections?.onBeforeChange?.(
        newFormData,
        formData,
        fieldName,
        formData?.[fieldName]
      )
      onChangeFormData?.(
        AdjNewFormData ?? newFormData,
        fieldName,
        (AdjNewFormData ?? newFormData ?? formData)?.[fieldName],
        formData
      )
    },
    [formData, fieldName, onChangeFormData, injections]
  )

  const arrayTableProps = useMemo(
    () => ({
      getTrProps: (item: unknown, rIdx: number) =>
        rIdx === ui.open
          ? {
              sx: { bgcolor: theme.palette.action.selected + ' !important' },
            }
          : {},
      data: (formData?.[fieldName ?? ''] as Record<string, unknown>[]) || [],
      columns: [
        ...subFieldsForList,
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
          renderCell: (item: unknown, cIdx: number, rIdx: number) => (
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
            // width: '64px',
            display: 'flex',
            justifyContent: 'flex-end',
            pr: 0,
          },
        },
      ],
    }),
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

  const [tempFormData, setTempFormData] = useState<FormDataType>({})

  useEffect(() => {
    if (ui?.open === 'new') {
      const initialFormDataRaw = sub?.injections?.initialFormData
      const initialFormData =
        typeof initialFormDataRaw === 'function'
          ? initialFormDataRaw(
              formData,
              rootFormData as FormDataType,
              ArrayIdx as number
            )
          : initialFormDataRaw
      setTempFormData(initialFormData || {})
    } else if (typeof ui?.open === 'number') {
      const fieldData = formData?.[fieldName ?? '']
      const newTempFormData =
        Array.isArray(fieldData) && typeof ui?.open === 'number'
          ? fieldData[ui?.open]
          : {}
      setTempFormData(newTempFormData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui?.open])

  if (!fieldName || !subform) return null
  const onChangeObjectSub = (
    newFormData: FormDataType,
    changedPropertyName: string,
    changedPropertyValue: unknown
    // prevFormData: any
  ) => {
    const transformedNewFormData = {
      ...formData,
      [fieldName]: useAlwaysArraysInFormData ? [newFormData] : newFormData,
    }
    const AdjNewFormData = injections?.onBeforeChange?.(
      transformedNewFormData,
      formData,
      changedPropertyName,
      changedPropertyValue
    )
    onChangeFormData?.(
      AdjNewFormData ?? transformedNewFormData,
      changedPropertyName,
      changedPropertyValue,
      formData,
      fieldName
    )
  }

  const addnewItemArraySub = (
    changedPropertyName: string,
    prevFormData: FormDataType
  ) => {
    if (!fieldName) return
    const prevArrayFormData = Array.isArray(prevFormData?.[fieldName])
      ? prevFormData?.[fieldName]
      : []
    const injectedFormDataRaw =
      subforms?.[fieldName]?.injections?.initialFormData
    // const injectedRawFormData =
    //   (typeof injectedFormDataRaw === 'function'
    //     ? injectedFormDataRaw(formData, rootFormData, (ArrayIdx ?? -1) + 1)
    //     : injectedFormDataRaw) ?? {}
    const newItem = {
      ...injectedFormDataRaw,
      ...tempFormData,
    }

    const newValue = [...((prevArrayFormData as unknown[]) ?? []), newItem]
    const transformedNewFormData = {
      ...formData,
      [fieldName]: newValue,
    }

    const AdjNewFormData = injections?.onBeforeChange?.(
      transformedNewFormData,
      formData,
      changedPropertyName,
      newValue
    )
    onChangeFormData?.(
      AdjNewFormData ?? transformedNewFormData,
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
          disableUseFormElement={disableUseFormElement}
          useAlwaysArraysInFormData={useAlwaysArraysInFormData}
          key={fIdx}
          fields={subform?.fields}
          injections={subform?.injections}
          settings={settings}
          formData={
            useAlwaysArraysInFormData
              ? (formData?.[fieldName] as FormDataType[])?.[0]
              : (formData?.[fieldName] as FormDataType)
          } //?? subforms?.[fieldName]?.injections?.initialFormData ?? {}}
          onChangeFormData={onChangeObjectSub}
          rootFormData={formData}
          onChangeFormDataRoot={onChangeFormData as any}
          _path={[...(_path ?? []), field.name]}
          showError={showError}
          subforms={subform?.subforms}
          slotProps={slotProps}
        />
      </Box>
    </Fragment>
  ) : field.type === 'array' ? (
    <Fragment key={fIdx}>
      {!disableInitialDivider && (
        <Box py={2}>
          <Divider />
        </Box>
      )}
      <Typography fontWeight="bold">{fieldName}</Typography>
      <Box>
        <Box>
          <Table {...arrayTableProps} />
        </Box>
        {ui?.open !== null && (
          <Box mt={2}>
            <Typography>
              {ui?.open === 'new'
                ? `Add ${field.name} item`
                : `Edit ${field.name} item`}
            </Typography>
            <GenericForm
              disableUseFormElement={disableUseFormElement}
              useAlwaysArraysInFormData={useAlwaysArraysInFormData}
              fields={sub?.fields ?? []}
              injections={sub?.injections}
              settings={settings}
              onChangeFormData={setTempFormData}
              showError={showError}
              disableTopSpacing={true}
              slotProps={slotProps}
              formData={tempFormData}
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
                        if (
                          (!ui?.open && typeof ui?.open !== 'number') ||
                          ui?.open === 'new'
                        )
                          return
                        const newFormData = {
                          ...formData,
                          [fieldName]: (
                            (Array.isArray(formData?.[fieldName])
                              ? formData[fieldName]
                              : []) as FormDataType[]
                          )?.map((f: FormDataType, fIdx2: number) =>
                            fIdx2 === ui?.open ? tempFormData : f
                          ),
                        }
                        const AdjNewFormData = injections?.onBeforeChange?.(
                          newFormData,
                          formData,
                          fieldName,
                          formData?.[fieldName]
                        )
                        console.debug(
                          'SubFormField.tsx',
                          newFormData,
                          fieldName,
                          formData?.[fieldName],
                          formData,
                          injections,
                          AdjNewFormData
                        )
                        onChangeFormData?.(
                          AdjNewFormData ?? newFormData,
                          fieldName,
                          newFormData?.[fieldName],
                          formData,
                          fieldName
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
