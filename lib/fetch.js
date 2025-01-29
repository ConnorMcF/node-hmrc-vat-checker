import pkg from '../package.json' with { type: 'json' }

const userAgent = `npm:hmrc-vat-checker/${pkg.version}`

const doFetch = (url, req = {}) => {
  if(!req.headers) {
    req.headers = {}
  }

  if(!req.headers['User-Agent']) {
    req.headers['User-Agent'] = userAgent
  }

  return fetch(url, req)
}

export default doFetch