/**
 * Monadian EIP-7702 Ephemeral Session Key & Viem Client Engine
 * Menyediakan interaksi tanpa popup MetaMask selama ronde 60 detik.
 */

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
  Address,
  Hex,
} from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { monadTestnet, CONTRACT_ADDRESSES } from '../abi/config';
import MonadianGameArtifact from '../abi/MonadianGame.json';

const SESSION_KEY_STORAGE = 'monadian_ephemeral_session_key';

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

export interface SessionKeyState {
  address: Address;
  privateKey: Hex;
  isRegistered: boolean;
}

// Fallback in-memory cache jika localStorage diblokir di Safari iOS / in-app browser
let memoryKeyFallback: Hex | null = null;

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn('localStorage not accessible, using in-memory fallback:', e);
  }
  return memoryKeyFallback;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    console.warn('localStorage setItem blocked, saving to memory:', e);
  }
  memoryKeyFallback = value as Hex;
}

export class SessionKeyManager {
  private sessionAccount: ReturnType<typeof privateKeyToAccount> | null = null;
  private userAddress: Address | null = null;

  constructor() {
    try {
      this.loadOrCreateSessionKey();
    } catch (e) {
      console.warn('SessionKeyManager startup fallback:', e);
    }
  }

  /**
   * Load atau generate ephemeral private key dari Safe Storage
   */
  public loadOrCreateSessionKey(): SessionKeyState {
    let storedKey = safeGetItem(SESSION_KEY_STORAGE) as Hex | null;
    if (!storedKey || !storedKey.startsWith('0x')) {
      storedKey = generatePrivateKey();
      safeSetItem(SESSION_KEY_STORAGE, storedKey);
    }

    this.sessionAccount = privateKeyToAccount(storedKey);
    return {
      address: this.sessionAccount.address,
      privateKey: storedKey,
      isRegistered: false,
    };
  }

  public getSessionAddress(): Address | null {
    return this.sessionAccount ? this.sessionAccount.address : null;
  }

  public getUserAddress(): Address | null {
    if (!this.userAddress) {
      const stored = safeGetItem('monadian_user_address');
      if (stored && stored.startsWith('0x')) {
        this.userAddress = stored as Address;
      }
    }
    return this.userAddress;
  }

