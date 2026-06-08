import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function InventoryPage(){
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  async function lookup(e){
    e && e.preventDefault();
    const res = await apiFetch('/inventory/barcodes/scan', { method: 'POST', body: JSON.stringify({ code }) });
    setResult(res);
  }

  return (
    <div style={{padding:20}}>
      <h1>Inventory Lookup</h1>
      <script dangerouslySetInnerHTML={{__html: "if(!localStorage.getItem('erp_token')){window.location.href='/login';}"}} />
      <form onSubmit={lookup}>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Barcode" />
        <button type="submit">Lookup</button>
      </form>
      {result && (
        <div style={{marginTop:16}}>
          <h3>{result.sku?.name || 'Unknown SKU'}</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
