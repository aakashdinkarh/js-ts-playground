import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useCodeSessions } from '@hooks/useCodeSessions';
import { SessionContextType } from 'types/session';
import { Language } from '@constants/app';

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

  const updateCode = useCallback((code: string) => {
    if (activeSession) {
      updateSession(activeSession.id, { code });
    }
  }, [activeSession, updateSession]);

  const updateLanguage = useCallback((language: Language) => {
    if (activeSession) {
      updateSession(activeSession.id, { language });
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
