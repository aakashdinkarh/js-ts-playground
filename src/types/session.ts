import type { Language } from '@constants/app';
import type { TUtcDate } from 'types/common';

export interface CodeSession {
  id: string;
  title: string;
  code: string;
  language: Language;
  createdAt: number;
  lastModified: number;
}

export type SessionMetadata = Omit<CodeSession, 'code'>;

export interface CodeSessionResponse {
  data: Pick<CodeSession, 'id' | 'code' | 'language'> & {
    updatedAt: TUtcDate;
    createdAt: TUtcDate;
  };
}

export interface SessionContextType {
  sessions: CodeSession[];
  activeSession: CodeSession | null;
  activeSessionId: string | null;
  setActiveSessionId: (id: CodeSession['id']) => void;
  createSession: () => Promise<CodeSession>;
  deleteSession: (id: CodeSession['id']) => Promise<void>;
  updateSession: (id: CodeSession['id'], updates: Partial<CodeSession>) => Promise<void>;
  updateCode: (code: string) => Promise<void>;
  updateLanguage: (language: Language) => Promise<void>;
}