  public disconnect(): void {
    this.userAddress = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('monadian_user_address');
      }
    } catch {}
  }

  /**
   * Koneksi Web3 Wallet (MetaMask, Rabby, dll.) dengan optimasi Mobile & Timeout
   */
  public async connectWallet(): Promise<Address> {
    if (typeof window === 'undefined' || !(window as unknown as { ethereum?: unknown }).ethereum) {
      throw new Error('Web3 Wallet tidak terdeteksi. Silakan buka di browser MetaMask Mobile.');
    }

    const ethereum = (window as unknown as { ethereum: any }).ethereum;

    // 1. Dapatkan alamat akun secara langsung dengan timeout 8 detik (anti-hang di mobile)
    let accounts: string[] = [];
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Waktu koneksi habis. Buka pop-up MetaMask untuk menyetujui.')), 8000)
      );

      const reqPromise = ethereum.request({ method: 'eth_requestAccounts' });
      accounts = (await Promise.race([reqPromise, timeoutPromise])) as string[];
    } catch (err: any) {
      // Coba fallback cek eth_accounts jika sudah pernah diapprove
      const existing = (await ethereum.request({ method: 'eth_accounts' }).catch(() => [])) as string[];
      if (existing && existing.length > 0) {
        accounts = existing;
      } else {
        throw err;
      }
    }

    if (!accounts || accounts.length === 0) {
      throw new Error('Tidak ada akun MetaMask yang dipilih.');
    }

    const account = accounts[0] as Address;
    this.userAddress = account;
    safeSetItem('monadian_user_address', account);

    // 2. Non-blocking: Cek & switch chain di latar belakang (tidak membekukan tombol UI)
    setTimeout(() => {
      this.switchOrAddMonadChain().catch((e) => {
        console.info('Switch Monad chain info:', e.message || e);
      });
    }, 300);

    return account;
  }

  /**
   * Beralih atau otomatis menambahkan Monad Testnet (Chain ID 10143) ke MetaMask / Web3 Wallet
   */
  public async switchOrAddMonadChain(): Promise<boolean> {
    if (typeof window === 'undefined' || !(window as unknown as { ethereum?: unknown }).ethereum) {
      return false;
    }

    const ethereum = (window as unknown as { ethereum: any }).ethereum;

    try {
      // 1. Cek chain ID saat ini
      const currentChainHex = await ethereum.request?.({ method: 'eth_chainId' }).catch(() => null);
      if (currentChainHex && parseInt(currentChainHex, 16) === monadTestnet.id) {
        return true; // Sudah di Monad Testnet
      }

      // 2. Coba minta beralih jaringan (wallet_switchEthereumChain)
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${monadTestnet.id.toString(16)}` }], // '0x279f'
        });
        return true;
      } catch (switchError: any) {
        // Error code 4902 berarti network belum ada di wallet -> panggil wallet_addEthereumChain
        const isUnrecognized =
          switchError?.code === 4902 ||
          switchError?.data?.originalError?.code === 4902 ||
          switchError?.cause?.code === 4902 ||
          switchError?.message?.includes('4902') ||
          switchError?.message?.toLowerCase().includes('unrecognized') ||
          switchError?.message?.toLowerCase().includes('wallet_addethereumchain');

        if (isUnrecognized) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${monadTestnet.id.toString(16)}`,
                chainName: 'Monad Testnet',
                nativeCurrency: {
                  name: 'Monad',
                  symbol: 'MON',
                  decimals: 18,
                },
                rpcUrls: ['https://testnet-rpc.monad.xyz'],
                blockExplorerUrls: ['https://testnet.monadexplorer.com'],
              },
            ],
          });
          return true;
        } else {
          throw switchError;
        }
      }
    } catch (err: any) {
      console.warn('Gagal switch atau auto-add Monad Testnet:', err);
      throw err;
    }
  }

  /**
   * Mengirim transaksi Join Round dengan Entry Fee 0.1 MON
   */
  public async joinRound(roundId: bigint, entryFeeMon: string = '0.1'): Promise<Hex> {
    if (!this.userAddress) {
      await this.connectWallet();
    }
    const ethereum = (window as unknown as { ethereum: any }).ethereum;
    const walletClient = createWalletClient({
      account: this.userAddress!,
      chain: monadTestnet,
      transport: custom(ethereum),
    });

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESSES.game as Address,
      abi: MonadianGameArtifact.abi,
      functionName: 'joinRound',
      args: [roundId],
      value: parseEther(entryFeeMon),
    });

    return hash;
  }

  /**
   * Mengeksekusi penempatan balok on-chain via Session Key (0 MetaMask popup)
   */
  public async makeMove(
    roundId: bigint,
    pieceSlot: number,
    x: number,
    y: number
  ): Promise<Hex> {
    if (!this.sessionAccount) {
      this.loadOrCreateSessionKey();
    }

    const sessionWalletClient = createWalletClient({
      account: this.sessionAccount!,
      chain: monadTestnet,
      transport: http(),
    });

    const hash = await sessionWalletClient.writeContract({
      address: CONTRACT_ADDRESSES.game as Address,
      abi: MonadianGameArtifact.abi,
      functionName: 'makeMove',
      args: [roundId, pieceSlot, x, y],
    });

    return hash;
  }

  /**
   * Menembakkan sabotase senjata on-chain via Session Key
   */
  public async fireSabotage(
    roundId: bigint,
    target: Address,
    targetBitPosition: number
  ): Promise<Hex> {
    if (!this.sessionAccount) {
      this.loadOrCreateSessionKey();
    }

    const sessionWalletClient = createWalletClient({
      account: this.sessionAccount!,
      chain: monadTestnet,
      transport: http(),
    });

    const hash = await sessionWalletClient.writeContract({
      address: CONTRACT_ADDRESSES.game as Address,
      abi: MonadianGameArtifact.abi,
      functionName: 'fireSabotage',
      args: [roundId, target, targetBitPosition],
    });

    return hash;
  }

  /**
   * Membaca status state pemain on-chain
   */
  public async getPlayerState(roundId: bigint, player: Address) {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.game as Address,
      abi: MonadianGameArtifact.abi,
      functionName: 'getPlayerState',
      args: [roundId, player],
    });
    return data;
  }
}

export const sessionEngine = new SessionKeyManager();
