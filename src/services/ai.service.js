import { GoogleGenAI } from '@google/genai';

export const parseVoiceCommand = async (rawText) => {
    const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
    if (!ai) throw new Error('GEMINI_API_KEY is not configured.');
    if (typeof rawText !== 'string' || !rawText.trim()) throw new Error('No voice command transcript provided.');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Parse this merchant voice prompt: "${rawText}"`,
        config: {
            systemInstruction: 'Extract customerName, amount, purpose, and paymentType. Default paymentType to FULL.',
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    customerName: { type: 'STRING' },
                    amount: { type: 'NUMBER' },
                    purpose: { type: 'STRING' },
                    paymentType: { type: 'STRING', enum: ['FULL', 'INSTALLMENT'] }
                },
                required: ['customerName', 'amount', 'purpose', 'paymentType']
            }
        }
    });
    return JSON.parse(response.text);
};