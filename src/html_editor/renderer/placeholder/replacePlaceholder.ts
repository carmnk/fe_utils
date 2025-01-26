import { getDeepPropertyByPath } from '../../../utils/object'
import { EditorRendererControllerType } from '../../types/editorRendererController'
import { EditorStateType } from '../../types'

export const REGEX_DATA_PLACEHOLDER = /{_data\.[^}]*}/g
export const REGEX_FORMDATA_PLACEHOLDER = /{formData\.[^}]*}/g
export const REGEX_TREEVIEW_PLACEHOLDER = /{treeviews\.[^}]*}/g
export const REGEX_PROPS_PLACEHOLDER = /{props\.[^}]*}/g
export const REGEX_BUTTON_STATES_PLACEHOLDER = /{buttonStates\.[^}]*}/g
export const REGEX_MDIICON_PLACEHOLDER = /{mdi\w*}/g

export const REGEX_RESOLUTION_FAILED =
  /(({_data)|({formData)|({treeviews)|({props)|({buttonStates))\.[^}]*'[^}]*'[^}]*/g

export const REGEX_PLACEHOLDERS = [
  REGEX_DATA_PLACEHOLDER,
  REGEX_TREEVIEW_PLACEHOLDER,
  REGEX_PROPS_PLACEHOLDER,
  REGEX_BUTTON_STATES_PLACEHOLDER,
]

export const checkForPlaceholders = (text: string) => {
  return !!REGEX_PLACEHOLDERS.map((regex) => text.match(regex)).filter(
    (match) => match
  )?.length
}

/**  replaces the placeholders AND EVALs the string if it contains any placeholders, static calculations are skipped!
    @returns the evaluated string -> can be any type !!!
*/
export const replacePlaceholdersInString = (
  text: string,
  appState: EditorRendererControllerType['appController']['state'],
  componentPropertyDefinitions: EditorStateType['composite_component_props'],
  properties: EditorStateType['properties'],
  currentElement: EditorRendererControllerType['selectedElement'],
  rootCompositeElementId?: string,
  forceEval?: boolean,
  icons?: Record<string, string>,
  isTransformer?: boolean,
  formData?: Record<string, unknown>
) => {
  const getTemplates = (text: string) => {
    let templatesOut: {
      placeholder: string
      value: string | number | boolean | object
      type: string
      placeholderRaw: string
      placeholderCutted: string
      isValueUndefined: boolean
    }[] = []

    const buttonStatesMatches = text.match(REGEX_BUTTON_STATES_PLACEHOLDER)
    const buttonStatesTemplates =
      buttonStatesMatches?.map((match) => {
        const keyRaw = match //.replace('{buttonStates.', '').replace('}', '')
        const key = keyRaw.split('.').slice(1).join('.')?.replaceAll('}', '')

        return {
          type: 'buttonStates',
          placeholder: match,
          placeholderRaw: match,
          placeholderCutted: match.split('.').slice(1).join('.'),
          value: appState?.buttonStates?.[key] ?? '',
          isValueUndefined: appState?.buttonStates?.[key] === undefined,
        }
      }) || []

    const regex = REGEX_DATA_PLACEHOLDER
    const dataMatches = text.match(regex)
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

    const regexFormData = REGEX_FORMDATA_PLACEHOLDER
    const formDataMatches = text.match(regexFormData)
    const formDataTemplates = !formData
      ? []
      : formDataMatches?.map((match) => {
          const keyRaw = match.replace('{formData.', '').replace('}', '')
          const key = keyRaw.replace(/\..*$/gm, '')

          return {
            type: 'formData',
            placeholder: key,
            placeholderRaw: keyRaw,
            placeholderCutted: keyRaw.replace(key, ''),
            value: formData?.[key] ?? '',
            isValueUndefined: formData?.[key] === undefined,
          }
        }) || []

    const regexTreeViews = REGEX_TREEVIEW_PLACEHOLDER
    const treeViewMatches = text.match(regexTreeViews)
    const treeViewTemplates =
      treeViewMatches?.map((match) => {
        const keyRaw = match.replace('{treeviews.', '').replace('}', '')
        const key = keyRaw.replace(/\..*$/gm, '')

        return {
          type: 'treeviews',
          placeholder: key,
          placeholderRaw: keyRaw,
          placeholderCutted: keyRaw.replace(key, ''),
          value:
            key in appState.treeviews
              ? (appState.treeviews?.[key as keyof typeof appState.treeviews] ??
                '')
              : '',
          isValueUndefined:
            appState?.treeviews?.[key as keyof typeof appState.treeviews] ===
            undefined,
        }
      }) || []

    const propsMatches = text.match(REGEX_PROPS_PLACEHOLDER)
    const propsTemplates =
      propsMatches?.map((match) => {
        const keyRaw = match.replace('{props.', '').replace('}', '')
        const key = keyRaw.replace(/\..*$/gm, '')

        const propDef = componentPropertyDefinitions.find(
          (def) =>
            def.property_name === key &&
            def.component_id === currentElement?.component_id
        )
        // currentElement is the element in the component that actually uses the template
        const instanceValueProp = properties?.find(
          (prop) =>
            prop.component_id === propDef?.component_id &&
            prop.prop_name === key &&
            prop.element_id === currentElement?.element_id // HERE IS THE BUG SOMEWHERE
        )

        // const instanceValueAttribute = attributes.find(
        //   (attr) =>
        //     attr.component_id === propDef?.component_id &&
        //     attr.attr_name === key &&
        //     (attr.element_id === currentElement?.element_id ||
        //       attr.element_id === elementId)
        // )
        // const styleAttributeInstanceValue = attributes.find(
        //   (attr) =>
        //     (attr.element_id === currentElement?.element_id ||
        //       attr.element_id === elementId) &&
        //     attr.attr_name === 'style'
        // )?.attr_value?.[key]

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
            instanceValueProp?.prop_value ??
            // styleAttributeInstanceValue ??
            rootCompositeElementPropValue ??
            propDef?.property_default_value ??
            '',
          isValueUndefined: !propDef?.property_default_value,
          debugInstanceValueProp: instanceValueProp,
          debugRootCompositeElementPropValue: rootCompositeElementPropValue,
          debugPropDef: propDef,
        }
      }) || []

    const regexMdiIcon = REGEX_MDIICON_PLACEHOLDER
    const mdiIconMatches = text.match(regexMdiIcon)
    const mdiIconTemplates =
      !icons || !Object.keys(icons)?.length
        ? []
        : mdiIconMatches
            ?.map((match) => {
              const cuttedPlaceholderName = match
                .replaceAll('{', '')
                .replaceAll('}', '')
              return {
                type: 'mdi',
                placeholder: match,
                placeholderRaw: match,
                placeholderCutted: cuttedPlaceholderName,
                value: icons?.[cuttedPlaceholderName] ?? '<ICON%/>',
                isValueUndefined: false,
              }
            })
            .filter((match) => !!match.value) || []

    templatesOut = [
      ...templatesOut,
      ...dataTemplates,
      ...propsTemplates,
      ...treeViewTemplates,
      ...mdiIconTemplates,
      ...buttonStatesTemplates,
      ...formDataTemplates,
    ]
    return templatesOut
  }

  let newText = text
  const templates = typeof text === 'string' ? getTemplates(text) : []

  const undefinedPlaceholders = []
  for (const template of templates) {
    if (['string', 'number', 'boolean'].includes(typeof template.value)) {
      newText = isTransformer
        ? newText.replaceAll(template.placeholder, template.value.toString())
        : newText
            .replaceAll(
              template.placeholder,
              typeof template.value === 'string'
                ? "'" + template.value.toString() + "'"
                : template.value.toString()
            )
            ?.replaceAll?.('{formData.', '')
    } else {
      if (template.isValueUndefined) {
        undefinedPlaceholders.push(template.placeholder)
        continue
      }
      if (
        typeof template.value === 'object' &&
        template.placeholderCutted.startsWith('.')
      ) {
        const path = template.placeholderCutted?.slice(1).split('.')

        const value = getDeepPropertyByPath(template.value, path)
        console.debug('PATH', template, path, value)
        if (value && typeof value === 'object') {
          newText = value as any
          break
        }
        newText = newText
          .replaceAll(
            template.placeholderRaw,
            value
              ? typeof value === 'string'
                ? '"' + value + '"'
                : (value as string)
              : ''
          )
          .replaceAll('{_data.', '')
          .replaceAll('{formData.', '')
          .replaceAll('{treeviews.', '')
          .replaceAll('}', '')
        continue
      }
      newText = newText.replaceAll(template.placeholder, '"XXX"')
      console.warn('Template value is not a string', template)
    }
  }

  if (typeof newText === 'string' && templates.length && !isTransformer) {
    newText = newText.replaceAll('{props.', '').replaceAll('}', '')
  }

  try {
    console.debug(
      'BEFORE EVAL -',
      newText,
      '-',
      typeof newText,
      newText === text,
      text,
      'templates',
      templates,
      'formData',
      formData,
      'if true no eval',
      (newText === text || typeof newText !== 'string') && !forceEval,
      forceEval
    )
    if (newText?.match?.(REGEX_RESOLUTION_FAILED)) {
      console.warn('Resolution failed', newText, text, templates)
      return newText
    }
    // this will though prevent calculations without placeholders
    const evalText =
      (newText === text || typeof newText !== 'string') && !forceEval
        ? newText
        : eval(newText)
    console.debug('AFTER EVAL', evalText)
    return evalText === 'true' ? true : evalText === 'false' ? false : evalText
  } catch (e) {
    console.error('Error in eval', e, newText)
    return undefinedPlaceholders.length
      ? 'Placeholder could not be resolved: ' + undefinedPlaceholders.join(', ')
      : 'Error in eval'
  }
}
