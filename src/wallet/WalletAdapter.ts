import { fmt } from "../helpers";

export const WalletAdapter = {
  detect() {
    return { kasware: typeof window !== "undefined" && !!(window as any).kasware, kaspium: false };
  },
  async connectKasware() {
    const w = (window as any).kasware;
    if(!w) throw new Error("Kasware extension not detected. Install from kasware.org");
    const accounts = await w.requestAccounts();
    if(!accounts?.length) throw new Error("No accounts returned from Kasware");
    const network = await w.getNetwork();
    return { address: accounts[0], network, provider: "kasware" };
  },
  async getKaswareBalance() {
    const w = (window as any).kasware;
    if(!w) throw new Error("Kasware not connected");
    const b = await w.getBalance();
    return fmt((b.total || 0) / 1e8, 4);
  },
  async sendKasware(toAddress: string, amountKas: number) {
    const w = (window as any).kasware;
    if(!w) throw new Error("Kasware not connected");
    const sompi = Math.floor(amountKas * 1e8);
    const txid = await w.sendKaspa(toAddress, sompi);
    return txid;
  },
  async signMessageKasware(message: string) {
    const w = (window as any).kasware;
    if(!w) throw new Error("Kasware not connected");
    return w.signMessage(message);
  }
};
