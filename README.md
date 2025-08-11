# ReSkinIt 🎵

A sleek, modern landing page that displays real-time Discord presence information using the Lanyard API. Features a cinematic background video with interactive controls and live activity tracking.

# Preview 
<img width="1916" height="993" alt="image" src="https://github.com/user-attachments/assets/84a6e6de-4566-476a-bb92-da07e8210713" />


## ✨ Features

- **Real-time Discord Status** - Live presence updates with colored status indicators
- **Activity Tracking** - Displays current activities (Spotify, games, apps) with icons
- **Cinematic Experience** - Full-screen background video with audio controls
- **Click-to-Enter** - User interaction required for audio/video autoplay compliance
- **Responsive Design** - Mobile-friendly layout that adapts to all screen sizes
- **Clean UI** - Modern glassmorphism design with smooth animations

## 🎮 Activity Support

The page dynamically displays various Discord activities:

- 🎵 **Spotify** - Shows album artwork, song name, and artist
- 🎮 **Games** - Displays game icons, current status, and details
- 📺 **Streaming** - Shows platform and content information
- 💻 **Applications** - Displays app icons and current activity

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reskinit.git
   cd reskinit
   ```

2. **Update your Discord User ID**
   ```javascript
   // In script.js, replace with your Discord User ID
   const DISCORD_USER_ID = '1106915426396540938';
   ```

3. **Add your background video**
   ```
   background/
   └── background.mp4  # Place your video file here
   ```

4. **Deploy**
   - Upload to any web server
   - Or use free hosting platforms (see [Hosting Options](#-hosting-options) below)

## 🌐 Hosting Options

### **Free Hosting Platforms**

#### **[Vercel](https://vercel.com/)** ⭐ Recommended
- **✅ Pros**: Instant deployment, automatic HTTPS, custom domains
- **📝 Setup**: Connect GitHub repo → Auto-deploy on push
- **💾 Limits**: 100GB bandwidth/month

#### **[Netlify](https://netlify.com/)**
- **✅ Pros**: Drag & drop deployment, form handling, edge functions
- **📝 Setup**: Drag folder to deploy or connect Git repo
- **💾 Limits**: 100GB bandwidth/month

#### **[GitHub Pages](https://pages.github.com/)**
- **✅ Pros**: Built into GitHub, simple setup, free custom domains
- **📝 Setup**: Enable in repo settings → Select source branch
- **💾 Limits**: 1GB storage, 100GB bandwidth/month

#### **[Firebase Hosting](https://firebase.google.com/products/hosting)**
- **✅ Pros**: Google infrastructure, SSL included, CDN
- **📝 Setup**: `firebase init hosting` → `firebase deploy`
- **💾 Limits**: 10GB storage, 360MB/day transfer

#### **[Surge.sh](https://surge.sh/)**
- **✅ Pros**: Simple CLI deployment, custom domains
- **📝 Setup**: `npm install -g surge` → `surge`
- **💾 Limits**: Unlimited bandwidth

#### **[Cloudflare Pages](https://pages.cloudflare.com/)**
- **✅ Pros**: Fast global CDN, unlimited bandwidth
- **📝 Setup**: Connect Git repo → Auto-deploy
- **💾 Limits**: 20,000 files per deployment

### **Quick Deploy Commands**

```bash
# Vercel
npx vercel --prod

# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir .

# Surge
npm install -g surge
surge

# Firebase
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📁 File Structure

```
discord-landing-page/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Discord API integration & controls
├── background/
│   └── background.mp4  # Your background video
└── README.md          # This file
```

## ⚙️ Configuration

### Discord User ID
Get your Discord User ID by:
1. Enable Developer Mode in Discord Settings
2. Right-click your profile → Copy ID
3. Replace `DISCORD_USER_ID` in `script.js`

### Customization
```css
:root {
  --accent: #ff3b2e;        /* Main accent color */
  --muted: rgba(255,255,255,0.8); /* Text color */
  --online: #23a55a;        /* Online status color */
  --idle: #f0b132;          /* Away status color */
  --dnd: #f23f43;           /* DND status color */
  --offline: #80848e;       /* Offline status color */
}
```

## 🛠️ Technologies Used

- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Modern features like `backdrop-filter`, flexbox, and animations
- **HTML5** - Semantic structure with video elements
- **Lanyard API** - Real-time Discord presence data
- **WebSocket** - Live updates without polling

## 🎨 Status Indicators

The page shows your Discord status with visual indicators:

- 🟢 **Online** - Active and available
- 🟡 **Away** - Idle/away from keyboard
- 🔴 **Do Not Disturb** - Busy, do not disturb
- ⚫ **Offline** - Not connected to Discord

## 📱 Mobile Support

Fully responsive design with mobile optimizations:
- Smaller avatar sizes on mobile
- Adjusted text sizes for readability
- Touch-friendly controls
- Optimized presence card width

## 🔧 API Integration

### Lanyard REST API
- Initial data fetch on page load
- Fallback for WebSocket connection issues

### Lanyard WebSocket
- Real-time presence updates
- Automatic reconnection on disconnect
- Efficient data streaming

## 🚨 Browser Compatibility

- **Modern browsers** - Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Required features**: WebSocket support, modern CSS features
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or run into issues:
- Open an issue on GitHub
- Check the Lanyard documentation
- Ensure your Discord User ID is correct

## 🙏 Acknowledgments

- [Lanyard](https://github.com/Phineas/lanyard) - For the amazing Discord presence API
- [Discord](https://discord.com/) - For the rich presence system
- [Inter Font](https://rsms.me/inter/) - For the beautiful typography

---

⭐ **Star this repository if you found it helpful!**
