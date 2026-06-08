import Link from 'next/link';
import { isAuthenticated, logout } from '../lib/auth';

export default function Header() {
  const authed = typeof window !== 'undefined' && isAuthenticated();
  return (
    <div style={{background:'#f2f2f2', padding:10, marginBottom:10}}>
      <Link href="/">Home</Link> |{' '}
      <Link href="/admin/roles">Roles</Link> |{' '}
      <Link href="/admin/permissions">Permissions</Link> |{' '}
      <Link href="/admin/assistant">Assistant</Link> |{' '}
      <Link href="/inventory">Inventory</Link> |{' '}
      <Link href="/pos">POS</Link>
      <span style={{float:'right'}}>
        {authed ? <button onClick={logout}>Logout</button> : <Link href="/login">Login</Link>}
      </span>
    </div>
  );
}
