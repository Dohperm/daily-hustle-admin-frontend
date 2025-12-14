import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "../components/Toast";

export default function SupportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      // Dummy data
      const dummyTicket = {
        _id: id,
        user: { name: 'John Doe', email: 'john@example.com' },
        subject: 'Payment not received',
        status: 'open',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            sender_type: 'user',
            message: 'I completed a task but haven\'t received payment yet.',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            sender_type: 'admin',
            message: 'We are looking into this issue. Can you provide the task ID?',
            createdAt: new Date(Date.now() - 1800000).toISOString()
          },
          {
            sender_type: 'user',
            message: 'The task ID is #12345',
            createdAt: new Date(Date.now() - 900000).toISOString()
          }
        ]
      };
      setTicket(dummyTicket);
      setMessages(dummyTicket.messages);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      // Add message to dummy data
      const newMessage = {
        sender_type: 'admin',
        message: message,
        createdAt: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setTicket({ ...ticket, status });
      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <Spinner size="lg" />;
  }

  if (!ticket) {
    return <div className="text-center p-4">Ticket not found</div>;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button onClick={() => navigate('/support')} className="btn btn-outline mb-2">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <h1 className="card-title">Ticket #{ticket._id.slice(-6)}</h1>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-control"
            value={ticket.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div>
          <div className="card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--dh-border)' }}>
              <h3 className="card-title mb-2">{ticket.subject}</h3>
              <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                <i className="fas fa-user"></i> {ticket.user?.name} • {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      background: msg.sender_type === 'admin' ? 'var(--dh-primary)' : 'var(--dh-card-bg)',
                      color: msg.sender_type === 'admin' ? '#fff' : 'var(--dh-text)',
                      border: msg.sender_type === 'admin' ? 'none' : '1px solid var(--dh-border)'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem', opacity: 0.8 }}>
                      {msg.sender_type === 'admin' ? 'Admin' : ticket.user?.name}
                    </div>
                    <div>{msg.message}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--dh-border)' }}>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" className="btn btn-primary" disabled={sending || !message.trim()}>
                  {sending ? <Spinner size="sm" /> : <i className="fas fa-paper-plane"></i>}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="card-title">Ticket Details</h3>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div className="text-muted">Status</div>
                <span className={`badge ${
                  ticket.status === 'open' ? 'badge-warning' :
                  ticket.status === 'in_progress' ? 'badge-primary' :
                  ticket.status === 'resolved' ? 'badge-success' :
                  'badge-secondary'
                }`}>
                  {ticket.status?.replace('_', ' ')}
                </span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div className="text-muted">Priority</div>
                <span className={`badge ${
                  ticket.priority === 'high' ? 'badge-danger' :
                  ticket.priority === 'medium' ? 'badge-warning' :
                  'badge-success'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div className="text-muted">User</div>
                <div>{ticket.user?.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--dh-muted)' }}>{ticket.user?.email}</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div className="text-muted">Created</div>
                <div>{new Date(ticket.createdAt).toLocaleString()}</div>
              </div>
              {ticket.updatedAt && (
                <div>
                  <div className="text-muted">Last Updated</div>
                  <div>{new Date(ticket.updatedAt).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
