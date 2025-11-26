import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import OTPModal from "../components/OTPModal";
import { toast } from "../components/Toast";

export default function Login() {
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const { login, validateLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(credentials.identifier, credentials.password);
      if (result.success && result.requiresOTP) {
        setOtpMessage(result.message);
        setShowOTP(true);
      } else if (!result.success) {
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp) => {
    setLoading(true);
    
    try {
      const result = await validateLogin(credentials.identifier, credentials.password, otp);
      if (!result.success) {
        toast.error(result.message || "OTP validation failed");
        return false;
      }
      toast.success("Login successful!");
      return true;
    } catch (err) {
      toast.error("An error occurred during OTP validation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--dh-bg-gradient)' }}>
      <div className="card" style={{ width: "400px", maxWidth: "90vw" }}>
        <div className="text-center mb-4">
          <h2 className="card-title text-primary">Daily Hustle Admin</h2>
          <p className="text-muted">Administration Portal</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={credentials.identifier}
              onChange={(e) => setCredentials(prev => ({ ...prev, identifier: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary text-center"
            style={{ width: '100%', fontFamily: 'Poppins, system-ui, sans-serif' }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      
      <OTPModal 
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={handleOTPVerify}
        message={otpMessage}
        loading={loading}
      />
    </div>
  );
}