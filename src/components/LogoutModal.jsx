export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="card" style={{ width: '400px', maxWidth: '90vw' }}>
        <h3 className="card-title text-center mb-4">Confirm Logout</h3>
        <p className="text-center text-muted mb-4">
          Are you sure you want to logout?
        </p>
        
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
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}