import { EditorStateType, Element, Property } from '../../types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ArraySchemaType, ElementModel } from '../../editorComponents'

/** extracts a component's icon keys (properties of type 'icon') */
export const getIconKeys = (
  elementType: string,
  elementModels: ElementModel[]
) => {
  const elementModel = elementModels.find((model) => model.type === elementType)
  if (!elementModel) return { directIconKeys: [], arrayOfObjectProperties: [] }
  const properties: ElementModel['schema']['properties'] =
    ('schema' in elementModel && elementModel?.schema?.properties) || {}
  const directIconKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'icon'
  )
  const directArrayKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'array'
  )
  const arrayOfObjectProperties = directArrayKeys.map((key) => {
    const propertySchema = properties[key] as ArraySchemaType
    const arrayProperties =
      ('items' in propertySchema &&
        propertySchema.items?.length &&
        'properties' in propertySchema.items[0] &&
        propertySchema.items[0]?.properties) ||
      {}
    const arrayPropertyKeys = Object.keys(arrayProperties)
    const iconPropertyKeys = arrayPropertyKeys.filter(
      (key) => arrayProperties[key].type === 'icon'
    )
    return {
      key,
      properties: arrayProperties,
      propertyKeys: iconPropertyKeys,
    }
  }) // eg. key=items -> properties

  const arrayOfObjectIconKeys = arrayOfObjectProperties
    .map((array) => array.propertyKeys)
    ?.flat()
  return { directIconKeys, arrayOfObjectProperties, arrayOfObjectIconKeys }
}

type Icons = { [key: string]: string }

export const useMdiIcons = (
  selectedPageElements: Element[],
  components: ElementModel[],
  properties: EditorStateType['properties'],
  importIconByName: (name: string) => Promise<string>
): [{ [key: string]: string }, Dispatch<SetStateAction<Icons>>] => {
  const [icons, setIcons] = useState<Icons>({})

  useEffect(() => {
    const getPropertyValueByName = (key: string, element_id: string): unknown =>
      properties?.find(
        (prop) => prop.prop_name === key && prop.element_id === element_id
      )?.prop_value
    const getPropsByName = (key: string, element_id: string): Property[] =>
      properties?.filter(
        (prop) => prop.prop_name === key && prop.element_id === element_id
      )

    const updateIcons = async () => {
      const flatElements = selectedPageElements
      const iconsNames = flatElements
        .map((el) => {
          const { directIconKeys, arrayOfObjectProperties } = getIconKeys(
            el.element_type,
            components
          )

          const directIconNames = directIconKeys
            .map((iconKey) => {
              return getPropsByName(iconKey, el.element_id)?.map(
                (prop) => prop.prop_value
              )
            })
            .flat()
          // UNCLEAR ???
          const arrayItemIconNames =
            arrayOfObjectProperties
              ?.map?.((props) => {
                const propertyValueRaw = getPropertyValueByName(
                  props.key,
                  el.element_id
                )
                const propertyValue = Array.isArray(propertyValueRaw)
                  ? propertyValueRaw
                  : []
                return propertyValue?.map?.((it) => {
                  return props?.propertyKeys?.map?.((key) => it?.[key])
                })
              })
              ?.flat()
              .flat() ?? []

          const allIconNames = [...directIconNames, ...arrayItemIconNames]
          return allIconNames
        })
        .flat()
        .filter((el) => el && !Object.keys(icons).includes(el))

      if (!iconsNames.length) {
        return
      }
      const iconsNew: Record<string, string> = {}

      for (let i = 0; i < iconsNames.length; i++) {
        const iconName = iconsNames[i]
        if (!icons[iconName]) {
          iconsNew[iconName] = await importIconByName(iconName)
        }
      }
      setIcons((current) => ({ ...current, ...iconsNew }))
    }
    updateIcons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageElements, properties, components, importIconByName])

  return [icons, setIcons]
}
