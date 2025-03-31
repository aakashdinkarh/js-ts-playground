import { useSession } from '@contexts/SessionContext';
import { useState } from 'react';
import { createCodeSession, updateCodeSession } from '@utils/centralServerApis';
import { isIdUnique } from '@utils/isIdUniqueId';
import { copyShareableLink } from '@utils/clipboard';
import { SHARE_BUTTON_TEXT } from '@constants/button';
import { ShareIcon } from '@components/common/ShareIcon';

export const ShareButton = () => {
  const [shareBtnText, setShareBtnText] = useState<string>(SHARE_BUTTON_TEXT.SHARE);

  const afterShareCallback = () => {
    setTimeout(() => {
      setShareBtnText(SHARE_BUTTON_TEXT.SHARE);
    }, 2000);
  };

  const { activeSession } = useSession();

  const handleShare = async () => {
    if (shareBtnText !== SHARE_BUTTON_TEXT.SHARE) return;
    if (!activeSession) return;
    setShareBtnText(SHARE_BUTTON_TEXT.COPYING);

    const sessionId = activeSession.id;
    const isSessionIdUnique = isIdUnique(sessionId);

    // Update flow
    if (isSessionIdUnique) {
      const { error, id } = await updateCodeSession(sessionId, activeSession.code, activeSession.language);

      if (error != null) {
        setShareBtnText(error || SHARE_BUTTON_TEXT.ERROR);
      } else {
        const result = await copyShareableLink(id);
        setShareBtnText(result.message);
      }

      afterShareCallback();
      return;
    }

    // Create flow
    const { error, id } = await createCodeSession(activeSession.code, activeSession.language);

    if (error != null) {
      setShareBtnText(error || SHARE_BUTTON_TEXT.ERROR);
    } else {
      const result = await copyShareableLink(id);
      setShareBtnText(result.message);
    }

    afterShareCallback();
  };

  return (
    <button 
      className="share-button"
      onClick={handleShare}
      disabled={shareBtnText === SHARE_BUTTON_TEXT.COPYING}
      title={shareBtnText === SHARE_BUTTON_TEXT.SHARE ? 'Share Code' : 'Copying...'}
      aria-label='Share Code'
      aria-busy={shareBtnText === SHARE_BUTTON_TEXT.COPYING}
      aria-disabled={shareBtnText === SHARE_BUTTON_TEXT.COPYING}
    >
      {shareBtnText === SHARE_BUTTON_TEXT.SHARE && <ShareIcon />}
      <span>{shareBtnText}</span>
    </button>
  );
};
