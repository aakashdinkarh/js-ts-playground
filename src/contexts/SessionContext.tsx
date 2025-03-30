import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useCodeSessions } from '@hooks/useCodeSessions';
import type { SessionContextType } from 'types/session';
import type { Language } from '@constants/app';

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: React.PropsWithChildren) => {
  const { 
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    updateSession,
    getActiveSession
  } = useCodeSessions();

  const activeSession = getActiveSession();

  const updateCode = useCallback(async (code: string) => {
    if (activeSession) {
      await updateSession(activeSession.id, { code });
    }
  }, [activeSession, updateSession]);

  const updateLanguage = useCallback(async (language: Language) => {
    if (activeSession) {
      await updateSession(activeSession.id, { language });
    }
  }, [activeSession, updateSession]);

  const contextValue = useMemo(() => ({
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    updateSession,
    updateCode,
    updateLanguage
  }), [sessions, activeSession, activeSessionId, setActiveSessionId, createSession, deleteSession, updateSession, updateCode, updateLanguage]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
