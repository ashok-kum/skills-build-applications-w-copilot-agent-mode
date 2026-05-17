import React, { useEffect, useState } from 'react'

export default function Teams() {
  const [items, setItems] = useState([])
  const endpoint = 'teams'
  const API_BASE = window.REACT_APP_API_BASE || 'http://localhost:8000/api'
  const url = `${API_BASE}/${endpoint}/`

  useEffect(() => {
    console.log('Fetching Teams from', url)
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Teams raw response:', data)
        const normalized = data && data.results ? data.results : data
        console.log('Teams normalized:', normalized)
        setItems(Array.isArray(normalized) ? normalized : [])
      })
      .catch(err => console.error('Teams fetch error:', err))
  }, [url])

  const [selected, setSelected] = useState(null)
  const columns = items.length ? Object.keys(items[0]) : []

  return (
    <div className="container mt-4">
      <h2 className="h4">Teams</h2>
      <div className="card">
        <div className="card-body">
          <div className="mb-2">
            <button className="btn btn-primary" onClick={() => fetch(url).then(r=>r.json()).then(d=>setItems(d.results?d.results:d)).catch(e=>console.error(e))}>Refresh</button>
          </div>
          {items.length ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map(c => <th key={c}>{c}</th>)}
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
            <div>No teams found.</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body"><pre>{JSON.stringify(selected, null, 2)}</pre></div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
