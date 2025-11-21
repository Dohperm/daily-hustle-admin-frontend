import { useState } from 'react';

export default function InputModal({ isOpen, onClose, onConfirm, title, message, placeholder }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onConfirm(input.trim());
      setInput('');
    }
  };

  const handleClose = () => {
    setInput('');
    onClose();
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
      <div className="card" style={{ width: '400px', maxWidth: '90vw' }}>
        <h3 className="card-title text-center mb-4">{title}</h3>
        <p className="text-center text-muted mb-4">{message}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="d-flex gap-3">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}