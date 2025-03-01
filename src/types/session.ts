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
  createSession: () => Promise<CodeSession>;
  deleteSession: (id: CodeSession['id']) => Promise<void>;
  updateSession: (id: CodeSession['id'], updates: Partial<CodeSession>) => Promise<void>;
  updateCode: (code: string) => Promise<void>;
  updateLanguage: (language: Language) => Promise<void>;
}
