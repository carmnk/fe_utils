import {
  AppController,
  EditorStateType,
  Element,
  Property,
} from '../../editorRendererController'
import { replacePlaceholdersInString } from './replacePlaceholder'

export type ResolveElementPropsParams = {
  element: Element
  rootCompositeElementId?: string
  editorState: EditorStateType
  appController: AppController
  icons?: { [key: string]: string }
  elementProps: Property[]
  selectedElement: Element | null
}

export const resolveElementProps = (params: ResolveElementPropsParams) => {
  const {
    element,
    rootCompositeElementId,
    editorState,
    appController,
    icons,
    elementProps,
    selectedElement,
  } = params

  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const elementPropsDict = elementProps.reduce<Record<string, unknown>>(
    (acc, cur) => {
      const key = cur.prop_name
      const keyValue = getPropByName(key)
      const matches = keyValue?.match?.(
        /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g
      )
      const keyValueAdj = matches
        ? replacePlaceholdersInString(
            keyValue,
            appController.state,
            editorState.compositeComponentProps,
            editorState.properties,
            editorState.attributes,
            element as any,
            element._id,
            rootCompositeElementId,
            undefined,
            icons
          )
        : keyValue

      const isFormularInput = keyValue !== keyValueAdj
      const transformerStr = editorState.transformers.find(
        (tr) => tr.prop_id === cur.prop_id && tr.element_id === element._id
      )?.transformer_string
      const transformerFn =
        isFormularInput && transformerStr
          ? replacePlaceholdersInString(
              transformerStr,
              appController.state,
              editorState.compositeComponentProps,
              editorState.properties,
              editorState.attributes,
              element,
              element._id,
              rootCompositeElementId,
              true,
              icons,
              true
            )
          : null

      // if (
      //   transformerFn &&
      //   element?._type?.toLowerCase().includes('treeview')
      // ) {
      //   console.log('transformerFn', transformerFn, transformerStr, icons)
      // }
      const keyValueAdj2 =
        typeof transformerFn === 'function' && Array.isArray(keyValueAdj)
          ? transformerFn?.(keyValueAdj)
          : keyValueAdj
      return {
        ...acc,
        [key]: keyValueAdj2,
      }
    },
    {}
  )
  return elementPropsDict
}
