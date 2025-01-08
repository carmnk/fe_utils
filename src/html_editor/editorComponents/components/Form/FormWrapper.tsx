export const a = 1
// import { CommonComponentPropertys } from '../componentProperty'
// import { GenericForm, GenericFormProps } from '../../../../components'
// import { createAppAction } from '../../../renderer/actions/createAppAction'

// export const FormWrapper = (
//   props: GenericFormProps & CommonComponentPropertys
// ) => {
//   const { appController, id, formData, onChangeFormData, ...rest } = props

//   return <GenericForm

//   formData={
//   formData ??
//   appController.actions.getFormData(id)}
// onChangeFormData={ (onChangeFormData as any)
//   ? (newFormData: Record<string, unknown>) =>
//       createAppAction?.({
//         element,
//         eventName: 'onChangeFormData',
//         editorState,
//         currentViewportElements,
//         COMPONENT_MODELS,
//         appController,
//         icons,
//         navigate,
//         isProduction,
//       })?.(null, newFormData)
//   : (
//       newFormData: Record<string, unknown>
//       // propertyKey: string,
//       // propertyValue: any,
//       // prevFormData: any
//     ) => {
//       appController.actions.changeFormData(
//         id,
//         newFormData
//       )}
//     },
//   {...rest} />
// }
