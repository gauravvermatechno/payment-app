"use client";

import { useState, useEffect, useRef } from "react";

interface LogEntry {
  type: string;
  message: string;
  timestamp: string;
  method?: string;
  url?: string;
  status?: number;
  data?: any;
  error?: string;
}

export default function ApiLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8080');
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          console.log('Connected to logging WebSocket');
        };

        ws.onmessage = (event) => {
          try {
            const logEntry: LogEntry = JSON.parse(event.data);
            setLogs(prev => [...prev, logEntry]);
          } catch (error) {
            console.error('Error parsing log message:', error);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log('Disconnected from logging WebSocket');
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (type: string, status?: number) => {
    if (type === 'error' || (status && status >= 400)) return 'text-red-600 bg-red-50';
    if (type === 'success' || (status && status >= 200 && status < 300)) return 'text-green-600 bg-green-50';
    if (type === 'warning') return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const formatLogData = (data: any) => {
    if (!data) return '';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">API Logs</h3>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Clear
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="h-80 overflow-y-auto p-4 bg-gray-50">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No logs yet. API calls will appear here in real-time.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className={`p-3 rounded text-sm border-l-4 ${getLogColor(log.type, log.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{log.type.toUpperCase()}</span>
                        {log.method && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{log.method}</span>}
                        {log.status && (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            log.status >= 400 ? 'bg-red-100 text-red-800' :
                            log.status >= 200 ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.status}
                          </span>
                        )}
                      </div>
                      <div className="mb-2">{log.message}</div>
                      {log.url && <div className="text-xs text-gray-600 mb-1">URL: {log.url}</div>}
                      {log.data && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                            View Data
                          </summary>
                          <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                            {formatLogData(log.data)}
                          </pre>
                        </details>
                      )}
                      {log.error && (
                        <div className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded">
                          Error: {log.error}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}