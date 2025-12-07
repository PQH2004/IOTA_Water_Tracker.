import { GoogleGenAI } from "@google/genai";
import { WaterLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeHydration = async (logs: WaterLog[]): Promise<string> => {
  if (logs.length === 0) {
    return "Bạn chưa có dữ liệu uống nước. Hãy nhập lượng nước bạn đã uống để tôi có thể phân tích.";
  }

  // Prepare data for the prompt
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.dateStr === today);
  const totalToday = todayLogs.reduce((acc, curr) => acc + curr.amount, 0);
  
  const historySummary = logs.slice(-10).map(l => `${l.dateStr}: ${l.amount}ml`).join('\n');

  const prompt = `
    Đóng vai trò là một chuyên gia dinh dưỡng và sức khỏe (Hydration Coach).
    Dựa trên dữ liệu uống nước của người dùng dưới đây, hãy đưa ra nhận xét ngắn gọn, vui vẻ và lời khuyên hữu ích bằng tiếng Việt.
    
    Hôm nay (${today}): Tổng cộng ${totalToday}ml.
    Lịch sử gần đây:
    ${historySummary}
    
    Mục tiêu khuyến nghị trung bình là 2000ml - 2500ml mỗi ngày.
    Nếu hôm nay uống ít, hãy nhắc nhở nhẹ nhàng. Nếu uống đủ, hãy khen ngợi.
    Đưa ra 1 sự thật thú vị về nước (fun fact) ở cuối.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Không thể phân tích dữ liệu lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xin lỗi, AI đang bận. Vui lòng thử lại sau.";
  }
};