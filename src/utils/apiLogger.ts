interface LogData {
  method: string;
  url: string;
  status?: number;
  requestData?: any;
  responseData?: any;
  error?: string;
  message: string;
}

let originalFetch: typeof fetch;
let isWrapperInstalled = false;

export const logApiCall = async (logData: LogData) => {
  try {
    // Use original fetch to avoid infinite recursion
    const fetchToUse = originalFetch || fetch;
    await fetchToUse('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: logData.status && logData.status >= 400 ? 'error' : 'success',
        method: logData.method,
        url: logData.url,
        status: logData.status,
        message: logData.message,
        data: {
          request: logData.requestData,
          response: logData.responseData
        },
        error: logData.error
      }),
    });
  } catch (error) {
    console.error('Failed to log API call:', error);
  }
};

export const createApiWrapper = (fetchFunc: typeof fetch) => {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Skip logging for our own logging API to prevent infinite recursion
    if (url.includes('/api/logs')) {
      return fetchFunc(input, init);
    }
    
    const method = init?.method || 'GET';
    let requestData = null;
    
    try {
      if (init?.body) {
        requestData = JSON.parse(init.body.toString());
      }
    } catch {
      requestData = init?.body ? init.body.toString() : null;
    }
    
    const startTime = Date.now();
    
    try {
      await logApiCall({
        method,
        url,
        message: `Starting ${method} request to ${url}`,
        requestData
      });

      const response = await fetchFunc(input, init);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      let responseData;
      try {
        const clonedResponse = response.clone();
        const text = await clonedResponse.text();
        responseData = text ? JSON.parse(text) : null;
      } catch {
        try {
          responseData = await response.clone().text();
        } catch {
          responseData = 'Unable to read response';
        }
      }

      await logApiCall({
        method,
        url,
        status: response.status,
        message: `${method} ${url} completed in ${duration}ms`,
        requestData,
        responseData
      });

      return response;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      await logApiCall({
        method,
        url,
        message: `${method} ${url} failed after ${duration}ms`,
        requestData,
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  };
};

export const installApiWrapper = () => {
  if (typeof window === 'undefined' || isWrapperInstalled) {
    return;
  }
  
  originalFetch = window.fetch;
  window.fetch = createApiWrapper(originalFetch);
  isWrapperInstalled = true;
  console.log('API wrapper installed successfully');
};