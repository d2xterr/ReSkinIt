const DISCORD_USER_ID = '1106915426396540938';
const LANYARD_REST = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
const LANYARD_WS = 'wss://api.lanyard.rest/socket';

// DOM Elements
const video = document.getElementById('bgVideo');
const playToggle = document.getElementById('playToggle');
const muteToggle = document.getElementById('muteToggle');
const displayName = document.getElementById('displayName');
const discordAvatar = document.getElementById('discordAvatar');
const activityLine = document.getElementById('activityLine');
const statusLine = document.getElementById('statusLine');
const enterOverlay = document.getElementById('enterOverlay');
const statusIndicator = document.getElementById('statusIndicator');
const activityImageWrap = document.getElementById('activityImage');
const activityImg = document.getElementById('activityImg');

let hasEntered = false;

// Enter Site Functionality
enterOverlay.addEventListener('click', async () => {
  if (hasEntered) return;
  hasEntered = true;
  
  enterOverlay.classList.add('hidden');
  
  // Start video with audio
  try {
    video.muted = false;
    await video.play();
    playToggle.textContent = 'Pause';
    muteToggle.textContent = 'Mute';
  } catch (error) {
    console.warn('Autoplay failed:', error);
    // Fallback: try muted autoplay
    video.muted = true;
    try {
      await video.play();
      playToggle.textContent = 'Pause';
      muteToggle.textContent = 'Unmute';
    } catch (fallbackError) {
      console.warn('Muted autoplay also failed:', fallbackError);
      playToggle.textContent = 'Play';
      muteToggle.textContent = 'Unmute';
    }
  }
});

// Video Controls
playToggle.addEventListener('click', async () => {
  if (video.paused) {
    try {
      await video.play();
      playToggle.textContent = 'Pause';
    } catch (error) {
      console.warn('Play failed:', error);
    }
  } else {
    video.pause();
    playToggle.textContent = 'Play';
  }
});

muteToggle.addEventListener('click', () => {
  video.muted = !video.muted;
  muteToggle.textContent = video.muted ? 'Unmute' : 'Mute';
});

// Discord Status Management
function updateStatusIndicators(status) {
  const statusClasses = ['online', 'idle', 'dnd', 'offline'];
  
  // Remove all status classes from main status indicator
  statusClasses.forEach(cls => {
    statusIndicator.classList.remove(cls);
  });
  
  // Add current status class to main indicator
  const currentStatus = status || 'offline';
  statusIndicator.classList.add(currentStatus);
}

