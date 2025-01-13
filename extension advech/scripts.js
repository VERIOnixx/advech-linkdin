document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const extractDataBtn = document.getElementById('valider-check');
    const nomberProspectInput = document.getElementById("prospects_number");
    const firstPage = document.querySelector('.first-page');
    const secondPage = document.querySelector('.second-page');
    const linkedinLink = document.getElementById("linkedin-link");
    const openAppButton = document.getElementById("open-app");
  
    // LinkedIn Configuration
    const LINKEDIN_CONFIG = {
        clientId: '78vlfoy3qalti3',
        clientSecret: 'WPL_AP1.o8bNYWN6SsfMwcyG.GVo3vA==',
        scope: 'openid profile email r_liteprofile r_emailaddress w_member_social r_fullprofile' // Add this
      };
  
    // Event Listeners
    openAppButton.addEventListener("click", () => {
      chrome.tabs.create({ url: "http://localhost:3000/" });
    });
  
    linkedinLink.addEventListener("click", () => {
      chrome.tabs.create({ url: "https://www.linkedin.com/search/results/people/" });
    });
  
    // Check current tab and update UI
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentUrl = tabs[0].url;
        const baseTargetUrl = "https://www.linkedin.com/search/results/people/";
        const profilTargetUrl ="https://www.linkedin.com/in/"
        
        if ((!currentUrl.includes(baseTargetUrl)) && (!currentUrl.includes(profilTargetUrl))) {
          firstPage.classList.remove('hidden');
          secondPage.classList.add('hidden');
        } else {
          firstPage.classList.add('hidden');
          secondPage.classList.remove('hidden');
        }
      }
    });
  
    async function getLinkedInAccessToken() {
        console.log('Attempting to get LinkedIn access token...');
        try {
          const response = await chrome.runtime.sendMessage({ type: "getToken" });
          console.log('Token response received:', response ? 'Success' : 'Failed');
          if (response.error) {
            console.error('Token error:', response.error);
            throw new Error(response.error);
          }
          return response;
        } catch (error) {
          console.error('Token retrieval error:', error);
          throw new Error(`Failed to get access token: ${error.message}`);
        }
      }
    
      async function searchProfiles(accessToken, count) {
  try {
    const response = await fetch(`https://api.linkedin.com/v2/userinfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API error: ${response.status} ${errorDetails}`);
    }

    const data = await response.json();
    console.log("Search results:", data);
    return data.elements || [];
  } catch (error) {
    console.error("Search failed:", error.message);
    return [];
  }
}


      async function getProfileDetails(accessToken, profileId) {
        console.log(`Fetching details for profile ${profileId}...`);
        try {
          const response = await chrome.runtime.sendMessage({
            type: "makeLinkedInRequest",
            url: `https://api.linkedin.com/v2/people/${profileId}`,
            token: accessToken
          });
          
          console.log('Profile details response:', response);
          
          if (response.error) {
            console.error('Profile details error:', response.error);
            throw new Error(response.error);
          }
          
          return response;
        } catch (error) {
          console.error('Profile details error:', error);
          throw new Error(`Failed to get profile details: ${error.message}`);
        }
      }
    
      async function fetchLinkedInProfiles(numberOfProfiles) {
        console.log(`Starting fetch for ${numberOfProfiles} profiles...`);
        try {
          const accessToken = await getLinkedInAccessToken();
          console.log('Access token obtained successfully');
        
          const profiles = [];
          const count = Math.min(numberOfProfiles, 10);
        
          console.log(`Searching for ${count} profiles...`);
          const elements = await searchProfiles(accessToken, count);
          console.log(`Found ${elements.length} profiles in search`);
        
          for (const element of elements) {
            if (profiles.length >= numberOfProfiles) break;
            
            try {
              console.log(`Fetching details for profile ${element.id}`);
              const profileDetails = await getProfileDetails(accessToken, element.id);
              
              profiles.push({
                name: `${profileDetails.firstName} ${profileDetails.lastName}`,
                title: profileDetails.headline || 'N/A',
                profileId: profileDetails.id,
                profileLink: `https://www.linkedin.com/in/${profileDetails.vanityName || profileDetails.id}`
              });
              
              console.log(`Successfully added profile: ${profileDetails.firstName} ${profileDetails.lastName}`);
            } catch (error) {
              console.error(`Failed to fetch details for profile ${element.id}:`, error);
            }
          }
        
          console.log(`Successfully fetched ${profiles.length} profiles`);
          return profiles;
        } catch (error) {
          console.error('Profile fetching failed:', error);
          throw error;
        }
      }
      
    
      // Modified extract data button handler
      extractDataBtn.addEventListener('click', async () => {
        const numberOfProfiles = parseInt(nomberProspectInput.value, 10);
        console.log(`Extract button clicked. Requested profiles: ${numberOfProfiles}`);
    
        if (isNaN(numberOfProfiles) || numberOfProfiles <= 0) {
          alert("Please enter a valid number of prospects.");
          return;
        }
    
        try {
          // Add loading indicator
          extractDataBtn.disabled = true;
          extractDataBtn.textContent = 'Loading...';
          
          const profiles = await fetchLinkedInProfiles(numberOfProfiles);
          
          if (profiles.length === 0) {
            throw new Error('No profiles were retrieved');
          }
          
          displayProfiles(profiles);
        } catch (error) {
          console.error('Extraction failed:', error);
          alert(`Failed to fetch profiles: ${error.message}`);
        } finally {git init
          // Reset button
          extractDataBtn.disabled = false;
          extractDataBtn.textContent = 'Extract Data';
        }
      });
  
    // Display Profiles Function
    function displayProfiles(profiles) {
      const resultsContainer = document.createElement('div');
      resultsContainer.className = 'results-container';
  
      profiles.forEach(profile => {
        const profileElement = document.createElement('div');
        profileElement.className = 'profile-item';
        profileElement.innerHTML = `
          <h3>${profile.name}</h3>
          <p>Title: ${profile.title}</p>gy
          <a href="${profile.profileLink}" target="_blank">View Profile</a>
        `;
        resultsContainer.appendChild(profileElement);
      });
  
      const existingResults = document.querySelector('.results-container');
      if (existingResults) {
        existingResults.remove();
      }
      secondPage.appendChild(resultsContainer);
    }
  });