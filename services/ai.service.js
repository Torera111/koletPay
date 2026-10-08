// src/services/ai.service.js
 import { GoogleGenAI } from '@google/genai'; 
import dotenv from'dotenv';
 dotenv.config(); 
 // Initialize the Google GenAI client with your API key
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  /** * Parses raw voice command transcripts into a structured JSON payload for invoicing. 
   * @param {string} rawText - The text transcribed from the user's voice input. 
   * @param {string} merchantId - The MongoDB ID of the merchant initiating the request. 
   * @returns {Promise<object>} The structured invoice data. 
   */
  
  export const parseVoiceCommand = async (rawText, merchantId) => {
     try { 
        if(!rawText) { 
            throw new Error("No voice command transcript provided.");
         }
          const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-flash', // Lightning-fast and cost-effective for hackathons 
            contents: `Parse this merchant voice prompt: "${rawText}"`, config: { 
                // Clear background context guiding how the model should behave 
                systemInstruction: `You are an AI billing assistant built for a Nigerian MSME banking app. Your job is to read raw text commands and extract billing information. If the payment type (e.g., split payment, parts, installment) is not mentioned, default to "FULL".`, 
                
                // Tells Gemini to strictly respond in JSON format matching our exact template schema
                responseMimeType: "application/json",
                responseSchema: {
                     type: "OBJECT",
                      properties: {
                         customerName: { 
                            type: "STRING", 
                            description: "The name of the customer being billed (e.g., Tobi, Amaka)." 
                        },
                         amount: {
                             type: "NUMBER", 
                             description: "The numerical value of the transaction. Clean expressions like '100k' to 100000, or '5k' to 5000."
                             }, 
                             purpose: { 
                                type: "STRING",
                                 description: "The service or product rendered (e.g., photography, catering, tailoring)." }, 
                                 paymentType: { 
                                    type: "STRING", 
                                    enum: ["FULL", "INSTALLMENT"], description: "Set to 'INSTALLMENT' if they mention paying in parts, milestones, or splits. Otherwise, use 'FULL'." 
                                }
                             },
                                required: ["customerName", "amount", "purpose", "paymentType"] 
                            }
                         }
                     }); 
                     // Extract the raw JSON text directly from Gemini's response object
                     const jsonString = response.text;
                      // Parse it back into a standard JavaScript Object to use in our controllers
                       const extractedPayload = JSON.parse(jsonString); return extractedPayload; 
                    } catch (error) { 
                        console.error("Gemini AI Parser Error:", error.message); 
                        throw new Error(`Failed to parse voice command logic: ${error.message}`); 
                    }
                 };