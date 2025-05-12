import { ElementModel } from '../../editorComponents'
import {
  AppController,
  EditorStateType,
  Element,
  Property,
  Template,
} from '../../editorRendererController'
import { replacePlaceholdersInString } from '../placeholder/replacePlaceholder'

export type ResolveElementPropsParams = {
  element: Element
  rootCompositeElementId?: string
  editorState: EditorStateType
  appController: AppController
  icons?: { [key: string]: string }
  elementProps: Property[]
}

// export const resolveElementProps = (params: ResolveElementPropsParams) => {
//   const {
//     element,
//     rootCompositeElementId,
//     editorState,
//     appController,
//     icons,
//     elementProps,
//   } = params

//   const getPropByName = (key: string) =>
//     elementProps?.find((prop) => prop.prop_name === key)?.prop_value

//   const elementPropsDict = elementProps.reduce<Record<string, unknown>>(
//     (acc, cur) => {
//       const key = cur.prop_name
//       const keyValue = getPropByName(key) as string
//       const matches = keyValue?.match?.(
//         /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g
//       )
//       const keyValueAdj = matches
//         ? replacePlaceholdersInString(
//             keyValue as string,
//             appController.state,
//             editorState.composite_component_props,
//             editorState.properties,
//             element,
//             rootCompositeElementId,
//             undefined,
//             icons
//           )
//         : keyValue

//       const isFormularInput = keyValue !== keyValueAdj
//       const transformerStr = editorState.transformers.find(
//         (tr) =>
//           tr.prop_id === cur.prop_id && tr.element_id === element.element_id
//       )?.transformer_string
//       const transformerFn =
//         isFormularInput && transformerStr
//           ? replacePlaceholdersInString(
//               transformerStr,
//               appController.state,
//               editorState.composite_component_props,
//               editorState.properties,
//               element,
//               rootCompositeElementId,
//               true,
//               icons,
//               true
//             )
//           : null

//       // if (
//       //   transformerFn &&
//       //   element?.element_type?.toLowerCase().includes('treeview')
//       // ) {
//       //   console.log('transformerFn', transformerFn, transformerStr, icons)
//       // }
//       const keyValueAdj2 =
//         typeof transformerFn === 'function' && Array.isArray(keyValueAdj)
//           ? transformerFn?.(keyValueAdj)
//           : keyValueAdj
//       return {
//         ...acc,
//         [key]: keyValueAdj2,
//       }
//     },
//     {}
//   )
//   return elementPropsDict
// }

export const getElementPropsRawDict = (params: {
  element: Element | Template | ElementModel | null
  editorState: EditorStateType
  viewport?: EditorStateType['ui']['selected']['viewport']
}) => {
  const { element, editorState, viewport } = params
  const { properties } = editorState
  const elementOwnProps =
    element && !('element_id' in element)
      ? []
      : properties?.filter(
          (prop) =>
            prop.element_id === element?.element_id &&
            (((!viewport || viewport === 'xs') &&
              (!prop.viewport || prop.viewport === 'xs')) ||
              (viewport && prop.viewport === viewport))
        )
  const templateProps = properties?.filter(
    (prop) =>
      element &&
      'template_id' in element &&
      prop.template_id === element.template_id &&
      !elementOwnProps.find((elprop) => elprop.prop_name === prop.prop_name)
  )
  const defaultTemplateProps =
    element && 'props' in element && !('element_id' in element)
      ? Object.keys(element?.props ?? {})?.reduce?.(
          (acc, key) => [
            ...acc,
            {
              prop_id: null as unknown as string,
              project_id: editorState.project.project_id,
              prop_name: key,
              prop_value: element?.props?.[key],
              component_id: null,
              template_id: editorState.ui.selected.template,
              element_id: null,
            } as Property,
          ],
          [] as Property[]
        )
      : []

  const allElementProps = [
    ...(elementOwnProps ?? []),
    ...(templateProps ?? []),
    ...(defaultTemplateProps ?? []),
  ]

  const getPropertyValueByPropName = (propName: string) => {
    const valueRaw = allElementProps?.find(
      (prop) => prop.prop_name === propName
    )?.prop_value
    const value =
      valueRaw === 'null'
        ? null
        : valueRaw === 'true'
          ? true
          : valueRaw === 'false'
            ? false
            : valueRaw
    return value
  }

  const elementPropsDict = allElementProps.reduce<Record<string, unknown>>(
    (acc, cur) => {
      const propName = cur.prop_name
      const keyValue = getPropertyValueByPropName(propName) as string
      return {
        ...acc,
        [propName]: keyValue,
      }
    },
    {}
  )
  return elementPropsDict
}

