import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faMoon, faSun, faLanguage, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import './SettingsButton.css';

const SettingsButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    setIsMenuOpen(false); // 다크모드 변경 후 메뉴 닫기
  };

  const handleLanguageMenuToggle = () => {
    setIsLanguageMenuOpen(prev => !prev);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsLanguageMenuOpen(false);
    setIsMenuOpen(false);
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'ko': return t('settings.korean');
      case 'en': return t('settings.english');
      case 'ja': return t('settings.japanese');
      default: return lang;
    }
  };

  return (
    <div className="settings-container">
      <button 
        ref={buttonRef}
        className="settings-button"
        onClick={handleSettingsClick}
        aria-label="설정"
        title="설정"
      >
        <FontAwesomeIcon icon={faCog} />
      </button>
      
      {isMenuOpen && (
        <div ref={menuRef} className="settings-menu">
          <button 
            className="settings-menu-item"
            onClick={handleDarkModeToggle}
          >
            <FontAwesomeIcon 
              icon={isDarkMode ? faSun : faMoon} 
              className="menu-icon"
            />
            <span>{isDarkMode ? t('settings.lightMode') : t('settings.darkMode')}</span>
          </button>
          
          <div className="settings-menu-item language-menu-item">
            <button 
              className="language-toggle-btn"
              onClick={handleLanguageMenuToggle}
            >
              <div className="language-toggle-content">
                <FontAwesomeIcon 
                  icon={faLanguage} 
                  className="menu-icon"
                />
                <span>{t('settings.language')}</span>
              </div>
              <FontAwesomeIcon 
                icon={faChevronRight} 
                className={`chevron-icon ${isLanguageMenuOpen ? 'rotated' : ''}`}
              />
            </button>
            
            {isLanguageMenuOpen && (
              <div className="language-submenu">
                {(['ko', 'en', 'ja'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    className={`language-option ${language === lang ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {getLanguageLabel(lang)}
                    {language === lang && <span className="check-mark">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton; 