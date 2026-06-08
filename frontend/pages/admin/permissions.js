import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function PermissionsPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(()=>{
    if (!localStorage.getItem('erp_token')) window.location.href = '/login';
  },[]);

  useEffect(() => { fetchPerms(); }, []);

  async function fetchPerms() {
    const data = await apiFetch('/admin/permissions');
    setItems(data || []);
  }

  async function createPerm(e) {
    e.preventDefault();
    await apiFetch('/admin/permissions', { method: 'POST', body: JSON.stringify({ name }) });
    setName('');
    fetchPerms();
  }

  return (
    <div style={{padding:20}}>
      <h1>Permissions</h1>
      <form onSubmit={createPerm}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Permission name" />
        <button type="submit">Create</button>
      </form>
      <ul>
        {items.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
