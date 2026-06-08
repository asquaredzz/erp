import { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function PosPage() {
  const [code, setCode] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(()=>{
    if (!localStorage.getItem('erp_token')) window.location.href = '/login';
  },[]);

  async function scan() {
    const res = await apiFetch('/inventory/barcodes/scan', { method: 'POST', body: JSON.stringify({ code }) });
    if (res && res.sku) {
      setCart(c => [...c, { sku: res.sku, qty:1 }]);
      setCode('');
    } else {
      alert('SKU not found');
    }
  }

  async function checkout(){
    if (cart.length === 0) return alert('Cart empty');
    const items = cart.map(c=>({ sku_id: c.sku.id, quantity: c.qty, unit_price: c.sku.selling_price || 0 }));
    const order = { customer_id: null, channel: 'POS', total_amount: items.reduce((s,i)=>s + (Number(i.unit_price||0)*Number(i.quantity)),0) };
    try{
      const res = await apiFetch('/orders', { method: 'POST', body: JSON.stringify({ order, items }) });
      alert('Order created: ' + (res.id || JSON.stringify(res)));
      setCart([]);
    } catch (err) { alert('Checkout failed'); }
  }

  return (
    <div style={{padding:20}}>
      <h1>POS</h1>
      <div>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Scan barcode" />
        <button onClick={scan}>Add</button>
      </div>
      <ul>
        {cart.map((c,i)=> <li key={i}>{c.sku?.name || 'Unknown'} x {c.qty}</li>)}
      </ul>
      <div style={{marginTop:12}}><button onClick={checkout}>Checkout</button></div>
    </div>
  );
}
