import React, { useState } from 'react';
import { analyzeHydration } from '../services/geminiService';
import { WaterLog } from '../types';

interface HydrationAIProps {
  logs: WaterLog[];
}

export const HydrationAI: React.FC<HydrationAIProps> = ({ logs }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeHydration(logs);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-md p-6 border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <span>🤖</span> Trợ lý AI
        </h3>
        {!advice && (
          <button
            onClick={handleAnalyze}
            disabled={loading || logs.length === 0}
            className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang phân tích...' : 'Nhận lời khuyên'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
        </div>
      ) : advice ? (
        <div className="bg-white p-4 rounded-lg border border-indigo-100 text-indigo-800 text-sm leading-relaxed whitespace-pre-line">
          {advice}
          <div className="mt-3 text-right">
             <button onClick={() => setAdvice(null)} className="text-xs text-indigo-400 hover:text-indigo-600 underline">Đóng</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-indigo-600/70">
          Hãy nhấn nút để AI phân tích thói quen uống nước của bạn và đưa ra lời khuyên hữu ích.
        </p>
      )}
    </div>
  );
};