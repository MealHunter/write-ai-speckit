// lib/types/diary.ts

export interface DiaryRequest {
  input: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
}

export interface DiaryContent {
  content: string;
  generatedAt: Date;
  inputKeyword: string;
  wordCount: number;
}

export type DiaryErrorCode =
  | 'EMPTY_INPUT'
  | 'INPUT_TOO_LONG'
  | 'API_TIMEOUT'
  | 'API_ERROR'
  | 'INVALID_RESPONSE';

export interface DiaryError {
  code: DiaryErrorCode;
  message: string;
  timestamp: Date;
  details?: string;
}

export interface GenerateDiaryResponse {
  success: boolean;
  data?: DiaryContent;
  error?: DiaryError;
}
