import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './ScrollToTopButton.css';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

//   // 스크롤 위치를 감지하여 버튼 표시/숨김 결정
//   useEffect(() => {
//     const toggleVisibility = () => {
//       if (window.pageYOffset > 0) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }
//     };

//     window.addEventListener('scroll', toggleVisibility);

//     return () => {
//       window.removeEventListener('scroll', toggleVisibility);
//     };
//   }, []);

  // 화면 최상단으로 부드럽게 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    // <>
    //   {isVisible && (
        <button 
          className="scroll-to-top-button"
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )};
    // </>
//   );
// };

export default ScrollToTopButton; 