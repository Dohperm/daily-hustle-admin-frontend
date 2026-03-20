import { useState, useRef, useEffect } from "react";
import Spinner from "../components/Spinner";
import { notificationBroadcastAPI, usersAPI, advertisersAPI, notificationsAPI } from "../services/api";
import { toast } from "../components/Toast";

export default function NotificationBroadcast() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showIndividualDrawer, setShowIndividualDrawer] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    message: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetApp: [],
    notificationType: [],
    schedulingStrategy: "",
    customDays: "",
  });

  const [individualFormData, setIndividualFormData] = useState({
    targetApp: "",
    selectedUsers: [],
    notificationType: [],
    title: "",
    description: "",
  });

  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [targetSearchQuery, setTargetSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSearchQuery, setNotifSearchQuery] = useState("");
  const notifDropdownRef = useRef(null);

  const [showIndivTargetDropdown, setShowIndivTargetDropdown] = useState(false);
  const [indivTargetSearchQuery, setIndivTargetSearchQuery] = useState("");
  const indivTargetDropdownRef = useRef(null);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const userDropdownRef = useRef(null);

  const [showIndivNotifDropdown, setShowIndivNotifDropdown] = useState(false);
  const [indivNotifSearchQuery, setIndivNotifSearchQuery] = useState("");
  const indivNotifDropdownRef = useRef(null);

  const fetchBroadcastDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const response = await notificationBroadcastAPI.getById(id);
      const data = response?.data?.data || null;
      setSelectedBroadcast(data);
      setEditFormData({
        title: data?.title || "",
        message: data?.message || "",
        status: data?.status || "",
      });
      setShowDetailsDrawer(true);
    } catch (error) {
      console.error("Fetch broadcast details error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch broadcast details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRowClick = (broadcast) => {
    fetchBroadcastDetails(broadcast._id);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBroadcast = async () => {
    try {
      setUpdateLoading(true);
      const payload = {
        title: editFormData.title,
        message: editFormData.message,
      };
      if (editFormData.status === "Ended" && selectedBroadcast.status !== "Ended") {
        payload.status = "Ended";
      }
      await notificationBroadcastAPI.update(selectedBroadcast._id, payload);
      toast.success("Broadcast updated successfully");
      setShowDetailsDrawer(false);
      fetchBroadcasts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update broadcast");
    } finally {
      setUpdateLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      setUsersLoading(true);
      const response = await usersAPI.getAdmins({ limitNo: 1000, search: "", status: true });
      const data = response?.data?.data?.data || [];
      setWorkers(data);
    } catch (error) {
      console.error("Fetch workers error:", error);
      toast.error("Failed to fetch workers");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchEmployers = async () => {
    try {
      setUsersLoading(true);
      const response = await advertisersAPI.getAll({ limitNo: 1000, status: true, search: "" });
      const data = response?.data?.data?.data || [];
      setEmployers(data);
    } catch (error) {
      console.error("Fetch employers error:", error);
      toast.error("Failed to fetch employers");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const response = await notificationBroadcastAPI.getAll({
        pageNo: pagination.page,
        limitNo: pagination.limit,
      });
      const apiData = response?.data?.data?.data || [];
      const metadata = response?.data?.data?.metadata || { total: 0, pages: 1 };
      setBroadcasts(apiData);
      setPagination((prev) => ({
        ...prev,
        total: metadata.total,
        pages: metadata.pages,
      }));
    } catch (error) {
      console.error("Fetch broadcasts error:", error);
      setBroadcasts([]);
      setPagination((prev) => ({ ...prev, total: 0, pages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTargetDropdown(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setShowNotifDropdown(false);
      }
      if (
        indivTargetDropdownRef.current &&
        !indivTargetDropdownRef.current.contains(event.target)
      ) {
        setShowIndivTargetDropdown(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        indivNotifDropdownRef.current &&
        !indivNotifDropdownRef.current.contains(event.target)
      ) {
        setShowIndivNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndividualInputChange = (e) => {
    const { name, value } = e.target;
    setIndividualFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTargetAppToggle = (value) => {
    setFormData((prev) => ({
      ...prev,
      targetApp: prev.targetApp.includes(value)
        ? prev.targetApp.filter((v) => v !== value)
        : [...prev.targetApp, value],
    }));
  };

  const handleIndivTargetAppChange = (e) => {
    const value = e.target.value;
    setIndividualFormData((prev) => ({
      ...prev,
      targetApp: value,
      selectedUsers: [],
    }));
    if (value === "worker") {
      fetchWorkers();
    } else if (value === "employer") {
      fetchEmployers();
    }
  };

  const handleNotifTypeToggle = (value) => {
    setFormData((prev) => ({
      ...prev,
      notificationType: prev.notificationType.includes(value)
        ? prev.notificationType.filter((v) => v !== value)
        : [...prev.notificationType, value],
    }));
  };

  const handleIndivNotifTypeToggle = (value) => {
    setIndividualFormData((prev) => ({
      ...prev,
      notificationType: prev.notificationType.includes(value)
        ? prev.notificationType.filter((v) => v !== value)
        : [...prev.notificationType, value],
    }));
  };

  const handleUserToggle = (userId) => {
    setIndividualFormData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  const targetOptions = [
    { value: "worker", label: "Worker" },
    { value: "employer", label: "Employer" },
  ];

  const notifOptions = [
    { value: "email", label: "Email" },
    { value: "inapp", label: "InApp" },
  ];

  const filteredTargetOptions = targetOptions.filter((option) =>
    option.label.toLowerCase().includes(targetSearchQuery.toLowerCase()),
  );

  const filteredNotifOptions = notifOptions.filter((option) =>
    option.label.toLowerCase().includes(notifSearchQuery.toLowerCase()),
  );

  const handleSubmit = async () => {
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        target_app: formData.targetApp.map(
          (app) => app.charAt(0).toUpperCase() + app.slice(1),
        ),
        notification_type: formData.notificationType.map(
          (type) => type.charAt(0).toUpperCase() + type.slice(1),
        ),
        scheduling_strategy: formData.schedulingStrategy
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      };
      await notificationBroadcastAPI.create(payload);
      toast.success("Broadcast created successfully");
      setShowDrawer(false);
      setFormData({
        title: "",
        message: "",
        targetApp: [],
        notificationType: [],
        schedulingStrategy: "",
        customDays: "",
      });
      setShowTargetDropdown(false);
      setTargetSearchQuery("");
      setShowNotifDropdown(false);
      setNotifSearchQuery("");
      fetchBroadcasts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create broadcast",
      );
    }
  };

  const handleIndividualSubmit = async () => {
    try {
      const payload = {
        title: individualFormData.title,
        description: individualFormData.description,
        target_app: individualFormData.targetApp.charAt(0).toUpperCase() + individualFormData.targetApp.slice(1),
        notification_type: individualFormData.notificationType.map(
          (type) => type.charAt(0).toUpperCase() + type.slice(1)
        ),
        recipient_ids: individualFormData.selectedUsers,
      };
      await notificationsAPI.sendToUser(payload);
      toast.success("Notification sent successfully");
      setShowIndividualDrawer(false);
      setIndividualFormData({
        targetApp: "",
        selectedUsers: [],
        notificationType: [],
        title: "",
        description: "",
      });
      setShowIndivTargetDropdown(false);
      setIndivTargetSearchQuery("");
      setShowUserDropdown(false);
      setUserSearchQuery("");
      setShowIndivNotifDropdown(false);
      setIndivNotifSearchQuery("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send notification");
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Notification Broadcast</h1>
      </div>

      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
              All Broadcasts{" "}
              <span style={{ color: "var(--dh-muted)", fontSize: "0.9rem" }}>
                {pagination.total}
              </span>
            </h3>
          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-outline">
              <i className="fas fa-filter"></i> Filter
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowIndividualDrawer(true)}
            >
              <i className="fas fa-user"></i> Send to Individual
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowDrawer(true)}
            >
              <i className="fas fa-plus"></i> Add New Broadcast
            </button>
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            style={{ maxWidth: "300px" }}
          />
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>
                  Title <i className="fas fa-sort"></i>
                </th>
                <th>
                  Target App <i className="fas fa-sort"></i>
                </th>
                <th>
                  Type <i className="fas fa-sort"></i>
                </th>
                <th>
                  Scheduling Strategy <i className="fas fa-sort"></i>
                </th>
                <th>
                  Status <i className="fas fa-sort"></i>
                </th>
                <th>
                  Created Date <i className="fas fa-sort"></i>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <Spinner />
                  </td>
                </tr>
              ) : broadcasts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    No broadcasts found
                  </td>
                </tr>
              ) : (
                broadcasts.map((broadcast) => (
                  <tr 
                    key={broadcast._id} 
                    onClick={() => handleRowClick(broadcast)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{broadcast.title}</td>
                    <td>
                      {Array.isArray(broadcast.target_app)
                        ? broadcast.target_app.join(", ")
                        : broadcast.target_app}
                    </td>
                    <td>
                      {Array.isArray(broadcast.notification_type) ? (
                        broadcast.notification_type.map((type, idx) => (
                          <span
                            key={idx}
                            className="badge badge-primary"
                            style={{ marginRight: "4px" }}
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="badge badge-primary">
                          {broadcast.notification_type}
                        </span>
                      )}
                    </td>
                    <td>{broadcast.scheduling_strategy || "-"}</td>
                    <td>
                      <span
                        className={`badge badge-${broadcast.status === "Active" ? "success" : broadcast.status === "Scheduled" ? "warning" : "danger"}`}
                      >
                        {broadcast.status === "Ended" && (
                          <i className="fas fa-times-circle"></i>
                        )}{" "}
                        {broadcast.status}
                      </span>
                    </td>
                    <td>
                      {new Date(broadcast.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                      <br />
                      <small style={{ color: "var(--dh-muted)" }}>
                        {new Date(broadcast.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        })}
                      </small>
                    </td>
                    <td>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          className="fas fa-ellipsis-v"
                          style={{ color: "var(--dh-text)" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showIndividualDrawer && (
        <div
          className="drawer-overlay"
          onClick={() => setShowIndividualDrawer(false)}
        >
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">
                  <i className="fas fa-user"></i> Send Notification to
                  Individual(s)
                </h2>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setShowIndividualDrawer(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="drawer-body">
              <div className="form-group">
                <label className="form-label">Target App</label>
                <select
                  name="targetApp"
                  className="form-control"
                  value={individualFormData.targetApp}
                  onChange={handleIndivTargetAppChange}
                >
                  <option value="">Select Worker or Employer</option>
                  <option value="worker">Worker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              {/* Select Users multi-select (shown when target app is selected) */}
              {individualFormData.targetApp && (
                <div
                  className="form-group"
                  ref={userDropdownRef}
                  style={{ position: "relative" }}
                >
                  <label className="form-label">
                    {individualFormData.targetApp === "worker"
                      ? "Select Worker"
                      : "Select Employer"}
                  </label>
                  <div
                    className="form-control"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: "46px",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    {individualFormData.selectedUsers.length === 0 ? (
                      <span style={{ color: "#9CA3AF" }}>
                        Select{" "}
                        {individualFormData.targetApp === "worker"
                          ? "Worker"
                          : "Employer"}
                      </span>
                    ) : (
                      <span style={{ color: "var(--dh-text)" }}>
                        {individualFormData.selectedUsers.length} selected
                      </span>
                    )}
                    <i
                      className={`fas fa-chevron-${showUserDropdown ? "up" : "down"}`}
                      style={{ color: "var(--dh-muted)", marginLeft: "auto" }}
                    ></i>
                  </div>
                  {showUserDropdown &&
                    (() => {
                      const pool =
                        individualFormData.targetApp === "worker"
                          ? workers
                          : employers;
                      const filteredPool = pool.filter(
                        (u) => {
                          const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim();
                          const email = u.email || '';
                          return fullName
                            .toLowerCase()
                            .includes(userSearchQuery.toLowerCase()) ||
                          email
                            .toLowerCase()
                            .includes(userSearchQuery.toLowerCase());
                        }
                      );
                      return (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "var(--dh-card-bg)",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            marginTop: "8px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                            zIndex: 1000,
                            padding: "16px",
                            maxHeight: "300px",
                            overflow: "auto",
                          }}
                        >
                          <div
                            style={{
                              marginBottom: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={
                                pool.length > 0 &&
                                pool.every((u) =>
                                  individualFormData.selectedUsers.includes(
                                    u._id,
                                  ),
                                )
                              }
                              ref={(el) => {
                                if (el)
                                  el.indeterminate =
                                    individualFormData.selectedUsers.length >
                                      0 &&
                                    !pool.every((u) =>
                                      individualFormData.selectedUsers.includes(
                                        u._id,
                                      ),
                                    );
                              }}
                              onChange={(e) => {
                                e.stopPropagation();
                                const allSelected = pool.every((u) =>
                                  individualFormData.selectedUsers.includes(
                                    u._id,
                                  ),
                                );
                                setIndividualFormData((prev) => ({
                                  ...prev,
                                  selectedUsers: allSelected
                                    ? []
                                    : pool.map((u) => u._id),
                                }));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                accentColor: "var(--dh-primary)",
                              }}
                            />
                            <div style={{ position: "relative", flex: 1 }}>
                              <input
                                type="text"
                                placeholder="Search..."
                                value={userSearchQuery}
                                onChange={(e) =>
                                  setUserSearchQuery(e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: "100%",
                                  padding: "10px 40px 10px 16px",
                                  border: "1px solid #E5E7EB",
                                  borderRadius: "24px",
                                  outline: "none",
                                  fontSize: "0.95rem",
                                  backgroundColor: "var(--dh-card-bg)",
                                }}
                              />
                              <i
                                className="fas fa-search"
                                style={{
                                  position: "absolute",
                                  right: "16px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#9CA3AF",
                                  fontSize: "0.9rem",
                                }}
                              ></i>
                            </div>
                          </div>
                          {filteredPool.map((user, index, arr) => (
                            <div
                              key={user._id}
                              style={{
                                padding: "14px 16px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                backgroundColor:
                                  individualFormData.selectedUsers.includes(
                                    user._id,
                                  )
                                    ? "#F3F4F6"
                                    : "transparent",
                                borderRadius: "8px",
                                marginBottom:
                                  index < arr.length - 1 ? "4px" : "0",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserToggle(user._id);
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={individualFormData.selectedUsers.includes(
                                  user._id,
                                )}
                                onChange={() => {}}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                  accentColor: "var(--dh-primary)",
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: "1rem",
                                    color: "var(--dh-text)",
                                    fontWeight: 500,
                                  }}
                                >
                                  {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#9CA3AF",
                                    marginTop: "2px",
                                  }}
                                >
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                </div>
              )}

              <div
                className="form-group"
                ref={indivNotifDropdownRef}
                style={{ position: "relative" }}
              >
                <label className="form-label">Notification Type</label>
                <div
                  className="form-control"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    setShowIndivNotifDropdown(!showIndivNotifDropdown)
                  }
                >
                  <span
                    style={{
                      color:
                        individualFormData.notificationType.length === 0
                          ? "#9CA3AF"
                          : "var(--dh-text)",
                    }}
                  >
                    {individualFormData.notificationType.length === 0
                      ? "Select Notification Type"
                      : individualFormData.notificationType
                          .map(
                            (v) =>
                              notifOptions.find((o) => o.value === v)?.label,
                          )
                          .join(", ")}
                  </span>
                  <i
                    className={`fas fa-chevron-${showIndivNotifDropdown ? "up" : "down"}`}
                    style={{ color: "var(--dh-muted)" }}
                  ></i>
                </div>
                {showIndivNotifDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "var(--dh-card-bg)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      marginTop: "8px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          individualFormData.notificationType.length ===
                          notifOptions.length
                        }
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              individualFormData.notificationType.length > 0 &&
                              individualFormData.notificationType.length <
                                notifOptions.length;
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          setIndividualFormData((prev) => ({
                            ...prev,
                            notificationType:
                              prev.notificationType.length ===
                              notifOptions.length
                                ? []
                                : notifOptions.map((o) => o.value),
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "var(--dh-primary)",
                        }}
                      />
                      <div style={{ position: "relative", flex: 1 }}>
                        <input
                          type="text"
                          placeholder=""
                          value={indivNotifSearchQuery}
                          onChange={(e) =>
                            setIndivNotifSearchQuery(e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "100%",
                            padding: "10px 40px 10px 16px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "24px",
                            outline: "none",
                            fontSize: "0.95rem",
                            backgroundColor: "var(--dh-card-bg)",
                          }}
                        />
                        <i
                          className="fas fa-search"
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9CA3AF",
                            fontSize: "0.9rem",
                          }}
                        ></i>
                      </div>
                    </div>
                    {notifOptions
                      .filter((option) =>
                        option.label
                          .toLowerCase()
                          .includes(indivNotifSearchQuery.toLowerCase()),
                      )
                      .map((option, index, arr) => (
                        <div
                          key={option.value}
                          style={{
                            padding: "14px 16px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            backgroundColor:
                              individualFormData.notificationType.includes(
                                option.value,
                              )
                                ? "#F3F4F6"
                                : "transparent",
                            borderRadius: "8px",
                            marginBottom: index < arr.length - 1 ? "4px" : "0",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIndivNotifTypeToggle(option.value);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={individualFormData.notificationType.includes(
                              option.value,
                            )}
                            onChange={() => {}}
                            style={{
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              accentColor: "var(--dh-primary)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "1rem",
                              color: "var(--dh-text)",
                            }}
                          >
                            {option.label}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter Title"
                  value={individualFormData.title}
                  onChange={handleIndividualInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Enter Description"
                  rows="4"
                  value={individualFormData.description}
                  onChange={handleIndividualInputChange}
                />
              </div>

              <div className="drawer-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowIndividualDrawer(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleIndividualSubmit}
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDrawer && (
        <div className="drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">
                  <i className="fas fa-bullhorn"></i> Add New Notification
                  Broadcast
                </h2>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setShowDrawer(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="drawer-body">
              <div className="form-group">
                <label className="form-label">Broadcast Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter Broadcast Title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  placeholder="Enter Message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <div
                className="form-group"
                ref={dropdownRef}
                style={{ position: "relative" }}
              >
                <label className="form-label">Target App</label>
                <div
                  className="form-control"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setShowTargetDropdown(!showTargetDropdown)}
                >
                  <span
                    style={{
                      color:
                        formData.targetApp.length === 0
                          ? "#9CA3AF"
                          : "var(--dh-text)",
                    }}
                  >
                    {formData.targetApp.length === 0
                      ? "Select Worker or Employer"
                      : formData.targetApp
                          .map(
                            (v) =>
                              targetOptions.find((o) => o.value === v)?.label,
                          )
                          .join(", ")}
                  </span>
                  <i
                    className={`fas fa-chevron-${showTargetDropdown ? "up" : "down"}`}
                    style={{ color: "var(--dh-muted)" }}
                  ></i>
                </div>
                {showTargetDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "var(--dh-card-bg)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      marginTop: "8px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "var(--dh-primary)",
                        }}
                      />
                      <div style={{ position: "relative", flex: 1 }}>
                        <input
                          type="text"
                          placeholder=""
                          value={targetSearchQuery}
                          onChange={(e) => setTargetSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "100%",
                            padding: "10px 40px 10px 16px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "24px",
                            outline: "none",
                            fontSize: "0.95rem",
                            backgroundColor: "var(--dh-card-bg)",
                          }}
                        />
                        <i
                          className="fas fa-search"
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9CA3AF",
                            fontSize: "0.9rem",
                          }}
                        ></i>
                      </div>
                    </div>
                    {filteredTargetOptions.map((option, index) => (
                      <div
                        key={option.value}
                        style={{
                          padding: "14px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          backgroundColor: formData.targetApp.includes(
                            option.value,
                          )
                            ? "#F3F4F6"
                            : "transparent",
                          borderRadius: "8px",
                          marginBottom:
                            index < filteredTargetOptions.length - 1
                              ? "4px"
                              : "0",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTargetAppToggle(option.value);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetApp.includes(option.value)}
                          onChange={() => {}}
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            accentColor: "var(--dh-primary)",
                          }}
                        />
                        <span
                          style={{ fontSize: "1rem", color: "var(--dh-text)" }}
                        >
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="form-group"
                ref={notifDropdownRef}
                style={{ position: "relative" }}
              >
                <label className="form-label">Notification Type</label>
                <div
                  className="form-control"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                >
                  <span
                    style={{
                      color:
                        formData.notificationType.length === 0
                          ? "#9CA3AF"
                          : "var(--dh-text)",
                    }}
                  >
                    {formData.notificationType.length === 0
                      ? "Select Notification Type"
                      : formData.notificationType
                          .map(
                            (v) =>
                              notifOptions.find((o) => o.value === v)?.label,
                          )
                          .join(", ")}
                  </span>
                  <i
                    className={`fas fa-chevron-${showNotifDropdown ? "up" : "down"}`}
                    style={{ color: "var(--dh-muted)" }}
                  ></i>
                </div>
                {showNotifDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "var(--dh-card-bg)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      marginTop: "8px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          formData.notificationType.length ===
                          notifOptions.length
                        }
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              formData.notificationType.length > 0 &&
                              formData.notificationType.length <
                                notifOptions.length;
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({
                            ...prev,
                            notificationType:
                              prev.notificationType.length ===
                              notifOptions.length
                                ? []
                                : notifOptions.map((o) => o.value),
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "var(--dh-primary)",
                        }}
                      />
                      <div style={{ position: "relative", flex: 1 }}>
                        <input
                          type="text"
                          placeholder=""
                          value={notifSearchQuery}
                          onChange={(e) => setNotifSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "100%",
                            padding: "10px 40px 10px 16px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "24px",
                            outline: "none",
                            fontSize: "0.95rem",
                            backgroundColor: "var(--dh-card-bg)",
                          }}
                        />
                        <i
                          className="fas fa-search"
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9CA3AF",
                            fontSize: "0.9rem",
                          }}
                        ></i>
                      </div>
                    </div>
                    {filteredNotifOptions.map((option, index) => (
                      <div
                        key={option.value}
                        style={{
                          padding: "14px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          backgroundColor: formData.notificationType.includes(
                            option.value,
                          )
                            ? "#F3F4F6"
                            : "transparent",
                          borderRadius: "8px",
                          marginBottom:
                            index < filteredNotifOptions.length - 1
                              ? "4px"
                              : "0",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotifTypeToggle(option.value);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.notificationType.includes(
                            option.value,
                          )}
                          onChange={() => {}}
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            accentColor: "var(--dh-primary)",
                          }}
                        />
                        <span
                          style={{ fontSize: "1rem", color: "var(--dh-text)" }}
                        >
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Scheduling Strategy</label>
                <select
                  name="schedulingStrategy"
                  className="form-control"
                  value={formData.schedulingStrategy}
                  onChange={handleInputChange}
                >
                  <option value="">Select Scheduling Strategy</option>
                  <option value="once">Once</option>
                  <option value="every_day">Every Day</option>
                  <option value="every_new_week">Every New Week</option>
                  <option value="every_monday">Every Monday</option>
                  <option value="every_tuesday">Every Tuesday</option>
                  <option value="every_wednesday">Every Wednesday</option>
                  <option value="every_thursday">Every Thursday</option>
                  <option value="every_friday">Every Friday</option>
                  <option value="every_saturday">Every Saturday</option>
                  <option value="every_sunday">Every Sunday</option>
                  <option value="every_x_days">Every X Days</option>
                  <option value="every_new_month">Every New Month</option>
                </select>
              </div>

              {formData.schedulingStrategy === "every_x_days" && (
                <div className="form-group">
                  <label className="form-label">Number of Days</label>
                  <input
                    type="number"
                    name="customDays"
                    className="form-control"
                    placeholder="Enter number of days"
                    value={formData.customDays}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              )}

              <div className="drawer-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowDrawer(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Add Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsDrawer && selectedBroadcast && (
        <div className="drawer-overlay" onClick={() => setShowDetailsDrawer(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">
                  <i className="fas fa-info-circle"></i> Broadcast Details
                </h2>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setShowDetailsDrawer(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="drawer-body">
              {detailsLoading ? (
                <div className="text-center py-5">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="4"
                      value={editFormData.message}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target App</label>
                    <div className="form-control" style={{ backgroundColor: '#f9fafb', cursor: 'default' }}>
                      {Array.isArray(selectedBroadcast.target_app)
                        ? selectedBroadcast.target_app.join(", ")
                        : selectedBroadcast.target_app}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notification Type</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Array.isArray(selectedBroadcast.notification_type) ? (
                        selectedBroadcast.notification_type.map((type, idx) => (
                          <span key={idx} className="badge badge-primary">
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="badge badge-primary">
                          {selectedBroadcast.notification_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Scheduling Strategy</label>
                    <div className="form-control" style={{ backgroundColor: '#f9fafb', cursor: 'default' }}>
                      {selectedBroadcast.scheduling_strategy || '-'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    {selectedBroadcast.status === "Ended" ? (
                      <div>
                        <span className="badge badge-danger">
                          Ended
                        </span>
                      </div>
                    ) : (
                      <select
                        name="status"
                        className="form-control"
                        value={editFormData.status}
                        onChange={handleEditInputChange}
                      >
                        <option value={selectedBroadcast.status}>{selectedBroadcast.status}</option>
                        <option value="Ended">Ended</option>
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Created Date</label>
                    <div className="form-control" style={{ backgroundColor: '#f9fafb', cursor: 'default' }}>
                      {new Date(selectedBroadcast.createdAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                      })}
                    </div>
                  </div>

                  {selectedBroadcast.last_sent_date && (
                    <div className="form-group">
                      <label className="form-label">Last Sent Date</label>
                      <div className="form-control" style={{ backgroundColor: '#f9fafb', cursor: 'default' }}>
                        {new Date(selectedBroadcast.last_sent_date).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC',
                        })}
                      </div>
                    </div>
                  )}

                  {selectedBroadcast.next_send_date && (
                    <div className="form-group">
                      <label className="form-label">Next Send Date</label>
                      <div className="form-control" style={{ backgroundColor: '#f9fafb', cursor: 'default' }}>
                        {new Date(selectedBroadcast.next_send_date).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC',
                        })}
                      </div>
                    </div>
                  )}

                  <div className="drawer-footer">
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowDetailsDrawer(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleUpdateBroadcast}
                      disabled={updateLoading}
                    >
                      {updateLoading ? "Updating..." : "Update Broadcast"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
