// Resolve API base at runtime by trying several likely candidates.
const TIMEOUT = 3000

function timeoutFetch(url, opts = {}, ms = TIMEOUT) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  return fetch(url, {...opts, signal: controller.signal}).finally(() => clearTimeout(id))
}

export async function getApiBase() {
  if (window.__API_BASE__) return window.__API_BASE__

  const candidates = []

  // 1) Explicit codespace env compiled into the bundle (if set at build time)
  if (process.env.REACT_APP_CODESPACE_NAME) {
    candidates.push(`https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`)
  }

  // 2) If runtime global was set (older code)
  if (window.REACT_APP_API_BASE) candidates.push(window.REACT_APP_API_BASE)

  // 3) Try same host on port 8000 using current protocol
  try {
    const proto = window.location.protocol.replace(':','') || 'http'
    candidates.push(`${window.location.protocol}//${window.location.hostname}:8000/api`)
  } catch (e) {}

  // 4) Relative API path (proxy or same origin)
  candidates.push('/api')

  // 5) Localhost fallback
  candidates.push('http://localhost:8000/api')

  console.log('API base candidates:', candidates)

  for (const base of candidates) {
    const url = base.replace(/\/+$/,'') + '/'
    try {
      const res = await timeoutFetch(url, {method: 'GET', mode: 'cors'})
      if (res && (res.ok || res.status === 200)) {
        window.__API_BASE__ = base.replace(/\/+$/,'')
        console.log('Selected API base:', window.__API_BASE__)
        return window.__API_BASE__
      }
    } catch (err) {
      console.log('Candidate failed:', base, err && err.name)
    }
  }

  // As a last resort, choose the first candidate
  window.__API_BASE__ = candidates[0]
  console.warn('Falling back to API base:', window.__API_BASE__)
  return window.__API_BASE__
}

export default getApiBase
