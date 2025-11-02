


import { Injectable, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  
  // In a real app, process.env.API_KEY would be set by the build environment.
  // We use a placeholder here for the Applet environment.
  private apiKey = (process.env as any).API_KEY ?? 'YOUR_API_KEY_HERE';

  constructor() {
    if (this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE') {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  async getFindingSuggestions(examType: string): Promise<string> {
    if (!this.genAI) {
      console.error('Gemini API key not configured.');
      throw new Error('API key not configured. Please set the API_KEY environment variable.');
    }
    
    if (!examType) {
        throw new Error('Exam type is required to generate suggestions.');
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a medical assistant specializing in radiology. Your task is to generate a structured 'Findings' section for an ultrasound report.
      - Be concise and use standard medical terminology.
      - Do not provide a diagnosis or an 'Impression' section.
      - Base the findings on the provided exam type.
      - Structure the output with clear headings and bullet points where appropriate.
      - CRITICAL: Do NOT use bracketed placeholders like [value]. Instead, provide descriptive, qualitative statements. For example, instead of "The right kidney measures [X] cm", write "The right kidney is normal in size and appearance.".

      Exam Type: "${examType}"

      Generate only the text for the 'Findings' section.
    `;

    try {
      const response = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: 0.5,
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error generating content from Gemini API:', error);
      throw new Error('Failed to fetch suggestions from the AI service.');
    }
  }

  async getImpressionSuggestions(examType: string, findings: string): Promise<string> {
    if (!this.genAI) {
      console.error('Gemini API key not configured.');
      throw new Error('API key not configured. Please set the API_KEY environment variable.');
    }

    if (!examType || !findings) {
      throw new Error('Exam type and findings are required to generate an impression.');
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a radiologist writing an ultrasound report.
      Your task is to write a concise 'Impression' section based on the provided 'Findings'.
      - The impression must be a summary of the most important findings.
      - It should lead to a clear diagnostic conclusion where appropriate.
      - Do not repeat the findings verbatim. Synthesize them into a conclusion.
      - Generate a complete, natural-language paragraph.
      - CRITICAL: Do NOT use bracketed placeholders like [value]. Instead, describe what should be there. For example, instead of "fetal heart rate is [HR] bpm", write "fetal heart rate is within normal limits" or "fetal heart rate was measured at...".

      Exam Type: "${examType}"

      Findings:
      "${findings}"

      Generate only the text for the 'Impression' section, without any preamble or heading.
    `;

    try {
      const response = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: 0.6,
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error generating impression from Gemini API:', error);
      throw new Error('Failed to fetch impression from the AI service.');
    }
  }
}