export const getElementResolvedPropsDict = (params: {
  element: Element
  rootCompositeElementId?: string
  editorState: EditorStateType
  appController: AppController
  icons?: { [key: string]: string }
  viewport?: EditorStateType['ui']['selected']['viewport']
}) => {
  const {
    element,
    rootCompositeElementId,
    editorState,
    appController,
    icons,
    viewport,
  } = params
  const unresolvedElementPropsDict = getElementPropsRawDict({
    element,
    editorState,
    viewport,
  })

  const keys = Object.keys(unresolvedElementPropsDict)

  const getPropertyByPropName = (propName: string) =>
    editorState.properties?.find((prop) => prop.prop_name === propName)

  const elementResolvedPropsDict = keys.reduce<Record<string, unknown>>(
    (acc, cur) => {
      const key = cur
      const keyValueRaw = unresolvedElementPropsDict[key] as string
      const matches = keyValueRaw?.match?.(
        /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g
      )
      const keyValueAdj = matches
        ? replacePlaceholdersInString(
            keyValueRaw as string,
            appController.state,
            editorState.composite_component_props,
            editorState.properties,
            element,
            rootCompositeElementId,
            undefined,
            icons
          )
        : keyValueRaw

      const isFormularInput = keyValueRaw !== keyValueAdj
      const transformerStr = isFormularInput
        ? (() => {
            const prop = getPropertyByPropName(key)
            return (
              prop &&
              editorState.transformers.find(
                (tr) =>
                  tr.prop_id === prop.prop_id &&
                  tr.element_id === element.element_id
              )?.transformer_string
            )
          })()
        : undefined
      const transformerFn =
        isFormularInput && transformerStr
          ? replacePlaceholdersInString(
              transformerStr,
              appController.state,
              editorState.composite_component_props,
              editorState.properties,
              element,
              rootCompositeElementId,
              true,
              icons,
              true
            )
          : null

      // if (
      //   transformerFn &&
      //   element?.element_type?.toLowerCase().includes('treeview')
      // ) {
      //   console.log('transformerFn', transformerFn, transformerStr, icons)
      // }
      const keyValueAdj2 =
        typeof transformerFn === 'function' && Array.isArray(keyValueAdj)
          ? transformerFn?.(keyValueAdj)
          : keyValueAdj

      const keyValueAdj3 =
        key === 'open' &&
        ['Dialog', 'Alert'].includes(element?.element_type ?? '') &&
        element &&
        'element_id' in element
          ? (appController?.state?.[element?.element_id] ?? keyValueAdj2)
          : keyValueAdj2
      return {
        ...acc,
        [key]: keyValueAdj3,
      }
    },
    {}
  )
  return elementResolvedPropsDict
}

// const elementProps = useMemo(() => {
//   const elementOwnProps =
//     !selectedElementAdj || !('element_id' in selectedElementAdj)
//       ? []
//       : editorState.properties?.filter(
//           (prop) => prop.element_id === selectedElementAdj?.element_id
//         )
//   const templateProps =
//     selectedElementAdj && 'template_id' in selectedElementAdj
//       ? editorState.properties?.filter(
//           (prop) =>
//             prop.template_id === selectedElementAdj?.template_id &&
//             !elementOwnProps.find(
//               (elprop) => elprop.prop_name === prop.prop_name
//             )
//         )
//       : []
//   const defaultTemplateProps =
//     selectedElementAdj &&
//     'props' in selectedElementAdj &&
//     !('element_id' in selectedElementAdj)
//       ? Object.keys(selectedElementAdj?.props ?? {})?.reduce?.(
//           (acc, key) => [
//             ...acc,
//             {
//               prop_id: null as unknown as string,
//               project_id: editorState.project.project_id,
//               prop_name: key,
//               prop_value: selectedElementAdj?.props?.[key],
//               component_id: null,
//               template_id: editorState.ui.selected.template,
//               element_id: null,
//             } as Property,
//           ],
//           [] as Property[]
//         )
//       : []

//   const allElementProps = [
//     ...(elementOwnProps ?? []),
//     ...(templateProps ?? []),
//     ...(defaultTemplateProps ?? []),
//   ]
//   return allElementProps.reduce<Record<string, unknown>>((acc, prop) => {
//     const value =
//       prop.prop_value === 'null'
//         ? null
//         : prop.prop_value === 'true'
//           ? true
//           : prop.prop_value === 'false'
//             ? false
//             : prop.prop_value

//     return {
//       ...acc,
//       [prop.prop_name]:
//         prop?.prop_name === 'open' &&
//         ['Dialog', 'Alert'].includes(elementType ?? '') &&
//         selectedElementAdj &&
//         'element_id' in selectedElementAdj
//           ? (appController?.state?.[selectedElementAdj?.element_id] ?? value)
//           : value,
//       // TODO: is it needed at all?
//       element_id:
//         selectedElementAdj && 'element_id' in selectedElementAdj
//           ? selectedElementAdj?.element_id
//           : null,
//     }
//   }, {})
// }, [
//   selectedElementAdj,
//   editorState.properties,
//   appController?.state,
//   elementType,
//   editorState.project.project_id,
//   editorState.ui.selected.template,
// ])
