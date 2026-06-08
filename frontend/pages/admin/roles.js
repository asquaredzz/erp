import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  useEffect(()=>{
    if (!localStorage.getItem('erp_token')) window.location.href = '/login';
  },[]);

  useEffect(() => { fetchRoles(); }, []);

  async function fetchRoles() {
    const data = await apiFetch('/admin/roles');
    setRoles(data || []);
  }

  async function createRole(e) {
    e.preventDefault();
    await apiFetch('/admin/roles', { method: 'POST', body: JSON.stringify({ name }) });
    setName('');
    fetchRoles();
  }

  return (
    <div style={{padding:20}}>
      <h1>Roles</h1>
      <form onSubmit={createRole}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Role name" />
        <button type="submit">Create</button>
      </form>
      <ul>
        {roles.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  );
}
