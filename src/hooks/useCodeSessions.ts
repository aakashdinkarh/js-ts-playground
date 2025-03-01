import { APP_CONSTANTS, LANGUAGES } from '@constants/app';
import { useState, useEffect } from 'react';
import { CodeSession } from 'types/session';
import { saveCode, getCode, deleteCode } from '@utils/indexedDB';

export const MAX_SESSIONS = 10;
const STORAGE_KEY = 'code-sessions';

export const useCodeSessions = () => {
  const [sessions, setSessions] = useState<CodeSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load sessions from localStorage and IndexedDB on mount
  useEffect(() => {
    const loadSessions = async () => {
      const startTime = performance.now();
      try {
        const storedSessions = localStorage.getItem(STORAGE_KEY);
        if (!storedSessions) {
          throw new Error('No sessions found');
        }

        const parsedMetadata = JSON.parse(storedSessions) as Omit<CodeSession, 'code'>[];
        if (!Array.isArray(parsedMetadata)) {
          throw new Error('Invalid sessions data');
        }

        if (parsedMetadata.length === 0) {
          throw new Error('No sessions found');
        }

        // Load code for each session from IndexedDB
        const loadedSessions = await Promise.all(
          parsedMetadata.map(async (metadata) => {
            const code = await getCode(metadata.id) || APP_CONSTANTS.DEFAULT_CODE;
            return {
              ...metadata,
              code,
            };
          })
        );

        setSessions(loadedSessions);
        setActiveSessionId(loadedSessions[0].id);
        console.dir(`Loading sessions took ${performance.now() - startTime}ms`);
      } catch (error) {
        createSession();
      }
    };

    loadSessions();
  }, []);

  // Save session metadata to localStorage whenever they change
  useEffect(() => {
    // Differ the saving to the next tick to avoid blocking the main thread
    setTimeout(() => {
      const metadata = sessions.map(({ id, title, language, createdAt, lastModified }) => ({
        id,
        title,
        language,
        createdAt,
        lastModified,
    }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
    }, 0);
  }, [sessions]);

  const createSession = async () => {
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

    // Save code to IndexedDB, No need to await
    saveCode(newSession.id, newSession.code);

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  const updateSession = async (id: string, updates: Partial<CodeSession>) => {
    // If code is being updated, save it to IndexedDB
    if (updates.code) {
      saveCode(id, updates.code);
    }

    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...updates, lastModified: Date.now() }
        : session
    ));
  };

  const deleteSession = async (id: string) => {
    // Delete code from IndexedDB
    deleteCode(id);

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
