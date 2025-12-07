import React, { useState } from 'react';
import { LoadingState } from '../types';

interface WaterEntryFormProps {
  onAddWater: (amount: number) => Promise<void>;
  status: LoadingState;
  isConnected: boolean;
}

export const WaterEntryForm: React.FC<WaterEntryFormProps> = ({ onAddWater, status, isConnected }) => {
  const [amount, setAmount] = useState<string>('250');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (val > 0) {
      onAddWater(val);
    }
  };

  const presetAmounts = [200, 250, 500];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-blue-500 text-2xl">💧</span> Nhập lượng nước
      </h3>
      
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
          ⚠️ Vui lòng kết nối ví để ghi dữ liệu lên IOTA Tangle.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Chọn nhanh (ml)</label>
          <div className="flex gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  amount === preset.toString()
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {preset}ml
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Hoặc nhập số lượng</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-iota-500 focus:border-iota-500 outline-none transition-all text-lg"
              placeholder="0"
              min="1"
            />
            <span className="absolute right-4 top-3.5 text-slate-400 font-medium">ml</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === LoadingState.LOADING || !isConnected}
          className={`
            w-full py-3 rounded-lg font-bold text-white shadow-md transition-all transform active:scale-95
            ${status === LoadingState.LOADING || !isConnected
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-iota-500 hover:from-blue-600 hover:to-iota-600'
            }
          `}
        >
          {status === LoadingState.LOADING ? 'Đang gửi lên Tangle...' : 'Lưu dữ liệu'}
        </button>
      </form>
    </div>
  );
};