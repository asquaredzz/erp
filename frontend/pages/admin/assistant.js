import { useState } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../../lib/auth';
import { apiFetch } from '../../lib/api';

export default function Assistant() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.2);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    const [history, setHistory] = useState([]);

    async function loadHistory() {
      try {
        const data = await apiFetch('/assistant/history');
        setHistory(data || []);
      } catch (e) {
        // ignore
      }
    }

  if (!getToken()) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  async function send() {
    setLoading(true);
    try {
      const data = await apiFetch('/assistant/query', { method: 'POST', body: JSON.stringify({ prompt, model, temperature }) });
      setReply(data.reply || JSON.stringify(data));
      await loadHistory();
    } catch (err) {
      setReply('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (typeof window !== 'undefined') {
    // load history on first render
    if (!history || history.length === 0) loadHistory();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Assistant</h1>
      <div>
        <label>Model: </label>
        <input value={model} onChange={(e) => setModel(e.target.value)} />
        <label style={{ marginLeft: 8 }}>Temperature: </label>
        <input type="number" step="0.1" min="0" max="1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
      </div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} cols={80} />
      <div>
        <button onClick={send} disabled={loading || !prompt}>Send</button>
      </div>
      <h2>Reply</h2>
      <pre>{reply}</pre>

      <h2>History</h2>
      <div style={{ maxHeight: 300, overflow: 'auto', border: '1px solid #ddd', padding: 8 }}>
        {history.map((h, idx) => (
          <div key={h.id || idx} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{new Date(h.created_at).toLocaleString()} — {h.model || 'n/a'} t={h.temperature}</div>
            <div><strong>Q:</strong> {h.prompt}</div>
            <div><strong>A:</strong> {h.reply}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
