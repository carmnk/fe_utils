# Frontend Utils 

This library provides components and useful boilerplate to develop a react frontend app. 
The purpose of this library is not to provide brand new components but to use components and functions from existing libraries to create standardized __Composite Components__. 

Having common interfaces between components with similar functionality is important to quickly switch from one to another. Another aspect esp. for complex components is that there is often a tradeoff between developer usability and component customization (e.g. the border of the datefield is defined in a nested fieldset element). 

This library heavily relies on __Mui__ components (and the emotion as underlying css tool) which is a great toolset to build upon and start frontend development. 
The most practical and extensive icon library is in my opinion __MDI icons__. Each icon can be imported easily as literal string which is very useful esp. for parametrization.

## Common Interface 

Trying to force developer to do things in a predefined way is in my experience not a good practice. Instead making the component interface accessible as much as possible has proven to be better option for the developer. 

Accessibility 
- slotProps: All sub-components (and derived HTML elements) shall be accessible via the slotProps. Mui's slotProps if exist are extended. 
    - However the MUI prop to replace complete components via Slot is currently not offered. 
- sx: All components shall have sx, .... properties 
    - all input fiels shall have .... properties 
- borderRadius 
    - All components with a border order rect shape shall have a borderRadius prop 
- color: 
    - All components (if applicable and not already implemented by mui) shall have a color property accepting css and mui (theme) colors 

Additional global Features 
- tooltip: 
    - All components excluding Modals, Tooltips, Popover, Popups, Dropdowns shall have a tooltip property which accepts string but also any ReactNode. 
- icon 
    - All components (except .... ? ) shall have an icon property accepting both an imported mdi Icon (string) or a developer-defined ReactNode. 
