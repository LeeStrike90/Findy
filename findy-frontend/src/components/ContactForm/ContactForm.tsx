import React, { useState, useEffect } from 'react';
import './ContactForm.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요';
    }

    if (!formData.message.trim()) {
      newErrors.message = '메시지를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // mailto 링크를 사용하여 이메일 클라이언트 열기
        const mailtoLink = `mailto:qorrudgma@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`이름: ${formData.name}\n이메일: ${formData.email}\n\n${formData.message}`)}`;
        
        console.log("메일 링크:", mailtoLink); // 디버깅용 로그
        
        // window.open 대신 직접 location.href 사용
        window.location.href = mailtoLink;
        
        // 폼 제출 완료 처리
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });

          // 5초 후 제출 완료 메시지 숨기기
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        }, 1000);
      } catch (error) {
        console.error("mailto 링크 오류:", error);
        alert("이메일 앱을 여는 데 문제가 발생했습니다. 내용 복사하기 버튼을 사용해 주세요.");
        setIsSubmitting(false);
      }
    }
  };

  // 폼 직접 복사 핸들러 (클립보드에 내용 복사)
  const handleCopyContent = () => {
    const content = `
이름: ${formData.name || '이름 없음'}
이메일: ${formData.email || '이메일 없음'}
제목: ${formData.subject || '제목 없음'}

${formData.message || '내용 없음'}
    `.trim();

    navigator.clipboard.writeText(content)
      .then(() => {
        alert('문의 내용이 클립보드에 복사되었습니다. 이메일 클라이언트에 붙여넣기 하세요.');
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드 복사에 실패했습니다. 내용을 직접 복사해주세요.');
      });
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">문의하기</h1>
        <p className="contact-description">
          Findy 서비스에 대한 질문이나 제안이 있으시면 아래 양식을 통해 문의해주세요.
          빠른 시일 내에 답변 드리겠습니다.
        </p>

        {isSubmitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>문의가 성공적으로 처리되었습니다!</h3>
            <p>이메일 클라이언트가 열렸습니다. 빠른 시일 내에 답변 드리겠습니다.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일 주소를 입력하세요"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subject">제목</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="문의 제목을 입력하세요"
                className={errors.subject ? 'error' : ''}
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">문의 내용</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="문의 내용을 상세히 작성해주세요"
                className={errors.message ? 'error' : ''}
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '이메일 앱으로 문의하기'}
              </button>
            </div>

            <div className="fallback-notice">
              <p>이메일 앱이 자동으로 열리지 않는 경우, 아래 버튼을 클릭하여 내용을 복사한 후 직접 이메일을 보내주세요.</p>
              <button 
                type="button" 
                className="fallback-button"
                onClick={handleCopyContent}
              >
                내용 복사하기
              </button>
            </div>

            <div className="direct-email">
              <p>
                또는 <a href="mailto:qorrudgma@gmail.com">qorrudgma@gmail.com</a>으로 직접 이메일을 보내주세요.
              </p>
            </div>
          </form>
        )}

        <div className="contact-info">
          <h3>문의 안내</h3>
          <ul>
            <li>일반적인 질문은 <a href="/faq">FAQ 페이지</a>를 먼저 확인해 보세요.</li>
            <li>긴급한 문의는 직접 이메일로 연락 주시면 더 빠른 답변이 가능합니다.</li>
            <li>서비스 이용 중 발생한 오류는 가능한 자세히 알려주시면 도움이 됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactForm; 