import { MAX_SESSIONS } from '../hooks/useCodeSessions';
import { useSession } from '@contexts/SessionContext';

export function SessionManager() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession
  } = useSession();

  const handleNewSession = () => {
    try {
      createSession();
    } catch (error) {
      alert('Maximum session limit (10) reached!');
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
          >
            <span>{session.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSession(session.id);
              }}
            >
              x
            </button>
          </div>
        ))}
        {sessions.length < MAX_SESSIONS && (
          <button className="new-session-btn" onClick={handleNewSession}>
            +
          </button>
        )}
      </div>
    </div>
  );
}
