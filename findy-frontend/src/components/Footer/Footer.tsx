import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

/**
 * 푸터 컴포넌트
 * 수정사항:
 * - 모든 링크 클릭 시 상단 스크롤 기능 추가
 * - handleNavigation 함수로 통합 처리
 * - handleLinkClick 함수로 외부 링크 처리
 */
const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // 내부 네비게이션 처리 및 상단 스크롤
  const handleNavigation = (path: string) => {
    navigate(path);
    // 페이지 이동 후 상단으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 외부 링크 클릭 처리 및 상단 스크롤
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // 외부 링크 클릭 후 상단으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="brand-section">
              <h3 className="footer-title">
                <div className="brand-icon">
                  <div className="search-icon">
                    <div className="search-circle"></div>
                    <div className="search-handle"></div>
                  </div>
                </div>
                <span className="brand-text">{t('footer.findyNews')}</span>
                <span className="brand-accent">.</span>
              </h3>
              <div className="brand-tagline">
                <span className="tagline-text">Smart News Discovery</span>
              </div>
            </div>
            <p className="footer-description">
              {t('footer.description1')}
            </p>
            <p className="footer-description">
              {t('footer.description2')}
            </p>
            {/*  소셜 미디어 링크  */}
            <div className="footer-social">
                <div className="social-row">
                  <a href="#" className="social-btn facebook" title="페이스북" onClick={() => handleLinkClick('#')} target="_blank">
                    <span className="social-icon">f</span>
                    <span className="social-label">Facebook</span>
                  </a>
                  <a href="#" className="social-btn twitter" title="트위터" onClick={() => handleLinkClick('#')} target="_blank">
                    <span className="social-icon">𝕏</span>
                    <span className="social-label">Twitter</span>
                  </a>
                </div>
                <div className="social-row">
                  <a href="#" className="social-btn instagram" title="인스타그램" onClick={() => handleLinkClick('#')} target="_blank">
                    <span className="social-icon">📷</span>
                    <span className="social-label">Instagram</span>
                  </a>
                  <a href="#" className="social-btn youtube" title="유튜브" onClick={() => handleLinkClick('#')} target="_blank">
                    <span className="social-icon">▶</span>
                    <span className="social-label">YouTube</span>
                  </a>
                </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-subtitle">{t('footer.services')}</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link" onClick={() => handleNavigation('/')}>{t('footer.newsSearch')}</Link></li>
              <li><Link to="/search" className="footer-link" onClick={() => handleNavigation('/search')}>{t('footer.categoryNews')}</Link></li>
              <li><a href="#" className="footer-link" onClick={() => handleLinkClick('#')}>{t('footer.popularSearch')}</a></li>
              <li><a href="#" className="footer-link" onClick={() => handleLinkClick('#')}>{t('footer.realtimeNews')}</a></li>
              <li><a href="#" className="footer-link" onClick={() => handleLinkClick('#')}>{t('footer.bookmark')}</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-subtitle">{t('footer.support')}</h3>
            <ul className="footer-links">
              <li><Link to="/faq" className="footer-link" onClick={() => handleNavigation('/faq')}>{t('footer.faq')}</Link></li>
              <li><a href="#" className="footer-link" onClick={() => handleLinkClick('#')}>{t('footer.customerCenter')}</a></li>
              <li><Link to="/contact" className="footer-link" onClick={() => handleNavigation('/contact')}>{t('footer.suggestion')}</Link></li>
              <li><Link to="/contact" className="footer-link" onClick={() => handleNavigation('/contact')}>{t('footer.bugReport')}</Link></li>
              <li><Link to="/contact" className="footer-link" onClick={() => handleNavigation('/contact')}>{t('footer.contact')}</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-subtitle">{t('footer.policies')}</h3>
            <ul className="footer-links">
              <li><Link to="/terms" className="footer-link" onClick={() => handleNavigation('/terms')}>{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="footer-link" onClick={() => handleNavigation('/privacy')}>{t('footer.privacy')}</Link></li>
              <li><Link to="/copyright" className="footer-link" onClick={() => handleNavigation('/copyright')}>{t('footer.copyright')}</Link></li>
              <li><Link to="/ad-policy" className="footer-link" onClick={() => handleNavigation('/ad-policy')}>{t('footer.newsProvider')}</Link></li>
              <li><Link to="/ad-policy" className="footer-link" onClick={() => handleNavigation('/ad-policy')}>{t('footer.adPolicy')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
          &copy; 2025 Findy News. All rights reserved. | 대표: 팀 프로젝트 | 사업자등록번호: 123-45-67890
          </p>
          <p >부산광역시 부산진구 해동로 100, Findy 빌딩 | 대표전화: 010-1234-5678 | 이메일: qorrudgma@naver.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 