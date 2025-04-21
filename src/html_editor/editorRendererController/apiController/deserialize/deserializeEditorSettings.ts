import { EditorSetting } from '../..'

export const deserializeEditorSettings = (settings: EditorSetting[]) => {
  return settings.map((setting) => {
    return {
      ...setting,
      treeview_expand_multiple_actions:
        setting?.treeview_expand_multiple_actions
          ? JSON.parse(
              setting?.treeview_expand_multiple_actions as unknown as string
            )
          : null,
    }
  })
}
