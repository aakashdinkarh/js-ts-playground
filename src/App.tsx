import { Tab } from '@components/common/Tab';
import { JavaScriptEditor } from '@components/JavaScriptEditor';
import { TypeScriptEditor } from '@components/TypeScriptEditor';
import { SessionManager } from '@components/SessionManager';
import { ShareButton } from '@components/common/ShareButton';
import { APP_CONSTANTS, LANGUAGES } from '@constants/app';
import { useSession } from '@contexts/SessionContext';
import '@styles/app.css';

export const App = () => {
  const { activeSession, updateLanguage } = useSession();

  const currentLanguage = activeSession?.language || LANGUAGES.JAVASCRIPT;

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <img width="32" height="32" src="https://aakashdinkarh.github.io/static_assets/images/svgs/js_ts_compiler_logo.svg" alt="JS/TS Compiler Logo" />
          <h1>{APP_CONSTANTS.TITLE}</h1>
        </div>
        <div className="header-actions">
          <ShareButton />
          <a 
            href={APP_CONSTANTS.GITHUB_URL}
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            GitHub
          </a>
        </div>
    </header>
    <SessionManager />
    <div className="tabs">
      <Tab 
        label="JavaScript"
        isActive={currentLanguage === LANGUAGES.JAVASCRIPT}
        onClick={() => updateLanguage(LANGUAGES.JAVASCRIPT)}
      />
      <Tab 
        label="TypeScript"
        isActive={currentLanguage === LANGUAGES.TYPESCRIPT}
        onClick={() => updateLanguage(LANGUAGES.TYPESCRIPT)}
      />
    </div>
      {currentLanguage === LANGUAGES.JAVASCRIPT ? <JavaScriptEditor /> : <TypeScriptEditor />}
    </div>
  );
}
