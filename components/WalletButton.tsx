import React from 'react';
import { WalletState } from '../types';

interface WalletButtonProps {
  wallet: WalletState;
  onConnect: () => void;
}

export const WalletButton: React.FC<WalletButtonProps> = ({ wallet, onConnect }) => {
  return (
    <div className="flex items-center gap-2">
      {wallet.error && (
        <span className="text-red-500 text-xs hidden md:inline">{wallet.error}</span>
      )}
      <button
        onClick={onConnect}
        disabled={wallet.isConnecting || wallet.isConnected}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md
          ${wallet.isConnected 
            ? 'bg-green-100 text-green-700 border border-green-200 cursor-default' 
            : 'bg-iota-500 hover:bg-iota-600 text-white border border-transparent'
          }
        `}
      >
        {wallet.isConnecting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang kết nối...
          </>
        ) : wallet.isConnected ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            Kết nối Ví IOTA
          </>
        )}
      </button>
    </div>
  );
};