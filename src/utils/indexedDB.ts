const DB_NAME = 'code-playground-db';
const DB_VERSION = 1;
const CODE_STORE = 'code-store';

interface CodeEntry {
  sessionId: string;
  code: string;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(CODE_STORE)) {
        db.createObjectStore(CODE_STORE, { keyPath: 'sessionId' });
      }
    };
  });
};

export const saveCode = async (sessionId: string, code: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CODE_STORE, 'readwrite');
    const store = transaction.objectStore(CODE_STORE);

    const request = store.put({ sessionId, code });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getCode = async (sessionId: string): Promise<string | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CODE_STORE, 'readonly');
    const store = transaction.objectStore(CODE_STORE);

    const request = store.get(sessionId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result as CodeEntry | undefined;
      resolve(result?.code || null);
    };
  });
};

export const deleteCode = async (sessionId: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CODE_STORE, 'readwrite');
    const store = transaction.objectStore(CODE_STORE);

    const request = store.delete(sessionId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}; 