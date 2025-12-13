import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { usersAPI } from "../services/api";
import { toast } from "../components/Toast";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getById(id);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      await usersAPI.update(id, { status: !user.status });
      const newStatus = !user.status;
      setUser({ ...user, status: newStatus });
      toast.success(`Worker ${newStatus ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update worker status');
    }
  };

  if (loading) {
    return <Spinner size="lg" fullScreen />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline" onClick={() => navigate('/users')}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <h1 className="card-title mb-0">Worker Details</h1>
        </div>
      </div>

      {/* Header Card */}
      <div className="card mb-4" style={{ background: 'var(--dh-primary)', color: 'white', padding: '2rem' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {user.photo ? (
              <img src={user.photo} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
            )}
            <div>
              <h4 className="mb-0">{user.email}</h4>
            </div>
          </div>
          <div>
            {user.status ? (
              <button className="btn btn-danger" onClick={handleStatusChange}>
                <i className="fas fa-ban"></i> Suspend Worker
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleStatusChange}>
                <i className="fas fa-check"></i> Activate Worker
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0">Account Information</h5>
              <small className="text-muted">Personal details and identity docs</small>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4 mb-3">
              <small className="text-muted">Full Name</small>
              <p className="mb-0">{user.first_name} {user.last_name}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Email Address</small>
              <p className="mb-0">{user.email}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Phone Number</small>
              <p className="mb-0">{user.phone || 'N/A'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Country</small>
              <p className="mb-0">{user.country || 'N/A'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Registration Date</small>
              <p className="mb-0">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Status</small>
              <p className="mb-0">
                <span className={`badge ${user.status ? 'badge-success' : 'badge-warning'}`}>
                  {user.status ? 'Active' : 'Suspended'}
                </span>
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Username</small>
              <p className="mb-0">@{user.username}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Referral Code</small>
              <p className="mb-0">{user.my_referral_code || 'N/A'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">KYC Status</small>
              <p className="mb-0">
                <span className={`badge ${user.kyc?.is_approved ? 'badge-success' : 'badge-warning'}`}>
                  {user.kyc?.is_approved ? 'Approved' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
