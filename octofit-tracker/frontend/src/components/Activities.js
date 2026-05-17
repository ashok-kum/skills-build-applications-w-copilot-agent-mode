import React, { useEffect, useState } from 'react'
import getApiBase from '../apiBase'

export default function Activities() {
  const [items, setItems] = useState([])
  const endpoint = 'activities'
  // API endpoint: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/activities/

  useEffect(() => {
    let mounted = true
    async function load() {
      const codespace = process.env.REACT_APP_CODESPACE_NAME || window.REACT_APP_CODESPACE_NAME
      const API_BASE = codespace ? `https://${codespace}-8000.app.github.dev/api` : await getApiBase()
      const url = `${API_BASE}/${endpoint}/`
      console.log('Fetching Activities from', url)
      try {
        const res = await fetch(url)
        const data = await res.json()
        console.log('Activities raw response:', data)
        const normalized = data && data.results ? data.results : data
        console.log('Activities normalized:', normalized)
        if (mounted) setItems(Array.isArray(normalized) ? normalized : [])
      } catch (err) {
        console.error('Activities fetch error:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [endpoint])

  const [selected, setSelected] = useState(null)

  const columns = items.length ? Object.keys(items[0]) : []

  return (
    <div className="container mt-4">
      <h2 className="h4">Activities</h2>
      <div className="card">
        <div className="card-body">
          <div className="mb-2">
            <button className="btn btn-primary me-2" onClick={() => {
              console.log('Refreshing Activities from', url)
              fetch(url).then(r => r.json()).then(d => setItems(d.results ? d.results : d)).catch(e=>console.error(e))
            }}>Refresh</button>
          </div>
          {items.length ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map(col => <th key={col}>{col}</th>)}
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id || idx} onClick={() => setSelected(it)} style={{cursor: 'pointer'}}>
                    <td>{idx + 1}</td>
                    {columns.map(c => <td key={c}>{typeof it[c] === 'object' ? JSON.stringify(it[c]) : String(it[c])}</td>)}
                    <td><button className="btn btn-link">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No activities found.</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(selected, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
