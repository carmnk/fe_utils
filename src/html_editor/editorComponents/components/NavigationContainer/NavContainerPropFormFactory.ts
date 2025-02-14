import { EditorRendererControllerType } from '../../../types/editorRendererController'
import { EditorStateType } from '../../../types'
import type { GenericFormProps } from '../../../../components/forms/types'

const optionsDict = {
  // disabled: booleanOptions,
}

type GenerateFieldProps = {
  type: string
  name: string
}
type GenerateOptionsDictType = {
  [key: string]: { value: string; label: string }[]
}

type GenerateFormPropsType = {
  optionsDict: GenerateOptionsDictType
  initialFormData: { [key: string]: unknown }
  fields: GenerateFieldProps[]
  subforms?: {
    [key: string]: Omit<GenericFormProps, 'formData' | 'onChangeFormData'>
  }
  injections?: {
    options?: Record<string, { label: string; value: unknown }[]>
    disabled?: Record<string, boolean>
  }
}
const generateFormProps = (
  params: GenerateFormPropsType
): Omit<GenericFormProps, 'formData' | 'onChangeFormData'> => {
  const {
    optionsDict,
    initialFormData,
    fields: fieldsIn,
    subforms,
    injections: injectionsIn,
  } = params
  const fields = fieldsIn.map((field) => {
    // const isOption = field?.name in options;
    const fieldProps = {
      ...field,
      label: field?.name,
    }
    return fieldProps
  })
  const injections = {
    ...(injectionsIn ?? {}),
    options: { ...(optionsDict ?? {}), ...(injectionsIn?.options ?? {}) },
    initialFormData: initialFormData,
  }
  const formProps = {
    injections,
    fields,
    subforms,
  }
  return formProps as GenericFormProps
}

export const NavContainerComponentPropsFormFactory = (prarams: {
  editorState: EditorStateType
  selectedPageElements: EditorRendererControllerType['selectedPageElements']
  currentViewportElements: EditorRendererControllerType['currentViewportElements']
}) => {
  const { editorState, selectedPageElements, currentViewportElements } = prarams
  const pageElements = selectedPageElements
  const navElements = pageElements.filter(
    (el) =>
      el.element_type.slice(0, 1).toUpperCase() ===
        el.element_type.slice(0, 1) && 'state' in el
  )
  // const elementAttributes = editorState.attributes.filter(
  //   (attr) => attr.element_id === selectedComponent.element_id
  // )
  // const elementAttributesDict = elementAttributes.reduce<Record<string, any>>(
  //   (acc, attr) => {
  //     return {
  //       ...acc,
  //       [attr.attr_name]: attr.attr_value,
  //     }
  //   },
  //   {}
  // )
  const navigationElementIdOptions = navElements.map((el) => ({
    value: el.element_id,
    label:
      el.element_type +
      ' - ' +
      (editorState.properties.find(
        (prop) => prop.element_id === el.element_id && prop.prop_name === 'id'
      )?.prop_value ??
        el?.element_html_id ??
        ''),
  }))

  return generateFormProps({
    optionsDict,
    initialFormData: {
      // children: "test",
    },
    fields: [
      {
        type: 'select',
        name: 'navigationElementId',
      },
      {
        type: 'array',
        name: 'items',
      },
    ],
    injections: {
      options: {
        navigationElementId: navigationElementIdOptions,
      },
      //   disabled: {
      //     defaultValue: true,
      //   },
    },
    subforms: {
      items: ItemPropsFormFactory(editorState, currentViewportElements),
    },
  })
}

export const ItemPropsFormFactory = (
  editorState: EditorStateType,
  currentViewportElements: EditorRendererControllerType['currentViewportElements']
): Omit<GenericFormProps, 'formData' | 'onChangeFormData'> => {
  // const tabsValues =
  return {
    fields: [
      {
        type: 'select',
        name: 'value',
        label: 'value',
        form: {
          showInArrayList: true,
        },
      },
      {
        type: 'select',
        name: 'childId',
        label: 'childId',
        form: {
          showInArrayList: true,
        },
      },
    ],
    injections: {
      options: {
        value: () => {
          // TODO: Why is here the selected Element ?
          const selectedElementId = editorState?.ui?.selected?.element
          const selectedElement = currentViewportElements?.find(
            (el) => el.element_id === selectedElementId
          )
          const isSelectedElementNavContainer =
            selectedElement?.element_type === 'NavContainer'
          if (!isSelectedElementNavContainer) return []

          const navContainerProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === selectedElementId ||
              prop.template_id === selectedElement.template_id
          )
          const navContainerPropsObject = navContainerProps.reduce<
            Record<string, unknown>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})

          const navigationElementId =
            navContainerPropsObject?.navigationElementId

          const controlElement = currentViewportElements?.find(
            (el) => el.element_id === navigationElementId
          )
          const controlElementProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === controlElement?.element_id ||
              (prop.template_id === controlElement?.template_id &&
                prop.prop_name !== 'items')
          )
          const controlElementPropsObject = controlElementProps.reduce<
            Record<string, unknown>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})
          const navItemOptions =
            controlElement?.element_type === 'Button'
              ? [
                  { value: true, label: 'true' },
                  { value: false, label: 'false' },
                ]
              : (controlElementPropsObject?.items as {
                  value: boolean
                  label: string
                }[])

          return navItemOptions ?? []
        },
        childId: () => {
          const selectedNavContainerId = editorState?.ui?.selected?.element
          const navigationContainer = currentViewportElements?.find(
            (el) => el.element_id === selectedNavContainerId
          )
          const navContainerProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === selectedNavContainerId ||
              prop.template_id === navigationContainer?.template_id
          )
          const navContainerPropsObject = navContainerProps.reduce<
            Record<string, unknown>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})
          const navigationElementId =
            navContainerPropsObject?.navigationElementId

          const controlElement = currentViewportElements?.find(
            (el) => el.element_id === navigationElementId
          )
          const controlElementProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === controlElement?.element_id ||
              prop.template_id === controlElement?.template_id
          )
          const controlElementPropsObject = controlElementProps.reduce<
            Record<string, unknown>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})

          const navTabs = (
            Array.isArray(controlElementPropsObject?.items)
              ? controlElementPropsObject?.items
              : []
          )?.map?.((tab) => ({
            value: tab.value,
            label: tab.label,
          }))
          const children =
            currentViewportElements
              ?.filter((el) => el.parent_id === selectedNavContainerId)
              ?.map((child) => ({
                value: child?.element_id,
                label: child?.element_type,
                stateValue: navTabs?.find(
                  (tab) =>
                    tab.value ===
                    (Array.isArray(navContainerPropsObject?.items)
                      ? navContainerPropsObject?.items
                      : []
                    )?.find((item) => item.childId === child?.element_id)?.value
                )?.value,
              })) ?? []
          return children ?? []
        },
      },
    },
  }
}
