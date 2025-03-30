import { useSession } from '@contexts/SessionContext';
import { useState } from 'react';
import { createCodeSession, updateCodeSession } from '@utils/centralServerApis';
import { isIdUnique } from '@utils/isIdUniqueId';
import { copyShareableLink } from '@utils/clipboard';

const ShareIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export const ShareButton = () => {
  const [copying, setCopying] = useState(false);
  const [message, setMessage] = useState('');

  const afterShareCallback = () => {
    setTimeout(() => {
      setCopying(false);
      setMessage('');
    }, 2000);
  };

  const { activeSession } = useSession();

  const handleShare = async () => {
    if (!activeSession) return;
    setCopying(true);

    const sessionId = activeSession.id;
    const isSessionIdUnique = isIdUnique(sessionId);

    // Update flow
    if (isSessionIdUnique) {
      const { error, id } = await updateCodeSession(sessionId, activeSession.code, activeSession.language);

      if (error != null) {
        setMessage(error || "Something went wrong! Try again.");
      } else {
        const result = await copyShareableLink(id);
        setMessage(result.message);
      }

      afterShareCallback();
      return;
    }

    // Create flow
    const { error, id } = await createCodeSession(activeSession.code, activeSession.language);

    if (error != null) {
      setMessage(error || "Something went wrong! Try again.");
    } else {
      const result = await copyShareableLink(id);
      setMessage(result.message);
    }

    afterShareCallback();
  };

  return (
    <div className="share-button-container">
      <button 
        className="share-button"
        onClick={handleShare}
        disabled={copying}
      >
        <ShareIcon />
        <span>{copying ? 'Copying...' : 'Share'}</span>
      </button>
      {message && <span className="share-message">{message}</span>}
    </div>
  );
};
