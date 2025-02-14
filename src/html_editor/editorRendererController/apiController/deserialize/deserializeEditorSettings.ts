export const deserializeEditorSettings = (settings: any[]) => {
  return settings.map((setting) => {
    return {
      ...setting,
      treeview_expand_multiple_actions:
        setting?.treeview_expand_multiple_actions
          ? JSON.parse(setting.treeview_expand_multiple_actions)
          : null,
    }
  })
}
