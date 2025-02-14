export const serializeEditorSetting = (settings: any[]) => {
  return (
    settings?.map((setting) => {
      return {
        ...setting,
        treeview_expand_multiple_actions: setting
          .treeview_expand_multiple_actions?.length
          ? JSON.stringify(setting.treeview_expand_multiple_actions)
          : null,
      }
    }) ?? []
  )
}
