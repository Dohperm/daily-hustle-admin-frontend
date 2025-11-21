import { useState, useRef, useEffect } from 'react';

export default function OTPModal({ isOpen, onClose, onVerify }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo - any OTP works
    setTimeout(() => {
      onVerify();
      setLoading(false);
      setOtp(['', '', '', '', '', '']);
    }, 1000);
  };

  const handleResend = async () => {
    setResendLoading(true);
    // Demo resend
    setTimeout(() => {
      setResendLoading(false);
      setShowResendSuccess(true);
      setTimeout(() => setShowResendSuccess(false), 3000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Poppins, system-ui, sans-serif'
    }}>
      <div className="card" style={{ width: '400px', maxWidth: '90vw', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
        <h3 className="card-title text-center mb-2">Check your email</h3>
        <p className="text-center text-muted mb-4">
          Enter the verification code sent to your email to access your account.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength="1"
                style={{
                  width: '50px',
                  height: '50px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  border: '2px solid var(--dh-border)',
                  borderRadius: '8px',
                  background: 'var(--dh-card-bg)',
                  color: 'var(--dh-text)',
                  fontFamily: 'Poppins, system-ui, sans-serif'
                }}
                className="form-control"
              />
            ))}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || otp.some(digit => !digit)}
            style={{ 
              width: '100%', 
              marginBottom: '1rem',
              fontFamily: 'Poppins, system-ui, sans-serif'
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p className="text-center text-muted">
          Didn't receive a mail? {' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--dh-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: 'Poppins, system-ui, sans-serif'
            }}
          >
            {resendLoading ? 'Sending...' : 'Resend'}
          </button>
        </p>
        
        {showResendSuccess && (
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--dh-success)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }}>
            OTP resent to your email
          </div>
        )}
      </div>
    </div>
  );
}