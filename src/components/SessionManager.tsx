import { MAX_SESSIONS } from '../hooks/useCodeSessions';
import { useSession } from '@contexts/SessionContext';
import { useState, useRef, useEffect } from 'react';
import { MAX_SESSION_TITLE_LENGTH } from '@constants/app';

export function SessionManager() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    updateSession
  } = useSession();

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSessionId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSessionId]);

  const handleNewSession = () => {
    try {
      createSession();
    } catch (error) {
      alert('Maximum session limit (10) reached!');
    }
  };

  const startEditing = (session: { id: string, title: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditValue(session.title);
  };

  const handleSave = (id: string) => {
    const trimmedValue = editValue.trim();
    if (!trimmedValue) {
      // If empty, revert to the original title
      const originalTitle = sessions.find(s => s.id === id)?.title || '';
      setEditValue(originalTitle);
      setEditingSessionId(null);
      return;
    }
    updateSession(id, { title: trimmedValue.slice(0, MAX_SESSION_TITLE_LENGTH) });
    setEditingSessionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSave(id);
    } else if (e.key === 'Escape') {
      setEditingSessionId(null);
    }
  };

  return (
    <div className="session-manager">
      <div className="session-tabs">
        {sessions.map(session => (
          <div
            key={session.id}
            className={`session-tab ${session.id === activeSessionId ? 'active' : ''}`}
            onClick={() => setActiveSessionId(session.id)}
            title="Double click to edit session title"
          >
            {editingSessionId === session.id ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                maxLength={MAX_SESSION_TITLE_LENGTH}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(session.id)}
                onKeyDown={(e) => handleKeyDown(e, session.id)}
                onClick={(e) => e.stopPropagation()}
                className="session-title-input"
                name={`session-title-${session.id}`}
                placeholder="(required)"
                required
              />
            ) : (
              <div onDoubleClick={(e) => startEditing(session, e)}>{session.title}</div>
            )}
            {sessions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                title="Delete session"
              >
                x
              </button>
            )}
          </div>
        ))}
        {sessions.length < MAX_SESSIONS && (
          <button className="new-session-btn" onClick={handleNewSession} title="Create a new session">
            +
          </button>
        )}
      </div>
    </div>
  );
}
