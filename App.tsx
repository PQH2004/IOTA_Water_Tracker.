import React, { useState, useEffect } from 'react';
import { WalletButton } from './components/WalletButton';
import { WaterEntryForm } from './components/WaterEntryForm';
import { StatsChart } from './components/StatsChart';
import { HydrationAI } from './components/HydrationAI';
import { connectWallet, writeWaterToTangle } from './services/iotaService';
import { WalletState, WaterLog, LoadingState } from './types';

export default function App() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [txStatus, setTxStatus] = useState<LoadingState>(LoadingState.IDLE);

  // Load logs from local storage on mount (persistence layer)
  useEffect(() => {
    const saved = localStorage.getItem('waterLogs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  // Save logs whenever they change
  useEffect(() => {
    localStorage.setItem('waterLogs', JSON.stringify(logs));
  }, [logs]);

  const handleConnect = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));
    const result = await connectWallet();
    setWallet(result);
  };

  const handleAddWater = async (amount: number) => {
    if (!wallet.isConnected || !wallet.address) {
      alert("Vui lòng kết nối ví trước!");
      return;
    }

    setTxStatus(LoadingState.LOADING);
    
    try {
      // 1. Send transaction to IOTA Testnet (Simulating Smart Contract write)
      const txHash = await writeWaterToTangle(wallet.address, amount);
      
      // 2. Update Local State
      const newLog: WaterLog = {
        id: crypto.randomUUID(),
        amount,
        timestamp: Date.now(),
        dateStr: new Date().toISOString().split('T')[0],
        txHash
      };

      setLogs(prev => [...prev, newLog]);
      setTxStatus(LoadingState.SUCCESS);
      
      // Reset status after a moment
      setTimeout(() => setTxStatus(LoadingState.IDLE), 3000);

    } catch (error: any) {
      console.error(error);
      alert("Giao dịch thất bại: " + error.message);
      setTxStatus(LoadingState.ERROR);
    }
  };

  // Calculate today's total
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = logs
    .filter(l => l.dateStr === todayStr)
    .reduce((sum, l) => sum + l.amount, 0);
  
  const dailyGoal = 2000;
  const progressPercent = Math.min((todayTotal / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              💧
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 tracking-tight">IOTA Water</h1>
              <p className="text-xs text-slate-500">Track on Tangle</p>
            </div>
          </div>
          <WalletButton wallet={wallet} onConnect={handleConnect} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Progress Section */}
        <section className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
            <div>
              <p className="text-blue-100 font-medium mb-1">Hôm nay bạn đã uống</p>
              <div className="text-5xl font-bold tracking-tight">
                {todayTotal}<span className="text-2xl opacity-70 ml-1">ml</span>
              </div>
              <p className="text-sm mt-2 opacity-90">Mục tiêu: {dailyGoal}ml</p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="flex justify-between text-xs font-semibold mb-2 opacity-90">
                <span>Tiến độ</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/20 rounded-full blur-xl"></div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Input */}
          <div className="space-y-6">
            <WaterEntryForm 
              onAddWater={handleAddWater} 
              status={txStatus} 
              isConnected={wallet.isConnected} 
            />
            <HydrationAI logs={logs} />
          </div>

          {/* Right Column: Charts & History */}
          <div className="md:col-span-2 space-y-6">
            <div className="h-80">
              <StatsChart logs={logs} />
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Lịch sử ghi nhận (On-Chain)</h3>
                <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">IOTA EVM Testnet</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-3">Thời gian</th>
                      <th className="px-6 py-3">Lượng nước</th>
                      <th className="px-6 py-3">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.slice().reverse().map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-slate-600">
                          {new Date(log.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                          <span className="block text-xs text-slate-400">{log.dateStr}</span>
                        </td>
                        <td className="px-6 py-3 font-medium text-blue-600">
                          +{log.amount}ml
                        </td>
                        <td className="px-6 py-3">
                          {log.txHash ? (
                            <a 
                              href={`https://explorer.evm.testnet.iotaledger.net/tx/${log.txHash}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-iota-600 hover:text-iota-900 underline truncate max-w-[120px] block"
                              title={log.txHash}
                            >
                              {log.txHash.slice(0, 10)}...
                            </a>
                          ) : (
                            <span className="text-slate-300">Pending...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                          Chưa có dữ liệu nào được ghi nhận.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}