import { EditorSetting } from '../..'

export const serializeEditorSetting = (settings: EditorSetting[]) => {
  return (
    settings?.map((setting) => {
      return {
        ...setting,
        treeview_expand_multiple_actions: setting
          .treeview_expand_multiple_actions?.length
          ? (JSON.stringify(
              setting.treeview_expand_multiple_actions
            ) as unknown as string[] )
          : null,
      }
    }) ?? []
  )
}
