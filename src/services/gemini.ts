import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestions(subject: Subject, count: number = 5): Promise<Question[]> {
  const prompt = `Buatlah ${count} soal pilihan ganda untuk mata pelajaran ${subject} tingkat Sekolah Dasar (SD). 
  Setiap soal harus memiliki:
  1. Teks pertanyaan yang jelas.
  2. 4 pilihan jawaban (A, B, C, D).
  3. Indeks jawaban yang benar (0-3).
  4. Penjelasan singkat mengapa jawaban tersebut benar.
  5. Tingkat kesulitan (Mudah, Sedang, atau Sulit).
  
  Pastikan bahasa yang digunakan ramah anak dan mudah dimengerti.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "explanation", "difficulty"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((q: any, index: number) => ({
      ...q,
      id: `${subject}-${Date.now()}-${index}`,
      subject
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback static questions if AI fails
    return getFallbackQuestions(subject);
  }
}

function getFallbackQuestions(subject: Subject): Question[] {
  return [
    {
      id: 'fallback-1',
      subject,
      text: `Berapakah hasil dari 15 + 27?`,
      options: ['32', '42', '52', '45'],
      correctAnswer: 1,
      explanation: '15 + 27 = 42.',
      difficulty: 'Mudah'
    }
  ];
}
