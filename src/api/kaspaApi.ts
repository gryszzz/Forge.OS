import { KAS_API } from "../constants";
import { fmt } from "../helpers";

export async function kasPrice() {
  const r = await fetch(`${KAS_API}/info/price`);
  if(!r.ok) throw new Error(`price ${r.status}`);
  const j = await r.json();
  return parseFloat(j.price || 0);
}

export async function kasBalance(addr: string) {
  const r = await fetch(`${KAS_API}/addresses/${addr}/balance`);
  if(!r.ok) throw new Error(`bal ${r.status}`);
  const j = await r.json();
  return { kas: fmt((j.balance || 0) / 1e8, 4), raw: j.balance || 0 };
}

export async function kasUtxos(addr: string) {
  const r = await fetch(`${KAS_API}/addresses/${addr}/utxos`);
  if(!r.ok) throw new Error(`utxo ${r.status}`);
  return r.json();
}

export async function kasNetworkInfo() {
  const r = await fetch(`${KAS_API}/info/blockdag`);
  if(!r.ok) throw new Error(`dag ${r.status}`);
  return r.json();
}
