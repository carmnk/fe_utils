import Icon from '@mdi/react'
import { Box } from '@mui/material'
import { Fragment } from 'react/jsx-runtime'

const parseLink = (lineText: string) => {
  const regex = /(https?:\/\/[^\s]+)/g
  const matches = lineText.match(regex)
  return (
    matches?.map((match, idx) => {
      const start = lineText.indexOf(match)
      const end = start + match.length
      const prevText = lineText.slice(0, start)
      const nextText = lineText.slice(end)
      return (
        <Fragment key={idx}>
          {parseIcon(prevText)}
          <a
            href={match.replace('(', '').replace(')', '')}
            target="_blank"
            rel="noreferrer"
          >
            {match}
          </a>
          {parseIcon(nextText)}
        </Fragment>
      )
    }) ?? parseIcon(lineText)
  )
}

const parseIcon = (lineText: string) => {
  const regex = /\{mdi[A-z]+\}/g
  const matches = lineText.match(regex)
  console.log(' Icon matches: ', matches)
  return (
    matches?.map((match, idx) => {
      const start = lineText.indexOf(match)
      const end = start + match.length
      const prevText = lineText.slice(0, start)
      const nextText = lineText.slice(end)
      const matchAdj = match.replaceAll('{', '').replaceAll('}', '')
      return (
        <Fragment key={idx}>
          {prevText}
          <Icon path={matchAdj} size={0.8} />
          {/* {match} */}

          {nextText}
        </Fragment>
      )
    }) ?? lineText
  )
}

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
    ? parseLink(lineText)
    : boldMatches.reduce<any[]>((acc, match, idx, arr) => {
        const { match: bold, start, end } = match
        const prevBoldEnd = arr[idx - 1]?.end ?? 0
        const prevText = lineText.slice(prevBoldEnd, start)
        const boldText = bold.slice(2, bold.length - 2)
        const boldComponent = (
          <Box component="strong" key={idx}>
            {parseLink(boldText)}
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
