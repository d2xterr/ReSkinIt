const DISCORD_USER_ID = '1106915426396540938'; // DISCORD ID REPLACE TO GET UR DISCORD INFO
const LANYARD_REST = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
const LANYARD_WS = 'wss://api.lanyard.rest/socket';


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


enterOverlay.addEventListener('click', async () => {
  if (hasEntered) return;
  hasEntered = true;
  
  enterOverlay.classList.add('hidden');
  

  try {
    video.muted = false;
    await video.play();
    playToggle.textContent = 'Pause';
    muteToggle.textContent = 'Mute';
  } catch (error) {
    console.warn('Autoplay failed:', error);

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


function updateStatusIndicators(status) {
  const statusClasses = ['online', 'idle', 'dnd', 'offline'];
  

  statusClasses.forEach(cls => {
    statusIndicator.classList.remove(cls);
  });
  

  const currentStatus = status || 'offline';
  statusIndicator.classList.add(currentStatus);
}


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


function setPresence(presenceData) {
  console.log('Setting presence:', presenceData);
  
  if (!presenceData) {
    activityLine.textContent = 'Offline';
    statusLine.textContent = '';
    updateStatusIndicators('offline');
    hideActivityImage();
    return;
  }

  const { discord_status, activities, listening_to_spotify, spotify } = presenceData;
  

  console.log('Discord status:', discord_status); 
  updateStatusIndicators(discord_status);
  

  statusLine.textContent = capitalizeStatus(discord_status);


  if (listening_to_spotify && spotify) {
    const songName = spotify.song || 'Unknown Song';
    const artistName = spotify.artist || 'Unknown Artist';
    
    activityLine.textContent = `${songName}`;
    statusLine.textContent = `by ${artistName} • Spotify`;
    

    if (spotify.album_art_url) {
      showActivityImage(spotify.album_art_url);
    } else {
      hideActivityImage();
    }
    return;
  }


  if (activities && activities.length > 0) {
    console.log('Activities:', activities);
    

    const primaryActivity = activities.find(a => a.type !== 2) || activities[0];
    
    let mainText = '';
    let subText = '';
    
  
    const appName = primaryActivity.name || 'Unknown App';
    

    if (primaryActivity.details) {
      mainText = primaryActivity.details;
    } else {
      mainText = appName;
    }
    

    switch (primaryActivity.type) {
      case 0: 
        if (primaryActivity.state) {
          subText = `${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Playing ${appName}`;
        }
        break;
      case 2: 
        if (primaryActivity.state) {
          subText = `by ${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Listening • ${appName}`;
        }
        break;
      case 3: 
        if (primaryActivity.state) {
          subText = `${primaryActivity.state} • ${appName}`;
        } else {
          subText = `Watching ${appName}`;
        }
        break;
      case 5: 
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
    

    if (primaryActivity.assets) {
      let imageUrl = null;
      
   
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


function getAssetImageUrl(assetId, applicationId) {
  if (assetId.startsWith('mp:')) {

    return `https://media.discordapp.net/${assetId.slice(3)}`;
  } else if (assetId.startsWith('spotify:')) {

    return `https://i.scdn.co/image/${assetId.slice(8)}`;
  } else if (assetId.startsWith('twitch:')) {
 
    return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${assetId.slice(7)}.jpg`;
  } else if (applicationId) {
  
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
  }
  return null;
}


function showActivityImage(imageUrl) {
  activityImg.src = imageUrl;
  activityImageWrap.style.display = 'block';
}

function hideActivityImage() {
  activityImageWrap.style.display = 'none';
}


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


fetchInitialData();

connectLanyardWebSocket();