// Set User Information
function setUserInfo(data) {
  const discord = data.discord_user || {};
  
  if (discord.username) {
    displayName.textContent = discord.username;
  }
  
  const avatarUrl = discord.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${discord.avatar}.png?size=512`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;
  
  discordAvatar.src = avatarUrl;
}

// Set Discord Presence
function setPresence(presenceData) {
  console.log('Setting presence:', presenceData); // Debug log
  
  if (!presenceData) {
    activityLine.textContent = 'Offline';
    statusLine.textContent = '';
    updateStatusIndicators('offline');
    hideActivityImage();
    return;
  }

  const { discord_status, activities, listening_to_spotify, spotify } = presenceData;
  
  // Update status indicators
  console.log('Discord status:', discord_status); // Debug log
  updateStatusIndicators(discord_status);
  
  // Update status text
  statusLine.textContent = capitalizeStatus(discord_status);

  // Handle Spotify listening
  if (listening_to_spotify && spotify) {
    const songName = spotify.song || 'Unknown Song';
    const artistName = spotify.artist || 'Unknown Artist';
    
    activityLine.textContent = `${songName}`;
    statusLine.textContent = `by ${artistName} • Spotify`;
    
    // Show Spotify album art if available
    if (spotify.album_art_url) {
      showActivityImage(spotify.album_art_url);
    } else {
      hideActivityImage();
    }
    return;
  }

  // Handle other activities
  if (activities && activities.length > 0) {
    console.log('Activities:', activities); // Debug log
    
    // Find primary activity (non-listening activity first, or first activity)
    const primaryActivity = activities.find(a => a.type !== 2) || activities[0];
    
    let mainText = '';
    let subText = '';
    
    // Get app name
    const appName = primaryActivity.name || 'Unknown App';
    
    // Set main text based on activity details
    if (primaryActivity.details) {
      mainText = primaryActivity.details;
    } else {
      mainText = appName;
    }
    
    // Set sub text based on activity type and state
    switch (primaryActivity.type) {
      case 0: // Playing
        if (primaryActivity.state) {
          subText = `${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Playing ${appName}`;
        }
        break;
      case 2: // Listening
        if (primaryActivity.state) {
          subText = `by ${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Listening • ${appName}`;
        }
        break;
      case 3: // Watching
        if (primaryActivity.state) {
          subText = `${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Watching ${appName}`;
        }
        break;
      case 5: // Competing
        if (primaryActivity.state) {
          subText = `${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Competing • ${appName}`;
        }
        break;
      default:
        if (primaryActivity.state) {
          subText = `${primaryActivity.state} • ${appName}`;
        } else {
          subText = appName;
        }
    }
    
    activityLine.textContent = mainText;
    statusLine.textContent = subText;
    
    // Show activity image if available
    if (primaryActivity.assets) {
      let imageUrl = null;
      
      // Try large image first, then small image
      if (primaryActivity.assets.large_image) {
        imageUrl = getAssetImageUrl(primaryActivity.assets.large_image, primaryActivity.application_id);
      } else if (primaryActivity.assets.small_image) {
        imageUrl = getAssetImageUrl(primaryActivity.assets.small_image, primaryActivity.application_id);
      }
      
      if (imageUrl) {
        showActivityImage(imageUrl);
      } else {
        hideActivityImage();
      }
    } else {
      hideActivityImage();
    }
  } else {
    activityLine.textContent = 'No Activity';
    statusLine.textContent = capitalizeStatus(discord_status);
    hideActivityImage();
  }
}

// Helper function to capitalize status
function capitalizeStatus(status) {
  if (!status) return 'Offline';
  
  switch(status) {
    case 'online': return 'Online';
    case 'idle': return 'Away';
    case 'dnd': return 'Do Not Disturb';
    case 'offline': return 'Offline';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// Helper function to get asset image URL
function getAssetImageUrl(assetId, applicationId) {
  if (assetId.startsWith('mp:')) {
    // Media player image
    return `https://media.discordapp.net/${assetId.slice(3)}`;
  } else if (assetId.startsWith('spotify:')) {
    // Spotify image
    return `https://i.scdn.co/image/${assetId.slice(8)}`;
  } else if (assetId.startsWith('twitch:')) {
    // Twitch image
    return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${assetId.slice(7)}.jpg`;
  } else if (applicationId) {
    // Discord application asset
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
  }
  return null;
}

// Activity Image Management
function showActivityImage(imageUrl) {
  activityImg.src = imageUrl;
  activityImageWrap.style.display = 'block';
}

function hideActivityImage() {
  activityImageWrap.style.display = 'none';
}

// Fetch Initial Data
async function fetchInitialData() {
  try {
    const response = await fetch(LANYARD_REST);
    const data = await response.json();
    
    if (data.success) {
      setUserInfo(data.data);
      setPresence(data.data);
    }
  } catch (error) {
    console.warn('Failed to fetch initial Lanyard data:', error);
  }
}

// WebSocket Connection
function connectLanyardWebSocket() {
  const ws = new WebSocket(LANYARD_WS);
  
  ws.onopen = () => {
    console.log('Connected to Lanyard WebSocket');
    ws.send(JSON.stringify({ 
      op: 2, 
      d: { subscribe_to_id: DISCORD_USER_ID } 
    }));
  };
  
  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      
      if (message.t === 'INIT_STATE') {
        const userData = message.d?.init_state?.[DISCORD_USER_ID] || message.d;
        if (message.d?.discord_user) {
          setUserInfo(message.d);
        }
        setPresence(userData);
      }
      
      if (message.t === 'PRESENCE_UPDATE') {
        if (message.d?.discord_user) {
          setUserInfo(message.d);
        }
        setPresence(message.d);
      }
    } catch (error) {
      console.warn('WebSocket message parse error:', error);
    }
  };
  
  ws.onclose = () => {
    console.log('Lanyard WebSocket disconnected, reconnecting in 5 seconds...');
    setTimeout(connectLanyardWebSocket, 5000);
  };
  
  ws.onerror = (error) => {
    console.warn('Lanyard WebSocket error:', error);
    ws.close();
  };
}

// Initialize
fetchInitialData();
connectLanyardWebSocket();