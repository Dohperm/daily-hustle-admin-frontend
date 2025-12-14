import { useState, useEffect } from "react";

export default function ThirdPartySupport() {
  const [selectedProvider, setSelectedProvider] = useState("intercom");
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load third-party script based on provider
    loadThirdPartyScript();
  }, [selectedProvider]);

  const loadThirdPartyScript = () => {
    if (selectedProvider === "intercom") {
      // Intercom integration
      window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
        app_id: "YOUR_INTERCOM_APP_ID"
      };
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://widget.intercom.io/widget/YOUR_INTERCOM_APP_ID`;
      document.body.appendChild(script);
      
      setIsConfigured(true);
    } else if (selectedProvider === "tawk") {
      // Tawk.to integration
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/YOUR_TAWK_ID/default';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);
      
      setIsConfigured(true);
    } else if (selectedProvider === "crisp") {
      // Crisp integration
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "YOUR_CRISP_WEBSITE_ID";
      
      const script = document.createElement('script');
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.body.appendChild(script);
      
      setIsConfigured(true);
    }
  };

  const providers = [
    { id: "intercom", name: "Intercom", icon: "fas fa-comments", color: "#0073e6" },
    { id: "tawk", name: "Tawk.to", icon: "fas fa-comment-dots", color: "#00c853" },
    { id: "crisp", name: "Crisp", icon: "fas fa-comment-alt", color: "#0066ff" },
    { id: "zendesk", name: "Zendesk", icon: "fas fa-headset", color: "#03363d" },
    { id: "freshdesk", name: "Freshdesk", icon: "fas fa-life-ring", color: "#00c9a7" }
  ];

  return (
    <div className="fade-in">
      <h1 className="card-title mb-4">Third-Party Support Integration</h1>

      <div className="card mb-4">
        <h3 className="card-title">Select Support Provider</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {providers.map(provider => (
            <div
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${selectedProvider === provider.id ? provider.color : 'var(--dh-border)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s',
                background: selectedProvider === provider.id ? `${provider.color}10` : 'transparent'
              }}
            >
              <i className={provider.icon} style={{ fontSize: '2rem', color: provider.color, marginBottom: '0.5rem' }}></i>
              <div style={{ fontWeight: '600' }}>{provider.name}</div>
              {selectedProvider === provider.id && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="badge badge-success">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Configuration</h3>
        
        {selectedProvider === "intercom" && (
          <div>
            <div className="form-group">
              <label className="form-label">Intercom App ID</label>
              <input type="text" className="form-control" placeholder="Enter your Intercom App ID" />
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input type="password" className="form-control" placeholder="Enter your API Key" />
            </div>
          </div>
        )}

        {selectedProvider === "tawk" && (
          <div>
            <div className="form-group">
              <label className="form-label">Tawk.to Property ID</label>
              <input type="text" className="form-control" placeholder="Enter your Property ID" />
            </div>
            <div className="form-group">
              <label className="form-label">Widget ID</label>
              <input type="text" className="form-control" placeholder="Enter your Widget ID" />
            </div>
          </div>
        )}

        {selectedProvider === "crisp" && (
          <div>
            <div className="form-group">
              <label className="form-label">Crisp Website ID</label>
              <input type="text" className="form-control" placeholder="Enter your Website ID" />
            </div>
          </div>
        )}

        {selectedProvider === "zendesk" && (
          <div>
            <div className="form-group">
              <label className="form-label">Zendesk Subdomain</label>
              <input type="text" className="form-control" placeholder="yourcompany.zendesk.com" />
            </div>
            <div className="form-group">
              <label className="form-label">API Token</label>
              <input type="password" className="form-control" placeholder="Enter your API Token" />
            </div>
          </div>
        )}

        {selectedProvider === "freshdesk" && (
          <div>
            <div className="form-group">
              <label className="form-label">Freshdesk Domain</label>
              <input type="text" className="form-control" placeholder="yourcompany.freshdesk.com" />
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input type="password" className="form-control" placeholder="Enter your API Key" />
            </div>
          </div>
        )}

        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-primary">
            <i className="fas fa-save"></i> Save Configuration
          </button>
          <button className="btn btn-outline">
            <i className="fas fa-vial"></i> Test Connection
          </button>
        </div>

        {isConfigured && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid #10b981' }}>
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> {providers.find(p => p.id === selectedProvider)?.name} is configured and active
          </div>
        )}
      </div>

      <div className="card mt-4">
        <h3 className="card-title">Integration Guide</h3>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p><strong>Step 1:</strong> Select your preferred support provider from the options above.</p>
          <p><strong>Step 2:</strong> Enter your API credentials from your provider's dashboard.</p>
          <p><strong>Step 3:</strong> Click "Save Configuration" to activate the integration.</p>
          <p><strong>Step 4:</strong> Test the connection to ensure everything is working properly.</p>
          <p className="text-muted mt-3">
            <i className="fas fa-info-circle"></i> The chat widget will appear on your admin dashboard once configured.
          </p>
        </div>
      </div>
    </div>
  );
}
