import { useState } from 'react';
import { apiFetch, setToken } from '../lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL)||'http://localhost:3000/api'}/auth/register`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password, displayName })
    });
    const data = await res.json();
    if (data && data.id) {
      // auto-login
      const loginRes = await fetch(`${(process.env.NEXT_PUBLIC_API_URL)||'http://localhost:3000/api'}/auth/login`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (loginData && loginData.access_token) {
        setToken(loginData.access_token);
        window.location.href = '/admin/roles';
        return;
      }
    }
    setErr(data.error || 'Registration failed');
  }

  return (
    <div style={{padding:20}}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <div><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Display name" /></div>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /></div>
        <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" /></div>
        <div><button type="submit">Register</button></div>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  );
}
