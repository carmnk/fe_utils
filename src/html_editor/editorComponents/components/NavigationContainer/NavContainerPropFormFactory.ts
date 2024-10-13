import { EditorRendererControllerType } from '../../../editorRendererController/types/editorRendererController'
import { EditorStateType } from '../../../editorRendererController/types'
import type { GenericFormProps } from '../../../../components/forms/GenericForm'

const optionsDict = {
  // disabled: booleanOptions,
}

type GenerateFieldProps = {
  type: string
  name: string
}
type GenerateOptionsDictType = {
  [key: string]: { value: any; label: string }[]
}

type GenerateFormPropsType = {
  optionsDict: GenerateOptionsDictType
  initialFormData: { [key: string]: any }
  fields: GenerateFieldProps[]
  subforms?: { [key: string]: GenericFormProps }
}
const generateFormProps = (params: GenerateFormPropsType): GenericFormProps => {
  const {
    optionsDict,
    initialFormData,
    fields: fieldsIn,
    subforms,
    injections: injectionsIn,
  } = params as any
  const fields = fieldsIn.map((field: any) => {
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
  return formProps as any
}

export const NavContainerComponentPropsFormFactory = (prarams: {
  editorState: EditorStateType
  selectedPageElements: EditorRendererControllerType<any>['selectedPageElements']
  currentViewportElements: EditorRendererControllerType<any>['currentViewportElements']
}) => {
  const { editorState, selectedPageElements, currentViewportElements } = prarams
  const pageElements = selectedPageElements
  const navElements = pageElements.filter(
    (el: any) =>
      el._type.slice(0, 1).toUpperCase() === el._type.slice(0, 1) &&
      'state' in el
  )
  // const elementAttributes = editorState.attributes.filter(
  //   (attr) => attr.element_id === selectedComponent._id
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
    value: el._id,
    label:
      el._type +
      (editorState.properties.find(
        (prop) => prop.element_id === el._id && prop.prop_name === 'id'
      )?.prop_value ?? ''),
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
  } as any)
}

export const ItemPropsFormFactory = (
  editorState: EditorStateType,
  currentViewportElements: EditorRendererControllerType<any>['currentViewportElements']
) => {
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
        value: (formData: any, rootFormData: any) => {
          const selectedElementId = editorState?.ui?.selected?.element
          const selectedElement = currentViewportElements?.find(
            (el) => el._id === selectedElementId
          )
          const isSelectedElementNavContainer =
            selectedElement?._type === 'NavContainer'
          if (!isSelectedElementNavContainer) return []

          const navContainerProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === selectedElementId ||
              prop.template_id === selectedElement.template_id
          )
          const navContainerPropsObject = navContainerProps.reduce<
            Record<string, any>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})

          const navigationElementId =
            navContainerPropsObject?.navigationElementId

          const controlElement = currentViewportElements?.find(
            (el) => el._id === navigationElementId
          )
          const controlElementProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === controlElement?._id ||
              prop.template_id === controlElement?.template_id
          )
          const controlElementPropsObject = controlElementProps.reduce<
            Record<string, any>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})
          const navItemOptions =
            controlElement?._type === 'Button'
              ? [
                  { value: true, label: 'true' },
                  { value: false, label: 'false' },
                ]
              : controlElementPropsObject?.items
          return navItemOptions ?? []
        },
        childId: (formData: any, rootFormData: any) => {
          const selectedNavContainerId = editorState?.ui?.selected?.element
          const navigationContainer = currentViewportElements?.find(
            (el) => el._id === selectedNavContainerId
          )
          const navContainerProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === selectedNavContainerId ||
              prop.template_id === navigationContainer?.template_id
          )
          const navContainerPropsObject = navContainerProps.reduce<
            Record<string, any>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})
          const navigationElementId =
            navContainerPropsObject?.navigationElementId

          const controlElement = currentViewportElements?.find(
            (el) => el._id === navigationElementId
          )
          const controlElementProps = editorState.properties.filter(
            (prop) =>
              prop.element_id === controlElement?._id ||
              prop.template_id === controlElement?.template_id
          )
          const controlElementPropsObject = controlElementProps.reduce<
            Record<string, any>
          >((acc, prop) => {
            return {
              ...acc,
              [prop.prop_name]: prop.prop_value,
            }
          }, {})

          const navTabs = controlElementPropsObject?.items?.map?.(
            (tab: any) => ({
              value: tab.value,
              label: tab.label,
            })
          )
          const children =
            currentViewportElements
              ?.filter((el) => el._parentId === selectedNavContainerId)
              ?.map((child) => ({
                value: child?._id,
                label: child?._type,
                stateValue: navTabs?.find(
                  (tab: any) =>
                    tab.value ===
                    navContainerPropsObject?.items?.find(
                      (item: any) => item.childId === child?._id
                    )?.value
                )?.value,
              })) ?? []
          return children ?? []
        },
      },
    },
  }
}
