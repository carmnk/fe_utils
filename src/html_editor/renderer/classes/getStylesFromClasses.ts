import { CSSProperties } from 'react'
import { EditorStateType } from '../../editorRendererController'

export const getStylesFromClasses = (
  selectorId: string,
  cssSelectors: EditorStateType['cssSelectors']
): CSSProperties => {
  const className = cssSelectors.find(
    (sel) => sel.css_selector_id === selectorId
  )?.css_selector_name

  const classNames = className?.trim?.()?.split?.(' ') || []
  const cssSelector = cssSelectors?.find(
    (selector) => classNames.includes(selector.css_selector_name) // or element_id?!
  )

  const classStyles = cssSelector ?? {}

  // const stylesFromClasses = classStyles?.reduce?.((acc, curr) => {
  //   return {
  //     ...acc,
  //     ...curr,
  //   };
  // }, {});
  return classStyles
}
