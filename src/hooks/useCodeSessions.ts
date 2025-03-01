import { APP_CONSTANTS, LANGUAGES } from '@constants/app';
import { useState, useEffect } from 'react';
import { CodeSession } from 'types/session';

export const MAX_SESSIONS = 10;
const STORAGE_KEY = 'code-sessions';

export const useCodeSessions = () => {
  const [sessions, setSessions] = useState<CodeSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(STORAGE_KEY);
      if (!storedSessions) {
        throw new Error('No sessions found');
      }

      const parsedSessions = JSON.parse(storedSessions);
      if (!Array.isArray(parsedSessions)) {
        throw new Error('Invalid sessions data');
      }

      if (parsedSessions.length === 0) {
        throw new Error('No sessions found');
      }

      setSessions(parsedSessions);
      setActiveSessionId(parsedSessions[0].id);
    } catch (error) {
      createSession();
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const createSession = () => {
    if (sessions.length >= MAX_SESSIONS) {
      throw new Error('Maximum session limit reached');
    }

    const newSession: CodeSession = {
      id: Date.now().toString(),
      title: `Session ${sessions.length + 1}`,
      code: APP_CONSTANTS.DEFAULT_CODE,
      language: LANGUAGES.JAVASCRIPT,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  const updateSession = (id: string, updates: Partial<CodeSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...updates, lastModified: Date.now() }
        : session
    ));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (activeSessionId === id) {
      const remainingSessions = sessions.filter(session => session.id !== id);
      setActiveSessionId(remainingSessions[0]?.id || null);
    }
  };

  const getActiveSession = () => {
    return sessions.find(session => session.id === activeSessionId) || null;
  };

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    getActiveSession,
  };
};
