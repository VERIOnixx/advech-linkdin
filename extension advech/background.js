// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getToken") {
    // Handle token retrieval
    getAccessToken()
      .then(token => {
        console.log('Token retrieved successfully');
        sendResponse(token);
      })
      .catch(error => {
        console.error('Error getting token:', error);
        sendResponse({ error: error.message });
      });
    return true; // Will respond asynchronously
  }
  
  if (request.type === "makeLinkedInRequest") {
    // Handle API requests
    // Search Profiles API Request
fetch(request.url, {
  method: request.method || 'GET',
  headers: {
    'Authorization': `Bearer ${request.token}`, // Ensure you are sending the correct token here
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(sendResponse) 
.catch(error => {
  console.error('API request error:', error);
  sendResponse({ error: error.message });
});
    return true;
  }
});

async function getAccessToken() {
  const redirectUrl = chrome.identity.getRedirectURL();
  const clientId = '78vlfoy3qalti3';
  const state = Math.random().toString(36).substring(7);
  
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUrl);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('scope', 'openid profile email ');

  console.log('Starting auth flow with URL:', authUrl.toString());

  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl.toString(),
      interactive: true
    });
    console.log('Received response URL:', responseUrl);

    if (!responseUrl) {
      throw new Error('No response URL received');
    }

    const urlParams = new URL(responseUrl).searchParams;
    const receivedState = urlParams.get('state');
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(`LinkedIn OAuth error: ${error}`);
    }

    if (receivedState !== state) {
      throw new Error('State mismatch in OAuth flow');
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

  
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
        client_id: clientId,
        client_secret: 'WPL_AP1.o8bNYWN6SsfMwcyG.GVo3vA==',
      }),
    });
    

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token response error:', errorText);
      throw new Error(`Token request failed: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Access token received successfully');
    return tokenData.access_token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}