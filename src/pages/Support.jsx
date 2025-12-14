import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Spinner from "../components/Spinner";

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Dummy data
      const dummyTickets = [
        {
          _id: '6789abc123def456',
          user: { name: 'John Doe', email: 'john@example.com' },
          subject: 'Payment not received',
          status: 'open',
          priority: 'high',
          createdAt: new Date().toISOString()
        },
        {
          _id: '6789abc123def457',
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          subject: 'Task submission issue',
          status: 'in_progress',
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '6789abc123def458',
          user: { name: 'Mike Johnson', email: 'mike@example.com' },
          subject: 'Account verification problem',
          status: 'resolved',
          priority: 'low',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setTickets(dummyTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || ticket.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Support Tickets</h1>
        <span className="badge badge-primary">{filteredTickets.length}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search tickets..."
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
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>User</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <Spinner />
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No tickets found</td>
                </tr>
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket._id} onClick={() => navigate(`/support/${ticket._id}`)} style={{ cursor: 'pointer' }}>
                  <td>#{ticket._id.slice(-6)}</td>
                  <td>{ticket.user?.name || 'N/A'}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ticket.subject}
                  </td>
                  <td>
                    <span className={`badge ${
                      ticket.status === 'open' ? 'badge-warning' :
                      ticket.status === 'in_progress' ? 'badge-primary' :
                      ticket.status === 'resolved' ? 'badge-success' :
                      'badge-secondary'
                    }`}>
                      {ticket.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      ticket.priority === 'high' ? 'badge-danger' :
                      ticket.priority === 'medium' ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/support/${ticket._id}`); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
