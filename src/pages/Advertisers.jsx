import { useState, useEffect } from "react";

export default function Advertisers() {
  const [advertisers, setAdvertisers] = useState([
    { id: 1, name: 'John Marketing Co.', email: 'john@marketing.com', status: 'active', campaigns: 12, totalSpent: 45000, joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Digital Agency', email: 'sarah@digital.com', status: 'active', campaigns: 8, totalSpent: 32000, joinDate: '2024-01-20' },
    { id: 3, name: 'Mike Brand Solutions', email: 'mike@brand.com', status: 'suspended', campaigns: 3, totalSpent: 8500, joinDate: '2024-02-01' },
    { id: 4, name: 'Lisa Creative Studio', email: 'lisa@creative.com', status: 'active', campaigns: 15, totalSpent: 67000, joinDate: '2024-02-10' },
    { id: 5, name: 'Tech Innovations Ltd', email: 'tech@innovations.com', status: 'active', campaigns: 9, totalSpent: 28000, joinDate: '2024-02-15' },
    { id: 6, name: 'Global Brands Inc', email: 'global@brands.com', status: 'active', campaigns: 22, totalSpent: 89000, joinDate: '2024-02-20' },
    { id: 7, name: 'Local Business Co', email: 'local@business.com', status: 'suspended', campaigns: 2, totalSpent: 4500, joinDate: '2024-02-25' },
    { id: 8, name: 'Premium Ads Agency', email: 'premium@ads.com', status: 'active', campaigns: 18, totalSpent: 72000, joinDate: '2024-03-01' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const fetchAdvertisers = async () => {
    // Demo data - no API call needed
  };

  const handleAdvertiserAction = async (advertiserId, action) => {
    console.log(`${action} advertiser ${advertiserId}`);
  };

  const filteredAdvertisers = advertisers.filter(advertiser => {
    const matchesSearch = advertiser.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advertiser.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || advertiser.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAdvertisers = filteredAdvertisers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const activeAdvertisers = advertisers.filter(a => a.status === 'active').length;
  const suspendedAdvertisers = advertisers.filter(a => a.status === 'suspended').length;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Advertisers</h1>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Active Advertisers</h6>
                  <h3 className="card-title mb-0">{activeAdvertisers}</h3>
                </div>
                <div className="text-success">
                  <i className="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Suspended Advertisers</h6>
                  <h3 className="card-title mb-0">{suspendedAdvertisers}</h3>
                </div>
                <div className="text-warning">
                  <i className="fas fa-pause-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search advertisers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="all">All Filters</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <button className="btn btn-outline" onClick={() => console.log('Export advertisers')}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: '120px' }}>Status</th>
                <th>Campaigns</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAdvertisers.map((advertiser) => (
                <tr key={advertiser.id}>
                  <td>{advertiser.name}</td>
                  <td>{advertiser.email}</td>
                  <td>
                    <span className={`badge ${advertiser.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      <i className={`fas ${advertiser.status === 'active' ? 'fa-check' : 'fa-times'}`}></i> {advertiser.status}
                    </span>
                  </td>
                  <td>{advertiser.campaigns}</td>
                  <td>₦{advertiser.totalSpent.toLocaleString()}</td>
                  <td>{new Date(advertiser.joinDate).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAdvertiserAction(advertiser.id, 'view')}
                      >
                        View
                      </button>
                      <button
                        className={`btn btn-sm ${advertiser.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleAdvertiserAction(advertiser.id, advertiser.status === 'active' ? 'suspend' : 'activate')}
                      >
                        {advertiser.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{ background: 'none', border: 'none', color: 'var(--dh-text)' }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
                  onClick={() => handlePageChange(page)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: currentPage === page ? 'var(--dh-primary)' : 'transparent',
                    color: currentPage === page ? '#fff' : 'var(--dh-text)',
                    border: 'none'
                  }}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{ background: 'none', border: 'none', color: 'var(--dh-text)' }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <select
            className="form-control"
            style={{ width: 'auto' }}
            defaultValue="10"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}