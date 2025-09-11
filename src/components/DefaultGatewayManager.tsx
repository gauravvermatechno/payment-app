"use client";

import { useState, useEffect } from "react";

interface DefaultGateway {
  id: string;
  websiteId: number;
  gatewayName: string;
}

interface AvailableGateway {
  name: string;
  currency: string;
  status: string;
}

interface AvailableGatewaysResponse {
  activeGateways: AvailableGateway[];
  inactiveGateways: AvailableGateway[];
  total: number;
}

export default function DefaultGatewayManager() {
  const [defaultGateways, setDefaultGateways] = useState<DefaultGateway[]>([]);
  const [availableGateways, setAvailableGateways] = useState<AvailableGatewaysResponse | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<DefaultGateway | null>(null);
  const [selectedAvailableGateway, setSelectedAvailableGateway] = useState("");
  const [websiteId, setWebsiteId] = useState(17);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDefaultGateways();
    fetchAvailableGateways();
  }, []);

  const fetchDefaultGateways = async () => {
    try {
      const response = await fetch("http://localhost:55621/api/default-gateway");
      const data = await response.json();
      setDefaultGateways(Array.isArray(data) ? data : [data]);
      if (data.length > 0 || !Array.isArray(data)) {
        setSelectedGateway(Array.isArray(data) ? data[0] : data);
      }
    } catch {
      setError("Failed to fetch default gateways");
    }
  };

  const fetchAvailableGateways = async () => {
    try {
      const response = await fetch("http://localhost:55621/api/default-gateway/available-gateways");
      const data = await response.json();
      setAvailableGateways(data);
    } catch {
      setError("Failed to fetch available gateways");
    }
  };

  const updateGateway = async () => {
    if (!selectedGateway || !selectedAvailableGateway.trim()) {
      setError("Please select a gateway and choose a new gateway from available options");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:55621/api/default-gateway/${selectedGateway.websiteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gatewayName: selectedAvailableGateway,
        }),
      });

      if (response.ok) {
        setSuccess("Gateway updated successfully!");
        setSelectedAvailableGateway("");
        await fetchDefaultGateways();
      } else {
        setError("Failed to update gateway");
      }
    } catch {
      setError("Error updating gateway");
    } finally {
      setLoading(false);
    }
  };

  const createGateway = async () => {
    if (!selectedAvailableGateway.trim() || !websiteId) {
      setError("Please enter a website ID and select a gateway");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:55621/api/default-gateway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId: websiteId,
          gatewayName: selectedAvailableGateway,
        }),
      });

      if (response.ok) {
        setSuccess("Gateway created successfully!");
        setSelectedAvailableGateway("");
        await fetchDefaultGateways();
      } else {
        setError("Failed to create gateway");
      }
    } catch {
      setError("Error creating gateway");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md" style={{ background: 'var(--background)', border: '1px solid rgba(128, 128, 128, 0.3)' }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Default Gateway Management</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <div className="space-y-6">
        {/* Current Default Gateways */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Current Default Gateways</h3>
          {defaultGateways.length > 0 ? (
            <div className="space-y-2">
              {defaultGateways.map((gateway) => (
                <div key={gateway.id} className="flex items-center justify-between p-3 border rounded" style={{ borderColor: 'rgba(128, 128, 128, 0.3)', background: 'var(--background)' }}>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>Website ID: {gateway.websiteId}</span>
                    <span className="ml-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Gateway: {gateway.gatewayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGateway(gateway);
                      setSelectedAvailableGateway(gateway.gatewayName);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--foreground)', opacity: 0.6 }}>No default gateways found</p>
          )}
        </div>

        {/* Available Gateways */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Available Gateways</h3>
          {availableGateways ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-green-600 mb-2">Active Gateways ({availableGateways.activeGateways.length})</h4>
                <div className="grid grid-cols-1 gap-2">
                  {availableGateways.activeGateways.map((gateway, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <div>
                        <span className="font-medium text-green-800">{gateway.name}</span>
                        <span className="ml-2 text-sm text-green-600">({gateway.currency} - {gateway.status})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-600 mb-2">Inactive Gateways ({availableGateways.inactiveGateways.length})</h4>
                <div className="grid grid-cols-1 gap-2">
                  {availableGateways.inactiveGateways.map((gateway, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                      <div>
                        <span className="font-medium text-gray-800">{gateway.name}</span>
                        <span className="ml-2 text-sm text-gray-600">({gateway.currency} - {gateway.status})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--foreground)', opacity: 0.6 }}>Loading available gateways...</p>
          )}
        </div>

        {/* Update Selected Gateway */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Update Selected Gateway</h3>
          {selectedGateway && (
            <div className="mb-3 p-3 rounded" style={{ background: 'rgba(128, 128, 128, 0.1)' }}>
              <p style={{ color: 'var(--foreground)' }}><strong>Selected:</strong> Website ID {selectedGateway.websiteId} - {selectedGateway.gatewayName}</p>
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="gatewaySelect" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Choose New Gateway
              </label>
              <select
                id="gatewaySelect"
                value={selectedAvailableGateway}
                onChange={(e) => setSelectedAvailableGateway(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'rgba(128, 128, 128, 0.3)' }}
              >
                <option value="">Select a gateway...</option>
                {availableGateways?.activeGateways.map((gateway, index) => (
                  <option key={index} value={gateway.name}>
                    {gateway.name} ({gateway.currency} - {gateway.status})
                  </option>
                ))}
                {availableGateways?.inactiveGateways.map((gateway, index) => (
                  <option key={index} value={gateway.name}>
                    {gateway.name} ({gateway.currency} - {gateway.status})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={updateGateway}
              disabled={loading || !selectedGateway}
              className={`px-6 py-2 rounded text-white ${
                loading || !selectedGateway
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Gateway"}
            </button>
          </div>
        </div>

        {/* Create New Gateway */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Create New Default Gateway</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="websiteId" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Website ID
              </label>
              <input
                id="websiteId"
                type="number"
                value={websiteId}
                onChange={(e) => setWebsiteId(Number(e.target.value))}
                placeholder="Enter website ID"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'rgba(128, 128, 128, 0.3)' }}
              />
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor="newGatewaySelect" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Choose Gateway
                </label>
                <select
                  id="newGatewaySelect"
                  value={selectedAvailableGateway}
                  onChange={(e) => setSelectedAvailableGateway(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'rgba(128, 128, 128, 0.3)' }}
                >
                  <option value="">Select a gateway...</option>
                  {availableGateways?.activeGateways.map((gateway, index) => (
                    <option key={index} value={gateway.name}>
                      {gateway.name} ({gateway.currency} - {gateway.status})
                    </option>
                  ))}
                  {availableGateways?.inactiveGateways.map((gateway, index) => (
                    <option key={index} value={gateway.name}>
                      {gateway.name} ({gateway.currency} - {gateway.status})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={createGateway}
                disabled={loading}
                className={`px-6 py-2 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Creating..." : "Create Gateway"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchDefaultGateways}
            className="flex-1 px-4 py-2 rounded"
            style={{ background: 'rgba(128, 128, 128, 0.2)', color: 'var(--foreground)' }}
          >
            Refresh Default Gateways
          </button>
          <button
            onClick={fetchAvailableGateways}
            className="flex-1 px-4 py-2 rounded"
            style={{ background: 'rgba(128, 128, 128, 0.2)', color: 'var(--foreground)' }}
          >
            Refresh Available Gateways
          </button>
        </div>
      </div>
    </div>
  );
}