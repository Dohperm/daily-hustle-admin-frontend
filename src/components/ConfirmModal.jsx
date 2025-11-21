export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
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
        
        <div className="d-flex gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}