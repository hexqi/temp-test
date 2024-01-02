import { constants } from '@opentiny/tiny-engine-utils'
import { isDevelopEnv } from './environments'
import { useResource } from '@opentiny/tiny-engine-controller'
// prefer old unicode hacks for backward compatibility

const { COMPONENT_NAME } = constants

export const utoa = (string) => btoa(unescape(encodeURIComponent(string)))

export const atou = (base64) => decodeURIComponent(escape(atob(base64)))

const open = (params = {}) => {
  const paramsMap = new URLSearchParams(location.search)
  params.app = paramsMap.get('id')
  params.tenant = paramsMap.get('tenant')
  const { scripts, styles } = useResource().resState.thirdPartyDeps
  params.scripts = scripts
    .filter((item) => item.script)
    .reduce((pre, cur) => ({ ...pre, [cur.package]: cur.script }), {})
  params.styles = [...styles]

  const href = window.location.href.split('?')[0] || './'
  const tenant = new URLSearchParams(location.search).get('tenant') || ''
  let openUrl = ''
  const hashString = utoa(JSON.stringify(params))

  openUrl = isDevelopEnv
    ? `./preview.html?tenant=${tenant}#${hashString}`
    : `${href}/preview?tenant=${tenant}#${hashString}`

  const aTag = document.createElement('a')
  aTag.href = openUrl
  aTag.target = '_blank'
  aTag.click()
}

export const previewPage = (params = {}) => {
  params.type = COMPONENT_NAME.Page
  open(params)
}

export const previewBlock = (params = {}) => {
  params.type = COMPONENT_NAME.Block
  open(params)
}
