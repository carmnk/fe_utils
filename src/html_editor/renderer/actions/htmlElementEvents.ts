// global Events
// const windowEvents = [
//   'onafterprint',
//   'onbeforeprint',
//   'onbeforeunload',
//   'onerror',
//   'onhashchange',
//   'onload',
//   'onmessage',
//   'onoffline',
//   'ononline',
//   'onpagehide',
//   'onpageshow',
//   'onpopstate',
//   'onresize',
//   'onstorage',
//   'onunload',
// ]
const reactEvents = ['onMounted', 'onUnmounted']
// const clipboardEvents = ['oncopy', 'oncut', 'onpaste']

// form Events
const formEvents = [
  'onBlur',
  'onChange',
  'onContextmenu',
  'onFocus',
  'onInput',
  'onInvalid',
  'onReset',
  'onSearch',
  'onSelect',
  'onSubmit',
]

const keyboardEvents = ['onKeyDown', 'onKeyPress', 'onKeyUp']
const mouseEvents = [
  'onClick',
  'onDoubleClick',
  'onMouseDown',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onMouseWheel',
  'onWheel',
]
const dragEvents = [
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onScroll',
]
const mediaEvents = [
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onCueChange',
  'onDurationChange',
  'onEmptied',
  'onEnded',
  'onError',
  'onLoadedData',
//   'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',
]

// const otherEvents = [
//   // 'onshow',
//   'ontoggle',
//   // 'onanimationend',
//   // 'onanimationiteration',
//   // 'onanimationstart',
//   // 'ontransitionend',
// ]

export const htmlEventCategories = [
  { name: 'React Events', eventNames: reactEvents },
  { name: 'Mouse Events', eventNames: mouseEvents },
  { name: 'Drag Events', eventNames: dragEvents },
  { name: 'Form Events', eventNames: formEvents },
  { name: 'Keyboard Events', eventNames: keyboardEvents },

  { name: 'Media Events', eventNames: mediaEvents },
]
