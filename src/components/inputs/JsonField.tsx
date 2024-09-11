import { mdiDelete, mdiMinus, mdiPencil, mdiPlus } from '@mdi/js'
import { Box, Typography } from '@mui/material'
import { Flex } from '../_wrapper'
import { Button } from '../buttons'
import { JsonObjectField, JsonObjectFieldProps } from './JsonObjectField'
import { useCallback, useMemo, useState } from 'react'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { Modal } from '../surfaces'
import Icon from '@mdi/react'

export type JsonFieldProps = JsonObjectFieldProps & {
  label?: string
  value: Record<string, any> | Record<string, any>[]
  useModal?: boolean
  disableLabel?: boolean
  _collapsedPaths?: string[]
  _setCollapsedPaths?: Dispatch<SetStateAction<string[]>>
  startCollapsed?: boolean
}

const buttonSlotProps = {
  typography: { variant: 'caption' as const },
}
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
      onChange([...((value as any) || []), newItem], {
        target: { name: name ?? '' },
      })
    }
    // console.debug(
    //   'VALUE: ',
    //   value,
    //   'Path: ',
    //   _path,
    //   'Editing',
    //   editing,
    //   keysDict
    // )
  }, [value, keysDict, onChange, name])

  const newPath = useMemo(() => [..._path], [_path])

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
                slotProps={buttonSlotProps}
                label={isCurrentFieldExpanded ? 'Collapse' : 'Expand'}
                onClick={() => {
                  console.log(
                    'Collapsed Paths: ',
                    _collapsedPaths,
                    value,
                    _path
                  )
                  _setCollapsedPaths?.((current) =>
                    current.includes(_path.join('.'))
                      ? current.filter((path) => path !== _path.join('.'))
                      : [...current, _path.join('.')]
                  )
                }}
              />
            </Flex>
            {isCurrentFieldExpanded &&
              value.map((item, index) => {
                const handleDeleteItem = () => {
                  onChange(value?.filter((v, vIdx) => vIdx !== index) || [], {
                    target: { name: name ?? '' },
                  })
                }
                const handleChangeJsonField = (newValuePerItem: any) =>
                  onChange(
                    value?.map((v, vIdx) =>
                      vIdx === index ? newValuePerItem : v
                    ) || [],
                    { target: { name: name ?? '' } }
                  )

                const newPath = [..._path, index]
                return (
                  <Box key={index} ml={2} position="relative">
                    <JsonField
                      _collapsedPaths={_collapsedPaths}
                      _setCollapsedPaths={_setCollapsedPaths}
                      useModal={useModal}
                      disabled={disabled}
                      name={name}
                      keysDict={keysDict?.[0]}
                      value={item}
                      _path={newPath}
                      editing={editing}
                      setEditing={setEditing}
                      onChange={handleChangeJsonField}
                    />
                    {!useModal && !disabled && (
                      <Button
                        icon={mdiDelete}
                        variant="text"
                        slotProps={buttonSlotProps}
                        sx={{ position: 'absolute', bottom: 0, left: '16px' }}
                        label="Delete Item"
                        onClick={handleDeleteItem}
                      />
                    )}
                  </Box>
                )
              })}
            {!useModal && !disabled && (
              <Button
                icon={mdiPlus}
                variant="text"
                slotProps={buttonSlotProps}
                sx={miniButtonStyles}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            )}
            <Typography color="gold">{`]`}</Typography>
          </Box>
        ) : (
          <Flex>
            <Typography>{`[`}</Typography>
            {!useModal && !disabled && (
              <Button
                icon={mdiPlus}
                variant="text"
                slotProps={buttonSlotProps}
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
          disabled={useModal || disabled}
          name={name}
          value={value}
          _path={newPath}
          editing={editing}
          setEditing={setEditing as any}
          onChange={onChange}
          keysDict={keysDict}
          _collapsedPaths={_collapsedPaths}
          _setCollapsedPaths={_setCollapsedPaths}
          startCollapsed={startCollapsed}
        />
      )}
    </Box>
  )
}

export const JsonField = (props: JsonFieldProps) => {
  const { useModal, _collapsedPaths, _setCollapsedPaths, ...rest } = props
  const [open, setOpen] = useState(false)

  const isChildComponent = !!_collapsedPaths // shall not be used by the dev user
  const [collapsedPaths, setCollapsedPaths] = useState<string[]>([])

  const handleClose = useCallback(() => setOpen(false), [])
  const handleOpen = useCallback(() => setOpen(true), [])

  return useModal ? (
    <Fragment>
      <RawJsonField
        {...props}
        _collapsedPaths={collapsedPaths}
        _setCollapsedPaths={setCollapsedPaths}
      />
      <Button label={'Edit'} onClick={handleOpen} variant="outlined" />
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
          _collapsedPaths={collapsedPaths}
          _setCollapsedPaths={setCollapsedPaths}
        />
      </Modal>
    </Fragment>
  ) : (
    <RawJsonField
      {...rest}
      useModal={false}
      _collapsedPaths={collapsedPaths}
      _setCollapsedPaths={setCollapsedPaths}
    />
  )
}
