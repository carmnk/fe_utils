import { getDeepPropertyByPath } from '../../utils/object'
import { EditorRendererControllerType } from '../editorRendererController/editorRendererControllerTypes'
import { EditorStateType } from '../editorRendererController/editorState'

/**  replaces the placeholders AND EVALs the string if it contains any placeholders, static calculations are skipped!
    @returns the evaluated string -> can be any type !!!
*/
export const replaceTemplateInString = (
  text: string,
  appState: EditorRendererControllerType<any>['appController']['state'],
  componentPropertyDefinitions: EditorStateType['compositeComponentProps'],
  properties: EditorStateType['properties'],
  selectedElement: EditorRendererControllerType<any>['selectedElement'],
  rootCompositeElementId?: string
) => {
  const getTemplates = (text: string) => {
    let templatesOut: {
      placeholder: string
      value: string
      type: string
      placeholderRaw: string
      placeholderCutted: string
    }[] = []
    const regex = /{_data\.[^}]*}/g
    const dataMatches = text.match(regex)
    // if (!matches) {
    //   return []
    // }
    const dataTemplates =
      dataMatches?.map((match) => {
        const keyRaw = match.replace('{_data.', '').replace('}', '')
        const key = keyRaw.replace(/\..*$/gm, '')

        return {
          type: 'data',
          placeholder: key,
          placeholderRaw: keyRaw,
          placeholderCutted: keyRaw.replace(key, ''),
          value: appState?._data?.[key] ?? '',
          isValueUndefined: appState?._data?.[key] === undefined,
        }
      }) || []

    const propsMatches = text.match(/{props\.[^}]*}/g)
    const propsTemplates =
      propsMatches?.map((match) => {
        const keyRaw = match.replace('{props.', '').replace('}', '')
        const key = keyRaw.replace(/\..*$/gm, '')

        const propDef = componentPropertyDefinitions.find(
          (def) => def.property_name === key
        )

        // selectedElement is the element in the component that actually uses the template
        const instanceValue = properties?.find(
          (prop) =>
            prop.component_id === propDef?.component_id &&
            prop.prop_name === key &&
            prop.element_id === selectedElement?._id // HERE IS THE BUG SOMEWHERE
        )
        const rootCompositeElementPropValue = properties?.find(
          (prop) =>
            prop.component_id === propDef?.component_id &&
            prop.prop_name === key &&
            prop.element_id === rootCompositeElementId
        )?.prop_value

        return {
          type: 'props',
          placeholder: key,
          placeholderRaw: keyRaw,
          placeholderCutted: keyRaw.replace(key, ''),
          value:
            rootCompositeElementPropValue ??
            propDef?.property_default_value ??
            '',
          isValueUndefined: !propDef?.property_default_value,
        }
      }) || []

    templatesOut = [...templatesOut, ...dataTemplates, ...propsTemplates]
    return templatesOut
  }

  let newText = text
  const templates = getTemplates(text)

  const undefinedPlaceholders = []
  for (const template of templates) {
    if (['string', 'number', 'boolean'].includes(typeof template.value)) {
      newText = newText.replaceAll(
        template.placeholder,
        "'" + template.value.toString() + "'"
      )
    } else {
      if ((template as any).isValueUndefined) {
        undefinedPlaceholders.push(template.placeholder)
        continue
      }
      if (
        typeof template.value === 'object' &&
        template.placeholderCutted.startsWith('.')
      ) {
        const path = template.placeholderCutted?.slice(1).split('.')
        const value = getDeepPropertyByPath(template.value, path)
        console.debug(
          'BEFORE EVAL VALUE',
          value,
          newText,
          '-',
          typeof newText,
          newText === text,
          text,
          'templ',
          templates
        )
        if (typeof value === 'object') {
          newText = value
          break
        }
        newText = newText
          .replaceAll(template.placeholderRaw, value ? '"' + value + '"' : '')
          .replaceAll('{_data.', '')

          .replaceAll('}', '')
        continue
      }
      newText = newText.replaceAll(template.placeholder, '"XXX"')
      console.warn('Template value is not a string', template)
    }
  }
  if (typeof newText === 'string') {
    newText = newText.replaceAll('{props.', '').replaceAll('}', '')
  }
  // if (typeof newText === 'object') {

  // }
  try {
    console.debug(
      'BEFORE EVAL -',
      newText,
      '-',
      typeof newText,
      newText === text,
      text,
      'templ',
      templates
    )
    // this will though prevent calculations without placeholders
    const evalText =
      newText === text || typeof newText !== 'string' ? newText : eval(newText)
    return evalText === 'true' ? true : evalText === 'false' ? false : evalText
  } catch (e) {
    console.error('Error in eval', e, newText)
    return undefinedPlaceholders.length
      ? 'Placeholder could not be resolved: ' + undefinedPlaceholders.join(', ')
      : 'Error in eval'
  }
}
