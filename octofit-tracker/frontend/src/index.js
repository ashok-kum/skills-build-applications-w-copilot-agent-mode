import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

// Set API base using codespace name env var or fall back to localhost
window.REACT_APP_API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

console.log('API base:', window.REACT_APP_API_BASE)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
