
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AIJournalResponse } from "../types/journalTypes";

const SYSTEM_INSTRUCTION = `
Bạn là hệ thống hỗ trợ tạo và quản lý tính năng Nhật Ký trong một ứng dụng productivity. 
Nhiệm vụ của bạn là xử lý dữ liệu nhật ký theo hướng mạch lạc, cảm xúc và dễ đọc.  
Dựa trên mô tả người dùng cung cấp, hãy trả về kết quả theo đúng cấu trúc sau:

1. Tóm tắt cảm xúc chung của ngày (tone: tích cực, trung lập, tiêu cực).
2. Viết lại nội dung nhật ký theo văn phong tự nhiên, rõ ràng, có cảm xúc, giữ đúng ngữ cảnh.
3. Gợi ý 1–2 câu trích dẫn hoặc thông điệp phù hợp với nội dung (tùy chọn).
4. Rút ra 3 điểm chính của ngày hôm đó (What happened).
5. Đề xuất 2 gợi ý cải thiện cho ngày tiếp theo (Actionable).
6. Gợi ý 3–5 hashtag phù hợp (không chứa ký tự đặc biệt ngoài #).

Yêu cầu:
- Văn phong ấm áp, tự nhiên, không khoa trương.
- Không bịa thêm sự kiện không có.
- Tập trung vào trải nghiệm cá nhân và dòng chảy cảm xúc của người viết.
`;

const RESPONSE_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        summary_emotion: { type: Type.STRING, description: "Tóm tắt cảm xúc chung (tích cực, trung lập, tiêu cực)" },
        content_refined: { type: Type.STRING, description: "Nội dung nhật ký đã viết lại" },
        quote: { type: Type.STRING, description: "Câu trích dẫn phù hợp" },
        key_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 điểm chính trong ngày" },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 gợi ý cải thiện" },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hashtags phù hợp" }
    },
    required: ["summary_emotion", "content_refined", "key_points", "hashtags"]
};

export const analyzeJournalEntry = async (rawText: string): Promise<AIJournalResponse> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: rawText,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.7, // Slightly creative but grounded
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        return JSON.parse(text) as AIJournalResponse;
    } catch (error) {
        console.error("AI Journal Analysis Error:", error);
        // Fallback in case of error
        return {
            summary_emotion: "Trung lập",
            content_refined: rawText,
            quote: "Hôm nay là một ngày mới.",
            key_points: ["Ghi nhận nhật ký"],
            improvements: ["Tiếp tục theo dõi"],
            hashtags: ["#nhatky"]
        };
    }
};
