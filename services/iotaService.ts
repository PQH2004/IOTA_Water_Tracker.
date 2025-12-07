import { WalletState } from '../types';

// IOTA EVM Testnet Configuration
const IOTA_TESTNET_CHAIN_ID = '0x433'; // 1075 in hex
const IOTA_TESTNET_CONFIG = {
  chainId: IOTA_TESTNET_CHAIN_ID,
  chainName: 'IOTA EVM Testnet',
  nativeCurrency: {
    name: 'IOTA',
    symbol: 'IOTA',
    decimals: 18,
  },
  rpcUrls: ['https://json-rpc.evm.testnet.iotaledger.net'],
  blockExplorerUrls: ['https://explorer.evm.testnet.iotaledger.net'],
};

// Global ethereum type extension
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<WalletState> => {
  if (!window.ethereum) {
    return {
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: 'Không tìm thấy ví (Metamask/IOTA Wallet). Vui lòng cài đặt ví.',
    };
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    // Check if on correct network
    if (chainId !== IOTA_TESTNET_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: IOTA_TESTNET_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [IOTA_TESTNET_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
    }

    return {
      address: accounts[0],
      chainId: IOTA_TESTNET_CHAIN_ID,
      isConnected: true,
      isConnecting: false,
      error: null,
    };
  } catch (error: any) {
    return {
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: error.message || 'Kết nối ví thất bại.',
    };
  }
};

/**
 * Simulates writing to a smart contract or sending a transaction with data to the Tangle (EVM Layer).
 * In a real scenario, this would call a contract method like `WaterTracker.record(amount)`.
 * Here we send a 0-value transaction with the amount encoded in the data field to act as a permanent record.
 */
export const writeWaterToTangle = async (address: string, amount: number): Promise<string> => {
  if (!window.ethereum) throw new Error("No wallet found");

  // Hex encode the amount to store it in the transaction input data
  const hexAmount = amount.toString(16).padStart(64, '0'); 
  // Fake function signature for "logWater(uint256)" -> 0x12345678 (placeholder)
  const data = `0x12345678${hexAmount}`;

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: address,
          to: address, // Sending to self for demo purposes (or would be contract address)
          value: '0x0',
          data: data, // Storing data on-chain
        },
      ],
    });
    return txHash;
  } catch (error: any) {
    console.error("IOTA Transaction Error:", error);
    throw new Error(error.message || "Gửi dữ liệu lên Tangle thất bại");
  }
};