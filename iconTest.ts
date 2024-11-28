import * as Icons from '@mdi/js'
import fs from 'fs'
import path from 'path'

const iconNames = Object.keys(Icons)
const iconsDict = iconNames.reduce((acc, iconName) => {
  acc[iconName] = Icons[iconName]
  return acc
}, {})

const writeToJsonFile = (iconsDict: Record<string, string>) => {
  const filePath = path.join(__dirname, '_icons.json')
  const content = JSON.stringify(iconsDict, null, 2)
  fs.writeFileSync(filePath, content)
}
writeToJsonFile(iconsDict)
