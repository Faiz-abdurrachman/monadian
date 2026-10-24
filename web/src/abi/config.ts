import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadExplorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
});

export const CONTRACT_ADDRESSES = {
  // Alamat default atau placeholder yang bisa di-override via env / deploy script
  combat: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  vault: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  game: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
};
