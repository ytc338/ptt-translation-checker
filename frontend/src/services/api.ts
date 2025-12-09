import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
});

import type { AnalysisResult, Annotation } from '../types';

export const translatePost = async (url: string): Promise<AnalysisResult> => {
  const response = await api.post<AnalysisResult>('/proofread/translate', { url });
  return response.data;
};

export const analyzePost = async (englishSource: string, googleTranslation: string, opTranslation?: string, articleTitle?: string, articleId?: string): Promise<{ annotations: Annotation[] }> => {
  const response = await api.post<{ annotations: Annotation[] }>('/proofread/analyze', {
    englishSource,
    googleTranslation,
    opTranslation,
    articleTitle,
    articleId
  });
  return response.data;
};

export const fetchHistory = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/proofread/history');
  return response.data;
};

export const fetchProofreadByArticleId = async (articleId: string): Promise<any> => {
  const response = await api.get<any>(`/proofread/${articleId}`);
  return response.data;
};

export const deleteHistoryEntry = async (id: number): Promise<void> => {
  await api.delete(`/proofread/history/${id}`);
};

export default api;
