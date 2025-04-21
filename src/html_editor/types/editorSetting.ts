export type EditorSetting = {
  editor_setting_id?: number
  editor_theme?: 'light' | 'dark' | null
  editor_theme_primary_color?: string | null
  viewport_selector_type?: 'buttons' | 'dropdown'
  disable_ruler_mode_selector?: boolean | null
  disable_pointer_mode_selector?: boolean | null
  fallback_pointer_mode?: string | null
  fallback_dragging_mode?: 'reorder' | 'padding' | 'margin' | null
  disable_dragging_mode_selector?: boolean | null
  disable_preview_mode_selector?: boolean | null
  disable_theme_mode_selector?: boolean | null
  disable_page_selector?: boolean | null
  disable_show_titlebar_on_preview?: boolean | null
  disable_hide_navigation_bar?: boolean | null
  disable_treeview_hierarchy_lines?: boolean | null
  disable_treeview_expand_animation?: boolean | null
  disable_treeview_dragging?: boolean | null
  disable_treeview_delete_item_confirmation?: boolean | null
  treeview_expand_multiple_actions?: string[]
  disable_hide_details_bar?: boolean | null
  disable_details_bar_show_ids?: boolean | null
  disable_details_bar_show_html_content_tab?: boolean | null
  disable_details_bar_show_html_css_layout_tab?: boolean | null
  disable_details_bar_show_html_css_shape_tab?: boolean | null
  disable_details_bar_show_html_css_typography_tab?: boolean | null
  disable_gui_hover_element?: boolean | null
  disable_gui_select_element?: boolean | null
  disable_gui_simulate_links?: boolean | null
  project_id: string | null
  owner_user_id: number
}
