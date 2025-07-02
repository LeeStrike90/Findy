import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SidebarProvider } from './contexts/SidebarContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';
import SearchPage from './components/SearchPage/SearchPage';
import TermsOfService from './components/TermsOfService/TermsOfService';
import CopyrightPolicy from './components/CopyrightPolicy/CopyrightPolicy';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import AdPolicy from './components/AdPolicy/AdPolicy';
import FAQ from './components/FAQ/FAQ';
import FAQDetail from './components/FAQDetail/FAQDetail';
import ContactForm from './components/ContactForm/ContactForm';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import SettingsButton from './components/SettingsButton/SettingsButton';
import LeftSidebarWrapper from './components/LeftSidebar/LeftSidebarWrapper';
import RightSidebar from './components/RightSidebar/RightSidebar';
import './styles/common.css';
import './styles/App.css';

/**
 * 메인 App 컴포넌트
 * 수정사항:
 * - 왼쪽 사이드바 컴포넌트 추가 (실시간 인기기사)
 * - 오른쪽 사이드바 컴포넌트 추가 (언론사 목록)
 * - 양쪽 사이드바가 모든 페이지에서 표시되도록 구성
 * - 다크모드 지원을 위한 ThemeProvider 추가
 */
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <Router>
          <div className="App">
            <Header />
            
            {/* 왼쪽 사이드바 - 실시간 인기기사 */}
            <LeftSidebarWrapper />
            
            {/* 오른쪽 사이드바 - 언론사 목록 */}
            <RightSidebar />
            
            <main className="main-container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/copyright" element={<CopyrightPolicy />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/ad-policy" element={<AdPolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/faq/detail/:id" element={<FAQDetail />} />
                <Route path="/contact" element={<ContactForm />} />
              </Routes>
            </main>
            <Footer />
            <ScrollToTopButton />
            <SettingsButton />
          </div>
        </Router>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 