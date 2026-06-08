import { useState } from 'react';
import { apiFetch, setToken } from '../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@local');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL)||'http://localhost:3000/api'}/auth/login`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data && data.access_token) {
      setToken(data.access_token);
      window.location.href = '/admin/roles';
    } else {
      setErr(data.error || 'Login failed');
    }
  }

  return (
    <div style={{padding:20}}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /></div>
        <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" /></div>
        <div><button type="submit">Login</button></div>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  );
}
