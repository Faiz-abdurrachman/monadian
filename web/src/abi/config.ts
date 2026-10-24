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
  // Live Monad Testnet (Chain ID 10143)
  combat: '0xE8c07DDcC61C2880b89Edd6633F96F5210a0f64B',
  vault: '0xb84bAC0fD5bA009ecF6C414CDA481D3623E5333F',
  game: '0xC9fC8beA27bB568105e36fc16FbA73Db7F6FA423',
};
