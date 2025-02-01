import { useState, useEffect } from 'react';
import { Tab } from '@components/common/Tab';
import { JavaScriptEditor } from '@components/JavaScriptEditor';
import { TypeScriptEditor } from '@components/TypeScriptEditor';
import { APP_CONSTANTS, STORAGE_KEYS, LANGUAGES, Language } from '@constants/index';
import '@styles/components.css';
import '@styles/app.css';

const DEFAULT_LANGUAGE: Language = LANGUAGES.TYPESCRIPT;

export const App = () => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE) as Language) || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, language);
  }, [language]);

  return (
    <div className="container">
      <header className="header">
        <h1>{APP_CONSTANTS.TITLE}</h1>
        <a 
          href={APP_CONSTANTS.GITHUB_URL}
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          GitHub
        </a>
      </header>
      <div className="tabs">
        <Tab 
          label="JavaScript"
          isActive={language === LANGUAGES.JAVASCRIPT}
          onClick={() => setLanguage(LANGUAGES.JAVASCRIPT)}
        />
        <Tab 
          label="TypeScript"
          isActive={language === LANGUAGES.TYPESCRIPT}
          onClick={() => setLanguage(LANGUAGES.TYPESCRIPT)}
        />
      </div>
      {language === LANGUAGES.JAVASCRIPT ? <JavaScriptEditor /> : <TypeScriptEditor />}
    </div>
  );
}