import { render, fireEvent, act } from '@testing-library/react'
import { GenericForm } from './GenericForm'
import { StaticFieldDefinition } from './fields/Field'
import { mdiDelete, mdiDeleteOutline, mdiPencil, mdiPlus } from '@mdi/js'

const injectedText = 'INJECTED_TEXT'
const testFields: StaticFieldDefinition[] = [
  { label: 'field1', type: 'text', name: 'field_1' },
  { label: 'field2', type: 'text', name: 'field_2' },
  {
    type: 'inject',
    name: 'inject_field',
    component: () => <div>{injectedText}</div>,
  },
  {
    type: 'string-array',
    name: 'string_array_field',
    label: 'string_array_label',
    // options: ['option1', 'option2'],
  },
]

describe('GenericForm', () => {
  it('renders fields with correct initial values', () => {
    const { getByLabelText, getByText, getByDisplayValue } = render(
      <GenericForm
        fields={testFields}
        formData={{ string_array_field: ['option1', 'option2'] }}
        onChangeFormData={() => {}}
      />
    )
    expect(getByText('field1')).toBeInTheDocument()
    expect(getByText('field2')).toBeInTheDocument()
    expect(getByText(injectedText)).toBeInTheDocument()
  })
  it('renders custom fields correctly', () => {
    const { getByLabelText, getByText, getByDisplayValue } = render(
      <GenericForm
        fields={testFields}
        formData={{}}
        onChangeFormData={() => {}}
      />
    )
    expect(getByText(injectedText)).toBeInTheDocument()
  })
  it.skip('renders string-array fields correctly', () => {
    const { getAllByText, getByText, getByDisplayValue } = render(
      <GenericForm
        fields={testFields}
        formData={{ string_array_field: ['option1', 'option2'] }}
        onChangeFormData={() => {}}
      />
    )

    expect(getAllByText('string_array_label').length).toBe(2)
    expect(getByDisplayValue('option1')).toBeInTheDocument()
    expect(getByDisplayValue('option2')).toBeInTheDocument()
  })

  it('renders object-subforms  correctly', () => {
    const { getAllByText, getByText, getByDisplayValue } = render(
      <GenericForm
        fields={[...testFields, { type: 'object', name: 'sub' }]}
        formData={{
          string_array_field: ['option1', 'option2'],
          sub: { sub_name: 'Sub_1', sub_text: 'Sub_text_1' },
        }}
        onChangeFormData={() => {}}
        subforms={{
          sub: {
            fields: [
              {
                type: 'text',
                name: 'sub_name',
                label: 'sub_name_label',
                form: {
                  showInArrayList: true,
                },
              },
              {
                type: 'text',
                name: 'sub_text',
                label: 'sub_text_label',
                form: {
                  showInArrayList: true,
                },
              },
            ],
            injections: {},
          },
        }}
      />
    )
    expect(getByText('sub_name_label')).toBeInTheDocument()
    expect(getByText('sub_text_label')).toBeInTheDocument()
    expect(getByDisplayValue('Sub_1')).toBeInTheDocument()
    expect(getByDisplayValue('Sub_text_1')).toBeInTheDocument()
  })
  it('renders array-subforms  correctly', () => {
    const { getAllByText, getByText, getByDisplayValue } = render(
      <GenericForm
        fields={[
          ...testFields,
          {
            type: 'array',
            name: 'sub',
            label: 'SubformDEBUG_PRINT_LIMIT=100000',
          },
        ]}
        formData={{
          string_array_field: ['option1', 'option2'],
          sub: [{ sub_name: 'Sub_1', sub_text: 'Sub_text_1' }],
        }}
        onChangeFormData={() => {}}
        subforms={{
          sub: {
            fields: [
              {
                type: 'text',
                name: 'sub_name',
                label: 'sub_name_label',
                form: {
                  showInArrayList: true,
                },
              },
              {
                type: 'text',
                name: 'sub_text',
                label: 'sub_text_label',
                form: {
                  showInArrayList: true,
                },
              },
            ],
            injections: {},
          },
        }}
      />
    )
    expect(getByText('sub_name_label')).toBeInTheDocument()
    expect(getByText('sub_text_label')).toBeInTheDocument()
    expect(getByText('Sub_1')).toBeInTheDocument()
    expect(getByText('Sub_text_1')).toBeInTheDocument()
  })
  it('renders a delete button for subforms if index > 0 (not first element of subforms)', async () => {
    const handleRemoveArrayElement = jest.fn()
    const { getAllByText, getByText, getByDisplayValue } = render(
      <GenericForm
        // _removeFormFromArray={handleRemoveArrayElement}
        fields={[...testFields, { type: 'array', name: 'sub' }]}
        formData={{
          string_array_field: ['option1', 'option2'],
          sub: [
            { sub_name: 'Sub_1', sub_text: 'Sub_text_1' },
            { sub_name: 'Sub_2', sub_text: 'Sub_text_2' },
            { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
          ],
        }}
        onChangeFormData={handleRemoveArrayElement}
        subforms={{
          sub: {
            fields: [
              {
                type: 'text',
                name: 'sub_name',
                label: 'sub_name_label',
              },
              {
                type: 'text',
                name: 'sub_text',
                label: 'sub_text_label',
              },
            ],
            injections: {},
          },
        }}
      />
    )

    const allPathElements = document?.querySelectorAll?.('path')
    const firstPathElement = allPathElements?.[0]
    expect(firstPathElement).toHaveAttribute('d', mdiPlus)

    const tbody = document.querySelector('tbody')
    const pathElements = tbody?.querySelectorAll?.('path')

    // string array
    expect(pathElements?.[0]).toHaveAttribute('d', mdiPencil)
    expect(pathElements?.[1]).toHaveAttribute('d', mdiDelete)
    // expect(pathElements?.[1]).toHaveAttribute('d', mdiDeleteOutline)

    // subfor

    expect(pathElements?.[2]).toHaveAttribute('d', mdiPencil)
    expect(pathElements?.[3]).toHaveAttribute('d', mdiDelete)

    expect(pathElements?.[4]).toHaveAttribute('d', mdiPencil)
    expect(pathElements?.[5]).toHaveAttribute('d', mdiDelete)

    const deleteSvgElement1 = pathElements?.[1].parentElement
    const deleteButtonElement1 = deleteSvgElement1?.parentElement?.parentElement

    const deleteSvgElement2 = pathElements?.[3].parentElement
    const deleteButtonElement2 = deleteSvgElement2?.parentElement?.parentElement

    expect(deleteButtonElement1?.tagName).toBe('BUTTON')
    await act(async () => {
      await fireEvent.click(deleteButtonElement1 as any, {
        target: { value: 'New Value' },
      })
      await fireEvent.click(deleteButtonElement2 as any, {
        target: { value: 'New Value' },
      })
    })
    expect(handleRemoveArrayElement).toHaveBeenNthCalledWith(
      1,
      {
        string_array_field: ['option1', 'option2'],
        sub: [
          { sub_name: 'Sub_2', sub_text: 'Sub_text_2' },
          { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
        ],
      }, // newFormData ...
      'sub',
      [
        { sub_name: 'Sub_2', sub_text: 'Sub_text_2' },
        { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
      ],
      {
        string_array_field: ['option1', 'option2'],
        sub: [
          { sub_name: 'Sub_1', sub_text: 'Sub_text_1' },
          { sub_name: 'Sub_2', sub_text: 'Sub_text_2' },
          { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
        ],
      }
    )
    expect(handleRemoveArrayElement).toHaveBeenNthCalledWith(
      2,
      {
        string_array_field: ['option1', 'option2'],
        sub: [
          { sub_name: 'Sub_1', sub_text: 'Sub_text_1' },
          { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
        ],
      }, // newFormData ...
      'sub',
      [
        { sub_name: 'Sub_1', sub_text: 'Sub_text_1' },
        { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
      ],
      {
        string_array_field: ['option1', 'option2'],
        sub: [
          { sub_name: 'Sub_1', sub_text: 'Sub_text_1' },
          { sub_name: 'Sub_2', sub_text: 'Sub_text_2' },
          { sub_name: 'Sub_3', sub_text: 'Sub_text_3' },
        ],
      }
    )
  })

  // Continue with tests for other properties...
})
