import { useState, useEffect } from "react";
import { settingsAPI } from "../services/api";
import { toast } from "../components/Toast";
import Spinner from "../components/Spinner";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [settingsId, setSettingsId] = useState(null);
  const [signupBonus, setSignupBonus] = useState("");
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [tempBonus, setTempBonus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAll();
      const settingsData = response?.data?.data?.data?.[0];
      if (settingsData) {
        setSettingsId(settingsData._id);
        setSignupBonus(settingsData.worker_signup_bonus?.toString() || "0");
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBonus = async () => {
    try {
      setSaving(true);
      await settingsAPI.update(settingsId, { worker_signup_bonus: tempBonus });
      setSignupBonus(tempBonus);
      setShowBonusModal(false);
      toast.success("Signup bonus updated successfully");
    } catch (error) {
      console.error("Update settings error:", error);
      toast.error(error.response?.data?.message || "Failed to update signup bonus");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Settings</h1>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-5">
            <Spinner />
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 0",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
                  Worker Signup Bonus
                </h3>
                <p style={{ color: "var(--dh-muted)", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
                  Set the bonus amount for new worker registrations
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>₦{signupBonus}</span>
                <button
                  className="btn"
                  onClick={() => {
                    setTempBonus(signupBonus);
                    setShowBonusModal(true);
                  }}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "8px 24px",
                    borderRadius: "8px",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showBonusModal && (
        <div className="drawer-overlay" onClick={() => setShowBonusModal(false)}>
          <div
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">
                  <i className="fas fa-gift"></i> Edit User SignUp Bonus
                </h2>
              </div>
              <button className="drawer-close-btn" onClick={() => setShowBonusModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="drawer-body">
              <div className="form-group">
                <label className="form-label">Bonus Amount (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  value={tempBonus}
                  onChange={(e) => setTempBonus(e.target.value)}
                  min="0"
                  placeholder="Enter bonus amount"
                />
              </div>

              <div className="drawer-footer">
                <button className="btn btn-outline" onClick={() => setShowBonusModal(false)} disabled={saving}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveBonus} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
