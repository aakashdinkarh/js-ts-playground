import { APP_CONSTANTS } from '@constants/app';
import { useState, useEffect, useRef } from 'react';
import type { CodeSession, SessionMetadata } from 'types/session';
import { saveCode, deleteCode } from '@utils/indexedDB';
import { getSearchParams, removeSearchParam } from '@utils/searchParams';
import { getCodeSessionData } from '@utils/centralServerApis';
import {
  createNewSession,
  loadSessionMetadata,
  saveSessionMetadata,
  getSessionsFromLocalDB,
  getUpdatedSessionsWithLocalDBCodes,
  setLastActiveSession,
  getLastActiveSession,
} from '@utils/codeSessions';

export const useCodeSessions = () => {
  const [sessions, setSessions] = useState<CodeSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(getLastActiveSession());
  const hasLoadedCodes = useRef(false);
  const paramSessionId = getSearchParams('id');

  const handleRemoteSession = async (metadata: SessionMetadata[]) => {
    const existingSessionIndex = metadata.findIndex(s => s.id === paramSessionId);

    if (existingSessionIndex !== -1) {
      handleExistingRemoteSession(metadata, existingSessionIndex);
      return metadata;
    }

    if (metadata.length >= APP_CONSTANTS.MAX_SESSIONS) {
      alert(APP_CONSTANTS.ALERT_MESSAGE_FOR_NEW_REMOTE_SESSION_CREATION);
      return metadata;
    }

    const newMetadata = await handleNewRemoteSession(metadata, paramSessionId as string);
    return newMetadata;
  };

  const handleExistingRemoteSession = async (
    metadata: SessionMetadata[],
    existingSessionIndex: number
  ) => {
    const existingSessionId = metadata[existingSessionIndex].id;

    // Get session from remote server asynchronously and update the session
    getCodeSessionData(existingSessionId).then(({ error, ...restCodeSessionData }) => {
      if (restCodeSessionData.id === existingSessionId) {
        setSessions(prev => {
          const updatedSessions = [...prev];
          updatedSessions[existingSessionIndex] = {
            ...updatedSessions[existingSessionIndex],
            ...restCodeSessionData,
          };
          return updatedSessions;
        });
        // save code to indexedDB and remove id param from url
        saveCode(existingSessionId, restCodeSessionData.code).then(() => {
          removeSearchParam('id');
        });
      } else {
        setSessions(prev => {
          const updatedSessions = [...prev];
          updatedSessions[existingSessionIndex] = {
            ...updatedSessions[existingSessionIndex],
            code: error || restCodeSessionData.code,
          };
          return updatedSessions;
        });
      }
    });
  };

  const handleNewRemoteSession = async (metadata: SessionMetadata[], remoteSessionId: string) => {
    const newSession = createNewSession(remoteSessionId, `Session ${metadata.length + 1}`);

    const newMetadata = [newSession, ...metadata];
    handleExistingRemoteSession(newMetadata, 0);
    return newMetadata;
  };

  // Initialize sessions and handle remote session if present
  useEffect(() => {
    const initializeSessions = async () => {
      const metadata = loadSessionMetadata();

      let initialSessionMetadata = metadata;

      // Handle remote session if present
      if (paramSessionId) {
        initialSessionMetadata = await handleRemoteSession(metadata);
      } else {
        initialSessionMetadata =
          metadata.length > 0 ? metadata : [createNewSession(Date.now().toString(), 'Session 1')];
      }

      // Until session is fetched asynchronously, show getting your code message
      const initialSessions = initialSessionMetadata.map(m => ({
        ...m,
        code: APP_CONSTANTS.GETTING_CODE_MESSAGE,
      }));
      const activeSessionId =
        initialSessions.find(s => s.id === paramSessionId)?.id || initialSessions[0].id;

      setSessions(initialSessions);
      setActiveSessionId(activeSessionId);
    };

    initializeSessions();
  }, []);

  // Load code content for sessions
  useEffect(() => {
    if (sessions.length === 0 || hasLoadedCodes.current) return;

    const sessionsToLoadFromLocalDB = sessions.filter(session => session.id !== paramSessionId);
    const loadCodes = async () => {
      hasLoadedCodes.current = true;
      const results = await getSessionsFromLocalDB(sessionsToLoadFromLocalDB);
      setSessions(getUpdatedSessionsWithLocalDBCodes(sessions, results, sessionsToLoadFromLocalDB));
    };

    loadCodes();
  }, [sessions.length]);

  // Save metadata when sessions change
  useEffect(() => {
    saveSessionMetadata(sessions);
  }, [sessions]);

  // Save last active session when active session changes
  useEffect(() => {
    activeSessionId && setLastActiveSession(activeSessionId);
  }, [activeSessionId]);

  const createSession = async () => {
    if (sessions.length >= APP_CONSTANTS.MAX_SESSIONS) {
      throw new Error('Maximum session limit reached');
    }

    const newSession = createNewSession(Date.now().toString(), `Session ${sessions.length + 1}`);

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

    setSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, ...updates, lastModified: Date.now() } : session
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
