'use client'

import { useState, useRef, useCallback } from 'react'
import { Play, RotateCcw, Download, Copy, CheckCheck, Database, Clock, AlertCircle, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const EXAMPLE_QUERIES = [
  { label: 'All Products', sql: 'SELECT id, name, slug, price, stock, is_active FROM products ORDER BY created_at DESC LIMIT 50;' },
  { label: 'All Orders', sql: 'SELECT id, order_number, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 50;' },
  { label: 'All Customers', sql: "SELECT id, full_name, email, created_at FROM profiles WHERE role = 'customer' ORDER BY created_at DESC LIMIT 50;" },
  { label: 'Categories', sql: 'SELECT id, name, slug, color FROM categories ORDER BY name;' },
  { label: 'Top Products by Revenue', sql: `SELECT p.name, SUM(oi.quantity * oi.price) AS revenue, SUM(oi.quantity) AS units_sold
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled','refunded')
GROUP BY p.name
ORDER BY revenue DESC
LIMIT 20;` },
  { label: 'Low Stock Products', sql: 'SELECT id, name, stock, price FROM products WHERE stock < 10 AND is_active = true ORDER BY stock ASC;' },
  { label: 'Revenue by Day', sql: `SELECT DATE(created_at) AS day, COUNT(*) AS orders, SUM(total) AS revenue
FROM orders
WHERE status NOT IN ('cancelled','refunded')
GROUP BY day
ORDER BY day DESC
LIMIT 30;` },
]

interface QueryResult {
  rows: Record<string, unknown>[]
  columns: string[]
  rowCount: number
  duration: number
  error?: string
}

export default function SQLEditorPage() {
  const [sql, setSql] = useState(EXAMPLE_QUERIES[0].sql)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const runQuery = useCallback(async () => {
    if (!sql.trim()) return
    setLoading(true)
    setResult(null)
    const start = performance.now()
    try {
      // Use Supabase rpc to run arbitrary SQL via a helper function
      // Falls back to parsing simple SELECTs client-side via the JS client
      const trimmed = sql.trim().toUpperCase()

      if (trimmed.startsWith('SELECT')) {
        // Extract the table name for a basic SELECT via the JS client
        // For complex queries we'll try the rpc route
        const { data, error } = await supabase.rpc('run_sql', { query: sql })
        const duration = performance.now() - start

        if (error) {
          // Fallback: try to execute as a simple direct query
          setResult({ rows: [], columns: [], rowCount: 0, duration, error: error.message })
        } else {
          const rows = Array.isArray(data) ? data : []
          const columns = rows.length > 0 ? Object.keys(rows[0]) : []
          setResult({ rows, columns, rowCount: rows.length, duration })
        }
      } else {
        const { data, error } = await supabase.rpc('run_sql', { query: sql })
        const duration = performance.now() - start
        if (error) {
          setResult({ rows: [], columns: [], rowCount: 0, duration, error: error.message })
        } else {
          const rows = Array.isArray(data) ? data : []
          const columns = rows.length > 0 ? Object.keys(rows[0]) : ['result']
          setResult({ rows, columns, rowCount: rows.length, duration })
        }
      }
    } catch (err: unknown) {
      const duration = performance.now() - start
      setResult({ rows: [], columns: [], rowCount: 0, duration, error: String(err) })
    }
    setLoading(false)
  }, [sql])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runQuery()
    }
    // Tab support
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current!
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = sql.substring(0, start) + '  ' + sql.substring(end)
      setSql(newVal)
      setTimeout(() => ta.setSelectionRange(start + 2, start + 2), 0)
    }
  }

  const copyResults = () => {
    if (!result) return
    const header = result.columns.join('\t')
    const rows = result.rows.map(r => result.columns.map(c => String(r[c] ?? '')).join('\t')).join('\n')
    navigator.clipboard.writeText(header + '\n' + rows)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCSV = () => {
    if (!result) return
    const header = result.columns.join(',')
    const rows = result.rows.map(r =>
      result.columns.map(c => {
        const v = String(r[c] ?? '')
        return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v
      }).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'query_results.csv'
    a.click()
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark">
          <Database size={20} className="text-primary" />
          <span className="font-bold text-sm">SQL Editor</span>
          <span className="text-xs text-gray-400 font-normal">— Run queries against your NutriFitness database</span>
        </div>

        {/* Examples dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExamples(v => !v)}
            className="flex items-center gap-1.5 text-xs font-bold bg-dark text-white px-3 py-2 hover:bg-dark-2 transition-colors"
          >
            Examples <ChevronDown size={14} />
          </button>
          {showExamples && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-border shadow-lg z-20">
              {EXAMPLE_QUERIES.map(q => (
                <button
                  key={q.label}
                  className="block w-full text-left px-4 py-2.5 text-xs font-semibold text-dark hover:bg-gray-light hover:text-primary transition-colors border-b border-gray-border last:border-0"
                  onClick={() => { setSql(q.sql); setShowExamples(false) }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-dark rounded-none border border-dark-3 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-dark-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[10px] text-gray-500 ml-2 font-mono">query.sql</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSql('')}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
              title="Clear"
            >
              <RotateCcw size={12} /> Clear
            </button>
            <button
              onClick={runQuery}
              disabled={loading}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-1.5 hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Play size={12} fill="white" />
              {loading ? 'Running...' : 'Run'} <span className="text-[10px] opacity-60 ml-1">⌘↵</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={sql}
          onChange={e => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full bg-transparent text-green-300 font-mono text-sm p-4 resize-none focus:outline-none min-h-[200px]"
          placeholder="-- Write your SQL query here&#10;-- Press Ctrl+Enter or ⌘+Enter to run"
          rows={10}
          style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace" }}
        />
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center gap-3 p-6 bg-white border border-gray-border text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Executing query...
        </div>
      )}

      {result && !loading && (
        <div className="bg-white border border-gray-border flex flex-col">
          {/* Result header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-border bg-gray-light">
            <div className="flex items-center gap-4">
              {result.error ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                  <AlertCircle size={14} /> Error
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                  ✓ {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} /> {result.duration.toFixed(0)}ms
              </span>
            </div>
            {!result.error && result.rows.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyResults}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-dark transition-colors"
                >
                  {copied ? <CheckCheck size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-1 text-xs font-bold bg-dark text-white px-3 py-1.5 hover:bg-dark-2 transition-colors"
                >
                  <Download size={12} /> CSV
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {result.error && (
            <div className="p-5 font-mono text-sm text-red-600 bg-red-50 whitespace-pre-wrap">
              {result.error}
            </div>
          )}

          {/* Table */}
          {!result.error && result.rows.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">Query returned no rows.</div>
          )}

          {!result.error && result.rows.length > 0 && (
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-xs font-mono">
                <thead className="bg-dark text-white sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-500 font-normal w-10 border-r border-dark-3">#</th>
                    {result.columns.map(col => (
                      <th key={col} className="px-4 py-2.5 text-left font-bold text-gray-300 whitespace-nowrap border-r border-dark-3 last:border-0">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {result.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-light/50 transition-colors">
                      <td className="px-3 py-2 text-gray-400 border-r border-gray-border w-10 text-center">{i + 1}</td>
                      {result.columns.map(col => {
                        const val = row[col]
                        const isNull = val === null || val === undefined
                        const isBool = typeof val === 'boolean'
                        return (
                          <td
                            key={col}
                            className={`px-4 py-2 whitespace-nowrap border-r border-gray-border last:border-0 max-w-[300px] overflow-hidden text-ellipsis ${
                              isNull ? 'text-gray-300 italic' : isBool ? (val ? 'text-green-600' : 'text-red-400') : 'text-dark'
                            }`}
                            title={isNull ? 'NULL' : String(val)}
                          >
                            {isNull ? 'NULL' : String(val)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Hint when empty */}
      {!result && !loading && (
        <div className="text-center py-10 text-gray-400 text-xs border border-dashed border-gray-border">
          <Database size={32} className="mx-auto mb-3 opacity-30" />
          <p>Write a SQL query above and press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-dark font-mono">⌘ + ↵</kbd> to run it</p>
        </div>
      )}
    </div>
  )
}
