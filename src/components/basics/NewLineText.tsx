import { EllipsisTextWithTooltip } from './EllipsisTooltip'

export type NewLineTextProps = {
  text: string
}
export const NewlineText = (props: NewLineTextProps) => {
  const text = props?.text
  return (
    <>
      {text
        ?.split?.('\n')
        .map((str, sIdx) => (
          <EllipsisTextWithTooltip component="p" key={sIdx} label={str} />
        ))}
    </>
  )
}
