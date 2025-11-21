import { useState, useEffect } from "react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([
    { id: 'SPY-UjmqUZNAKCTbzaZDGqyUkSGrq', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 1000.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-UjmqDEsRyGyCDOVWEZUAhOA3T4Gy', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-eQjczLNzHCznyVHLkNRdUCpokkeU', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-OqEFRdNzrxBmtZmYmqEjSECTGckJCk', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-ZqZHgcqKcRPDCGGgqWyWMEK3ZBRCn', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 120.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-ScVsLGKMumpBRGnCDxcRBzRBNS', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 200.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-OsrwNJETHmRjGcnUZHmCXMST', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-ZDerGnQkSRXGhTb7SuRgRhcqNty', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-CsxtHmqzxSdxVsxrKTHmvqZPPrMh', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' },
    { id: 'SPY-xSFqNTANWBLPnJcuRyJKWemCRPGLd', user: 'Awwal Olanryl', service: 'Airtime', type: 'Debit', amount: 100.00, status: 'Completed', date: 'Nov 20, 2025' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || transaction.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Transactions</h1>
        <span className="badge badge-primary">{filteredTransactions.length}</span>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search transactions..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <input type="date" className="form-control" placeholder="From Date" style={{ maxWidth: '150px' }} />
          <input type="date" className="form-control" placeholder="To Date" style={{ maxWidth: '150px' }} />
        </div>
        <button className="btn btn-outline" onClick={() => console.log('Export transactions')}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Users</th>
                <th>Services</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {transaction.id}
                  </td>
                  <td>{transaction.user}</td>
                  <td>{transaction.service}</td>
                  <td>
                    <span style={{ color: '#ef4444' }}>
                      <i className="fas fa-arrow-down"></i> {transaction.type}
                    </span>
                  </td>
                  <td>₦{transaction.amount.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success">
                      <i className="fas fa-check"></i> {transaction.status}
                    </span>
                  </td>
                  <td>{transaction.date}</td>
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