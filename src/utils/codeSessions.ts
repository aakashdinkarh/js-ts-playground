import { APP_CONSTANTS, LANGUAGES } from '@constants/app';
import type { CodeSession, SessionMetadata } from 'types/session';
import { getCode } from '@utils/indexedDB';
import { PROMISE_STATES } from '@constants/promise';

const STORAGE_KEY = 'code-sessions';

export const createNewSession = (id: string, title: string): CodeSession => ({
  id,
  title,
  code: APP_CONSTANTS.DEFAULT_CODE,
  language: LANGUAGES.JAVASCRIPT,
  createdAt: Date.now(),
  lastModified: Date.now(),
});

export const loadSessionMetadata = (): SessionMetadata[] => {
  const storedSessions = localStorage.getItem(STORAGE_KEY);
  if (!storedSessions) return [];

  try {
    const parsedMetadata = JSON.parse(storedSessions);
    return Array.isArray(parsedMetadata) ? parsedMetadata : [];
  } catch {
    return [];
  }
};

export const saveSessionMetadata = (sessions: CodeSession[]) => {
  const metadata = sessions.map(({ id, title, language, createdAt, lastModified }) => ({
    id,
    title,
    language,
    createdAt,
    lastModified,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
};

export const getSessionsFromLocalDB = async (sessionsToLoadFromLocalDB: CodeSession[]) =>
  await Promise.allSettled(
    sessionsToLoadFromLocalDB.map(async session => {
      const code = await getCode(session.id);
      return { ...session, code: code || APP_CONSTANTS.DEFAULT_CODE };
    })
  );

export const getUpdatedSessionsWithLocalDBCodes = (
  prevSessions: CodeSession[],
  results: PromiseSettledResult<CodeSession>[],
  sessionsToLoadFromLocalDB: CodeSession[]
) => {
  const updatedSessions = [...prevSessions];
  results.forEach((result, index) => {
    if (result.status === PROMISE_STATES.FULFILLED) {
      const index = updatedSessions.findIndex(s => s.id === result.value.id);
      if (index !== -1) {
        updatedSessions[index] = result.value;
      }
    } else {
      console.warn(
        `Failed to load code for session '${sessionsToLoadFromLocalDB[index].title}'`,
        result.reason
      );
    }
  });
  return updatedSessions;
};
