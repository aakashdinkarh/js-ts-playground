import { APP_CONSTANTS, LANGUAGES } from '@constants/app';
import { useState, useEffect, useRef } from 'react';
import type { CodeSession } from 'types/session';
import { saveCode, getCode, deleteCode } from '@utils/indexedDB';
import { getSearchParams, removeSearchParam } from '@utils/searchParams';
import { getCodeSessionData } from '@utils/centralServerApis';

export const MAX_SESSIONS = 10;
const STORAGE_KEY = 'code-sessions';

export const useCodeSessions = () => {
  const [sessions, setSessions] = useState<CodeSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const hasLoadedCodes = useRef(false);
  const paramSessionId = getSearchParams('id');

  // Load session metadata from localStorage immediately
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(STORAGE_KEY);
      if (!storedSessions) {
        throw new Error('No sessions found');
      }

      const parsedMetadata = JSON.parse(storedSessions) as Omit<
        CodeSession,
        'code'
      >[];
      if (!Array.isArray(parsedMetadata)) {
        throw new Error('Invalid sessions data');
      }

      if (parsedMetadata.length === 0) {
        throw new Error('No sessions found');
      }

      // Set initial sessions with default code
      const initialSessions: CodeSession[] = parsedMetadata.map(metadata => ({
        ...metadata,
        code: APP_CONSTANTS.DEFAULT_CODE,
      }));

      const sameSessionFromParamIdIndex = initialSessions.findIndex(
        session => session.id === paramSessionId
      );
      if (!paramSessionId) {
        setSessions(prevSessions => [...initialSessions, ...prevSessions]);
        setActiveSessionId(initialSessions[0].id);
      } else if (sameSessionFromParamIdIndex !== -1) {
        initialSessions[sameSessionFromParamIdIndex].code =
          APP_CONSTANTS.GETTING_CODE_MESSAGE;

        setSessions(prevSessions => [...initialSessions, ...prevSessions]);
        setActiveSessionId(paramSessionId);
      } else {
        createSession(paramSessionId).then(session => {
          setSessions(prevSessions => [
            session,
            ...initialSessions,
            ...prevSessions,
          ]);
          setActiveSessionId(paramSessionId);
        });
      }
    } catch {
      try {
        if (paramSessionId) {
          createSession(paramSessionId).then(session => {
            setSessions(prevSessions => [session, ...prevSessions]);
            setActiveSessionId(paramSessionId);
          });
        } else {
          createSession();
        }
      } catch {
        alert(
          'Maximum session limit (10) reached! Please close one of the existing code sessions so that we have a tab slot free to place the code session from remote, and then refresh the page again to load the code session'
        );
      }
    }
  }, []);

  // Load actual code content from IndexedDB after metadata is loaded
  useEffect(() => {
    // Skip if no sessions or if we've already loaded codes
    if (sessions.length === 0 || hasLoadedCodes.current) return;

    const loadCodes = async () => {
      hasLoadedCodes.current = true;

      try {
        const results = await Promise.allSettled(
          sessions.map(async session => {
            if (session.id === paramSessionId) {
              const { error, id, ...restCodeSessionData } =
                await getCodeSessionData(paramSessionId);
              if (error) {
                return {
                  sessionId: session.id,
                  code: error,
                };
              }
              return {
                sessionId: id,
                ...restCodeSessionData,
                code: restCodeSessionData.code || APP_CONSTANTS.DEFAULT_CODE,
              };
            }
            const code = await getCode(session.id);
            return {
              sessionId: session.id,
              code: code || APP_CONSTANTS.DEFAULT_CODE,
            };
          })
        );

        setSessions(prevSessions => {
          const updatedSessions = [...prevSessions];
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              const sessionIndex = updatedSessions.findIndex(
                s => s.id === result.value.sessionId
              );
              if (sessionIndex !== -1) {
                const { sessionId, ...restCodeSessionData } = result.value;
                updatedSessions[sessionIndex] = {
                  ...updatedSessions[sessionIndex],
                  ...restCodeSessionData,
                };
                if (paramSessionId && sessionId === paramSessionId) {
                  saveCode(sessionId, restCodeSessionData.code).then(() => {
                    removeSearchParam('id');
                  });
                }
              }
            } else {
              console.warn(
                `Failed to load code for session '${sessions[index].title}':`,
                result.reason
              );
            }
          });
          return updatedSessions;
        });
      } catch {}
    };

    loadCodes();
  }, [sessions.length]); // Include sessions as dependency but use ref to prevent reloads

  // Save session metadata to localStorage whenever they change
  useEffect(() => {
    // Defer the saving to the next tick to avoid blocking the main thread
    setTimeout(() => {
      const metadata = sessions.map(
        ({ id, title, language, createdAt, lastModified }) => ({
          id,
          title,
          language,
          createdAt,
          lastModified,
        })
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
    }, 0);
  }, [sessions]);

  const createSession = async (remoteSessionId?: string) => {
    if (sessions.length >= MAX_SESSIONS) {
      throw new Error('Maximum session limit reached');
    }

    const newSession: CodeSession = {
      id: remoteSessionId || Date.now().toString(),
      title: `Session ${sessions.length + 1}`,
      code: remoteSessionId
        ? APP_CONSTANTS.GETTING_CODE_MESSAGE
        : APP_CONSTANTS.DEFAULT_CODE,
      language: LANGUAGES.JAVASCRIPT,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    // Save code to IndexedDB, No need to await
    saveCode(newSession.id, newSession.code);

    if (!remoteSessionId) {
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }
    return newSession;
  };

  const updateSession = async (id: string, updates: Partial<CodeSession>) => {
    // If code is being updated, save it to IndexedDB
    if (updates.code) {
      saveCode(id, updates.code);
    }

    setSessions(prev =>
      prev.map(session =>
        session.id === id
          ? { ...session, ...updates, lastModified: Date.now() }
          : session
      )
    );
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
