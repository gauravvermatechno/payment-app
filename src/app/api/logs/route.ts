import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';

let wss: WebSocketServer | null = null;

const getWebSocketServer = () => {
  if (!wss) {
    wss = new WebSocketServer({ port: 8080 });
    console.log('WebSocket server started on port 8080');
    
    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to logging server',
        timestamp: new Date().toISOString()
      }));
    });
  }
  return wss;
};

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    const wss = getWebSocketServer();
    
    const logMessage = {
      type: 'api_log',
      ...logData,
      timestamp: new Date().toISOString()
    };

    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(logMessage));
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error broadcasting log:', error);
    return Response.json({ error: 'Failed to broadcast log' }, { status: 500 });
  }
}

export async function GET() {
  const wss = getWebSocketServer();
  return Response.json({ 
    connected: wss.clients.size,
    status: 'WebSocket server running on port 8080'
  });
}