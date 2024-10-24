import { ExtendedTheme } from '../../theme/muiTheme'
import { defaultEditorState } from '../defaultEditorState'
import { EditorStateType } from '../types'
import { isComponentType } from '../../renderer/utils'
import { reloadSerializedThemes } from './transformEditorStateTheme'
import { EditorStateDbDataType } from './editorDbStateType'
import { PropertyType } from '../../editorComponents/schemaTypes'
import {
  checkForPlaceholders,
  REGEX_PLACEHOLDERS,
} from '../../renderer/placeholder/replacePlaceholder'

export const transformEditorStateFromPayload = (
  data: EditorStateDbDataType,
  currentEditorState = defaultEditorState(),
  componentsIn: any[],
  disableThemeReload = false
): EditorStateType => {
  const {
    selected_css_selector,
    selected_element,
    selected_font,
    selected_image,
    selected_page,
    selected_server_setting,
    selected_state,
    selected_entity,
    selected_entity_element,
    active_tab,
    active_backend_tab,
    pointer_mode,
    active_menu,
    default_theme: defaultTheme,
    ...project
  } = data?.project ?? {}

  const ui = {
    ...(currentEditorState?.ui ?? {}),
    selected: {
      ...(currentEditorState?.ui?.selected ?? {}),
      cssSelector: selected_css_selector ?? null,
      element: selected_element ?? null,
      font: selected_font ?? null,
      image: selected_image ?? null,
      page: selected_page ?? null,
      serverSetting: selected_server_setting ?? 'ssl',
      state: selected_state ?? null,
      entity: selected_entity ?? null,
      entityElement: selected_entity_element ?? 'fields',
    },
    navigationMenu: {
      ...(currentEditorState?.ui?.navigationMenu ?? {}),
      activeTab: active_tab as any,
      activeBackendTab: active_backend_tab as any,
      activeMenu:
        (active_menu as any) ??
        currentEditorState?.ui?.navigationMenu?.activeMenu,
    },
    pointerMode: pointer_mode as any,
  }

  const newImageAssets = {
    images: data?.images?.map?.((image) => ({
      ...((currentEditorState?.assets?.images?.find?.(
        (img) => img._id === image.asset_id
      ) ?? {}) as any),
      _id: image.asset_id,
      type: image.type,
      fileName: image.asset_filename,
      created_datetime: (image as any).created_datetime,
      edited_datetime: (image as any).edited_datetime,
      // src:
    })),
  }
  const allElements =
    data?.elements?.map?.((el) => ({
      ...(isComponentType(el.element_type)
        ? componentsIn.find((bc) => bc.type === el.element_type)
        : {}),
      _id: el.element_id,
      _userID: el.element_html_id,
      _parentId: el.parent_id,
      _content: el.content as any,
      _type: el.element_type as any,
      _disableDelete: el.element_disable_delete ?? undefined,
      _page: el.element_page as string,
      viewport: el.viewport,
      template_id: el.template_id,
      project_id: el.project_id,
      component_id: el.component_id,
      ref_component_id: el.ref_component_id,
    })) ?? []
  const baseViewportElements = allElements.filter((el) => !el?.viewport)

  // const elementsOtherViewports =

  const elements = [...baseViewportElements]
  const alternativeElements = allElements.filter((el) => el?.viewport)

  const alternativeViewports = {
    sm: alternativeElements.filter((el) => el?.viewport === 'sm'),
    md: alternativeElements.filter((el) => el?.viewport === 'md'),
    lg: alternativeElements.filter((el) => el?.viewport === 'lg'),
    xl: alternativeElements.filter((el) => el?.viewport === 'xl'),
  }

  const themes =
    disableThemeReload || !data.themes?.length
      ? (data.themes as any)
      : reloadSerializedThemes(
          data.themes as any,
          currentEditorState?.themes,
          data.theme_typographys
        )

  const externalApis: EditorStateType['externalApis'] =
    data?.externalApis?.map((api) => {
      return {
        external_api_id: api.external_api_id,
        name: api.name,
        auth:
          api.auth_type === 'basic'
            ? {
                type: api.auth_type,
                username: api.auth_basic_username,
                password: api.auth_basic_password,
              }
            : api.auth_type === 'bearer'
              ? { type: api.auth_type, token: api.auth_bearer_token }
              : { type: api.auth_type },
        baseUrl: api.base_url,
        useCookies: api.use_cookies,
        project_id: api.project_id,
        endpoints: data?.endpoints
          .filter((ep) => ep.api_id === api.external_api_id)
          ?.map((ep) => {
            return {
              project_id: ep.project_id,
              endpoint_id: ep.endpoint_id,
              name: ep.name,
              url: ep.url,
              method: ep.method,
              auth:
                ep.auth_type === 'basic'
                  ? {
                      type: ep.auth_type,
                      username: ep.auth_basic_username as string,
                      password: ep.auth_basic_password as string,
                    }
                  : ep.auth_type === 'bearer'
                    ? {
                        type: ep.auth_type,
                        token: ep.auth_bearer_token as string,
                      }
                    : { type: ep.auth_type },
              responseType: ep.response_type,
              useCookies: ep.use_cookies,
              headers: data?.headers
                ?.filter(
                  (header) =>
                    header.endpoint_id === ep.endpoint_id && header.endpoint_id
                )
                ?.map((header) => ({
                  ...header,
                  name: header.key,
                })),
              params: data?.params.filter(
                (param) => param.endpoint_id === ep.endpoint_id
              ),
              body: data?.bodyParams.filter(
                (param) => param.endpoint_id === ep.endpoint_id
              ),
            }
          }),
        headers: data?.headers
          .filter(
            (header) =>
              header.api_id &&
              header.api_id === api.external_api_id &&
              !header.endpoint_id
          )
          ?.map((header) => ({
            ...header,
            name: header.key,
          })),
      }
    }) ?? []

  return {
    ...currentEditorState,
    transformers: data?.transformers ?? [],
    properties:
      data?.properties?.map((prop) => {
        const element = elements.find((el) => el._id === prop.element_id)
        const baseComponent = componentsIn.find(
          (comp) => comp.type === element?._type
        )
        const baseComponentSchema = baseComponent?.schema
        const baseComponentSchemaProps = baseComponentSchema?.properties
        const baseComponentSchemaProp =
          baseComponentSchemaProps?.[prop.prop_name]
        const baseComponentSchemaPropType = baseComponentSchemaProp?.type
        const isSchemaPropInt = baseComponentSchemaPropType === PropertyType.Int
        const isSchemaPropNumeric =
          isSchemaPropInt || baseComponentSchemaPropType === PropertyType.Number

        const isSchemaPropJson =
          baseComponentSchemaPropType === PropertyType.json
        const isSchemaPropEventHandler =
          baseComponentSchemaPropType === PropertyType.eventHandler

        const isHtmlEvent =
          prop.prop_name?.startsWith('on') && !isComponentType(element?._type)

        const value =
          isHtmlEvent ||
          isSchemaPropJson ||
          isSchemaPropEventHandler ||
          [
            'items',
            'slotProps',
            'columns',
            'fields',
            'filters',
            'buttonProps',

            // 'sx',
            // 'data',
            'footerData',
            // 'fields',
            // 'onClick',
          ].includes(prop.prop_name) ||
          (['children'].includes(prop.prop_name) &&
            element?.element_type !== 'Typography')
            ? (() => {
                try {
                  const propValue = prop.prop_value
                  // check if propValue is a placeholder
                  if (typeof propValue === 'string') {
                    const matches = checkForPlaceholders(propValue)
                    if (matches) {
                      return propValue
                    }
                  }

                  return JSON.parse(propValue)
                } catch (e) {
                  // console.error(e, prop)
                  return prop.prop_value
                }
              })()
            : prop.prop_value === 'null'
              ? null
              : prop.prop_value === 'true'
                ? true
                : prop.prop_value === 'false'
                  ? false
                  : isSchemaPropInt
                    ? parseInt(prop?.prop_value)
                    : isSchemaPropNumeric
                      ? parseFloat(prop?.prop_value)
                      : prop.prop_value
        return { ...prop, prop_value: value }
      }) ?? [],
    attributes:
      data?.attributes?.map((attr) => {
        const value = ['style'].includes(attr.attr_name)
          ? (() => {
              try {
                return JSON.parse(attr.attr_value)
              } catch (e) {
                console.error(e, attr)
                return attr.attr_value
              }
            })()
          : attr.attr_value === 'null'
            ? null
            : attr.attr_value === 'true'
              ? true
              : attr.attr_value === 'false'
                ? false
                : attr.attr_value
        return { ...attr, attr_value: value }
      }) ?? [],
    defaultTheme: defaultTheme as any,
    alternativeViewports,
    project,
    elements,
    components: data.components ?? [],
    cssSelectors:
      (data?.cssSelectors?.map?.((cssSelector) => ({
        ...cssSelector,
        _id: cssSelector.css_selector_id,
        _userId: cssSelector.css_selector_name,
      })) as any[]) ?? [],
    ui,
    assets: newImageAssets,
    themes,
    theme:
      themes?.find?.(
        (theme: ExtendedTheme) =>
          theme.palette.mode === currentEditorState.theme.name
      ) || currentEditorState?.theme,
    externalApis,
    // events:
    //   data?.events?.sort((a, b) => (a.event_name > b.event_name ? 1 : -1)) ??
    //   [],
    actions:
      data?.actions?.sort((a, b) => (a.action_id > b.action_id ? 1 : -1)) ?? [],
    templateComponents: data?.templates ?? [],
    compositeComponentProps: data?.composite_component_props ?? [],
    actionParams: data?.action_params ?? [],
    theme_typographys: data?.theme_typographys ?? [],
  }
}
