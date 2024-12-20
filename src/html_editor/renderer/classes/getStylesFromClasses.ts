import { CSSProperties } from 'react'
import { EditorStateType } from '../../editorRendererController'

export const getStylesFromClasses = (
  selectorId: string,
  cssSelectors: EditorStateType['cssSelectors']
): CSSProperties => {
  const className = cssSelectors.find((sel) => sel._id === selectorId)?._userId

  const classNames = className?.trim?.()?.split?.(' ') || []
  const cssSelector = cssSelectors?.find(
    (selector) => classNames.includes(selector._userId) // or _id?!
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
