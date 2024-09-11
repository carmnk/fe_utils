import { Box } from '@mui/material'
import { Fragment } from 'react/jsx-runtime'

const inlineFormat = (lineText: string) => {
  const boldMarkDown = /\*\*(.*?)\*\*/g
  // const boldMarkdownWithUnderScore = /__(.*?)__/g;
  const boldMarkDownMatches = lineText.match(boldMarkDown)
  const boldMatches = boldMarkDownMatches?.map((match) => ({
    match,
    start: lineText.indexOf(match),
    end: lineText.indexOf(match) + match.length,
  }))

  return !boldMarkDownMatches || !boldMatches?.length
    ? lineText
    : boldMatches.reduce<any[]>((acc, match, idx, arr) => {
        const { match: bold, start, end } = match
        const prevBoldEnd = arr[idx - 1]?.end ?? 0
        const prevText = lineText.slice(prevBoldEnd, start)
        const boldText = bold.slice(2, bold.length - 2)
        const boldComponent = (
          <Box component="strong" key={idx}>
            {boldText}
          </Box>
        )
        return [
          ...acc,
          <>
            {prevText}
            {boldComponent}
            {idx === arr.length - 1 ? lineText.slice(end) : ''}
          </>,
        ]
      }, [])
}

export const parseSimpleFormating = (text: string) => {
  return text.split('\n').map((txt, tIdx, arr) => (
    <Fragment key={tIdx}>
      {txt?.trim().startsWith('•') ? (
        <Box
          component="li"
          sx={{
            ml: 2,
            mt: arr[tIdx - 1]?.trim().startsWith('•') ? 0 : 1,
            mb: arr[tIdx + 1]?.trim().startsWith('•') ? 0 : 1,
            '&::marker': { pl: 2 },
          }}
        >
          {inlineFormat(txt.trim().slice(1)) as any}
        </Box>
      ) : (
        <>
          {inlineFormat(txt)} <br />
        </>
      )}
    </Fragment>
  ))
}
