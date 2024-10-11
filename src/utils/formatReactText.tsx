import Icon from '@mdi/react'
import { Box } from '@mui/material'
import { Fragment } from 'react/jsx-runtime'

const parseLink = (lineText: string, icons?: Record<string, string>) => {
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
          {parseIcon(prevText, icons)}
          <a
            href={match.replace('(', '').replace(')', '')}
            target="_blank"
            rel="noreferrer"
          >
            {match}
          </a>
          {parseIcon(nextText, icons)}
        </Fragment>
      )
    }) ?? parseIcon(lineText, icons)
  )
}

const parseIcon = (lineText: string, icons?: Record<string, string>) => {
  if (!icons) return lineText
  const regex = /\{mdi[A-z]+\}/g
  const matches = lineText.match(regex)
  // console.log(' Icon matches: ', matches)
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
          <Icon path={icons[matchAdj]} size={0.8} />
          {/* {match} */}

          {nextText}
        </Fragment>
      )
    }) ?? lineText
  )
}

const inlineFormat = (lineText: string, icons?: Record<string, string>) => {
  const boldMarkDown = /\*\*(.*?)\*\*/g
  // const boldMarkdownWithUnderScore = /__(.*?)__/g;
  const boldMarkDownMatches = lineText.match(boldMarkDown)
  const boldMatches = boldMarkDownMatches?.map((match) => ({
    match,
    start: lineText.indexOf(match),
    end: lineText.indexOf(match) + match.length,
  }))

  return !boldMarkDownMatches || !boldMatches?.length
    ? parseLink(lineText, icons)
    : boldMatches.reduce<any[]>((acc, match, idx, arr) => {
        const { match: bold, start, end } = match
        const prevBoldEnd = arr[idx - 1]?.end ?? 0
        const prevText = lineText.slice(prevBoldEnd, start)
        const boldText = bold.slice(2, bold.length - 2)
        const boldComponent = (
          <Box component="strong" key={idx}>
            {parseLink(boldText, icons)}
          </Box>
        )
        return [
          ...acc,
          <Fragment key={idx}>
            {prevText}
            {boldComponent}
            {idx === arr.length - 1 ? lineText.slice(end) : ''}
          </Fragment>,
        ]
      }, [])
}

export const parseSimpleFormating = (
  text: string,
  icons?: Record<string, string>
) => {
  // console.log('Text: ', text)
  return text.split('\n').map((txt, tIdx, arr) => {
    const isListItem =
      txt?.trim().startsWith('•') || txt?.trim().startsWith('-')
    const isSubListItem =
      txt?.trim().startsWith('••') || txt?.trim().startsWith('--')
    return (
      <Fragment key={tIdx}>
        {isListItem ? (
          <Box
            key={'li_' + tIdx}
            component="li"
            sx={{
              ml: 2,
              mt: arr[tIdx - 1]?.trim().startsWith('•') ? 0 : 1,
              mb: arr[tIdx + 1]?.trim().startsWith('•') ? 0 : 1,
              '&::marker': { pl: isSubListItem ? 4 : 2 },
            }}
            color={txt?.startsWith('  •') ? 'primary.main' : 'text.primary'}
          >
            {inlineFormat(txt.trim().slice(1), icons) as any}
          </Box>
        ) : (
          <>
            {inlineFormat(txt, icons)} <br />
          </>
        )}
      </Fragment>
    )
  })
}
