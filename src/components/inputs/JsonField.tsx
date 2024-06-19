import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { Box, Typography } from '@mui/material'
import { Flex } from '../_wrapper'
import { Button } from '../buttons'
import { JsonObjectField, JsonObjectFieldProps } from './JsonObjectField'
import { Fragment, useCallback, useState } from 'react'
import { Modal } from '../surfaces'
import Icon from '@mdi/react'

export type JsonFieldProps = JsonObjectFieldProps & {
  label?: string
  value: Record<string, any> | Record<string, any>[]
  useModal?: boolean
  disableLabel?: boolean

  // _path?: (string | number)[]
  // editing: EditPropertyType | null
  // setEditing: (prev: EditPropertyType) => EditPropertyType
  // onChange: (
  //   value: Record<string, any>,
  //   e: {
  //     target: { name: string }
  //   }
  // ) => void
  // keysDict?: any
  // name?: string
  // disabled?: boolean
}

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
  } = props
  return (
    <Box>
      {!_path?.length && !disableLabel && (
        <Typography variant="caption">{label}</Typography>
      )}
      {Array.isArray(value) ? (
        value.length ? (
          <Box>
            <Typography color="gold">{`[`}</Typography>
            {value.map((item, index) => (
              <Box key={index} ml={2} position="relative">
                <JsonField
                  useModal={useModal}
                  disabled={disabled}
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
                {!useModal && (
                  <Button
                    icon={mdiDelete}
                    variant="text"
                    slotProps={{
                      typography: { variant: 'caption' },
                    }}
                    sx={{ position: 'absolute', bottom: 0, left: '16px' }}
                    label="Delete Item"
                    onClick={() => {
                      onChange(
                        value?.filter((v, vIdx) => vIdx !== index) || [],
                        {
                          target: { name: name ?? '' },
                        }
                      )
                    }}
                  />
                )}
              </Box>
            ))}
            {!useModal && (
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
            )}
            <Typography color="gold">{`]`}</Typography>
          </Box>
        ) : (
          <Flex>
            <Typography>{`[`}</Typography>
            {!useModal && (
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
            )}
            <Typography>{`]`}</Typography>
          </Flex>
        )
      ) : (
        <JsonObjectField
          disabled={useModal || disabled}
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

export const JsonField = (props: JsonFieldProps) => {
  const { useModal, ...rest } = props
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => setOpen(false), [])
  const handleOpen = useCallback(() => setOpen(true), [])

  return useModal ? (
    <Fragment>
      <RawJsonField {...props} />
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
        <RawJsonField {...props} useModal={false} disableLabel />
      </Modal>
    </Fragment>
  ) : (
    <RawJsonField {...rest} useModal={false} />
  )
}
