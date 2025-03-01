import { Language } from "@constants/app";

export interface CodeSession {
  id: string;
  title: string;
  code: string;
  language: Language;
  createdAt: number;
  lastModified: number;
}

export interface SessionContextType {
  sessions: CodeSession[];
  activeSession: CodeSession | null;
  activeSessionId: string | null;
  setActiveSessionId: (id: CodeSession['id']) => void;
  createSession: () => void;
  deleteSession: (id: CodeSession['id']) => void;
  updateSession: (id: CodeSession['id'], updates: Partial<CodeSession>) => void;
  updateCode: (code: string) => void;
  updateLanguage: (language: Language) => void;
}
