import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { advertisersAPI } from "../services/api";
import { toast } from "../components/Toast";

export default function AdvertiserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertiser, setAdvertiser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertiserDetail();
  }, [id]);

  const fetchAdvertiserDetail = async () => {
    try {
      setLoading(true);
      const response = await advertisersAPI.getById(id);
      setAdvertiser(response.data.data);
    } catch (error) {
      console.error('Error fetching advertiser details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      await advertisersAPI.update(id, { status: !advertiser.status });
      const newStatus = !advertiser.status;
      setAdvertiser({ ...advertiser, status: newStatus });
      toast.success(`Employer ${newStatus ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      console.error('Error updating advertiser status:', error);
      toast.error('Failed to update employer status');
    }
  };

  if (loading) {
    return <Spinner size="lg" fullScreen />;
  }

  if (!advertiser) {
    return <div>Advertiser not found</div>;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline" onClick={() => navigate('/advertisers')}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <h1 className="card-title mb-0">Employer Details</h1>
        </div>
      </div>

      {/* Header Card */}
      <div className="card mb-4" style={{ background: 'var(--dh-primary)', color: 'white', padding: '2rem' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {advertiser.photo ? (
              <img src={advertiser.photo} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {advertiser.first_name?.[0]}{advertiser.last_name?.[0]}
              </div>
            )}
            <div>
              <h4 className="mb-0">{advertiser.email}</h4>
            </div>
          </div>
          <div>
            {advertiser.status ? (
              <button className="btn btn-danger" onClick={handleStatusChange}>
                <i className="fas fa-ban"></i> Suspend Employer
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleStatusChange}>
                <i className="fas fa-check"></i> Activate Employer
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
              <p className="mb-0">{advertiser.first_name} {advertiser.last_name}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Email Address</small>
              <p className="mb-0">{advertiser.email}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Phone Number</small>
              <p className="mb-0">{advertiser.phone || 'N/A'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Country</small>
              <p className="mb-0">{advertiser.country || 'N/A'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Registration Date</small>
              <p className="mb-0">{new Date(advertiser.createdAt || advertiser.date).toLocaleDateString()}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Status</small>
              <p className="mb-0">
                <span className={`badge ${advertiser.status ? 'badge-success' : 'badge-warning'}`}>
                  {advertiser.status ? 'Active' : 'Suspended'}
                </span>
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">Username</small>
              <p className="mb-0">@{advertiser.username}</p>
            </div>
            <div className="col-md-4 mb-3">
              <small className="text-muted">KYC Status</small>
              <p className="mb-0">
                <span className={`badge ${advertiser.kyc?.is_approved ? 'badge-success' : 'badge-warning'}`}>
                  {advertiser.kyc?.is_approved ? 'Approved' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
