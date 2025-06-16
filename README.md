# Who Got Next - Basketball Game Finder

A mobile-first React application for finding and joining local pickup basketball games, featuring real-time maps, music integration, and podcast content.

## Features

### 🏀 Core Basketball Features
- **Game Discovery**: Find pickup games near your location
- **Real-time Maps**: Apple Maps and Google Maps integration
- **Game Management**: Create, join, and manage basketball games
- **Player Profiles**: Track stats, wins, losses, and skill ratings
- **Leaderboards**: City-wide rankings and competitions
- **Court Finder**: Discover basketball courts with ratings and photos

### 🎵 Entertainment Features
- **Music Integration**: Apple Music API for basketball playlists
- **Podcast Player**: YouTube API integration for "2 Tears in a Bucket" podcast
- **Curated Playlists**: Basketball-themed music collections
- **Audio Controls**: In-app music playback (iOS with Apple Music)

### 🔧 Technical Features
- **Firebase Backend**: Authentication, Firestore database, cloud storage
- **Real-time Updates**: Live game updates and player notifications
- **Geolocation**: GPS-based court and game discovery
- **Responsive Design**: Mobile-first with desktop support
- **Progressive Web App**: Installable on mobile devices

## API Integrations

### Firebase
- **Authentication**: Email/password sign-up and sign-in
- **Firestore**: Real-time database for games, users, courts
- **Cloud Storage**: Profile pictures and court photos
- **Analytics**: User engagement tracking

### Maps APIs
- **Apple MapKit JS**: Native iOS map experience
- **Google Maps API**: Cross-platform map functionality
- **Geolocation**: Find nearby courts and games
- **Directions**: Navigate to game locations

### YouTube API
- **Channel Integration**: "2 Tears in a Bucket" podcast
- **Video Streaming**: Latest episodes and highlights
- **Search Functionality**: Find basketball-related content
- **Playlist Management**: Curated video collections

### Apple Music API
- **MusicKit JS**: Native iOS music integration
- **Playlist Access**: Basketball workout playlists
- **Playback Control**: In-app music controls
- **Search**: Find basketball-themed music

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# YouTube API
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# Apple Music API
VITE_APPLE_MUSIC_TOKEN=your_apple_music_developer_token

# Podcast Channel
VITE_PODCAST_CHANNEL_ID=UC2tearsinabucketpodcast707
```

### 2. Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Cloud Storage
5. Copy your config values to the `.env` file

### 3. Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API and Places API
3. Create an API key and restrict it to your domain
4. Add the key to your `.env` file

### 4. YouTube API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create an API key
4. Add the key to your `.env` file

### 5. Apple Music Setup
1. Join the Apple Developer Program
2. Create a MusicKit identifier
3. Generate a developer token
4. Add the token to your `.env` file

### 6. Install and Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── EnhancedMapView.tsx
│   ├── MusicPlayer.tsx
│   ├── PodcastPlayer.tsx
│   └── ...
├── services/            # API service layers
│   ├── authService.ts   # Firebase authentication
│   ├── gameService.ts   # Game management
│   ├── mapsService.ts   # Maps integration
│   ├── youtubeService.ts # YouTube API
│   └── musicService.ts  # Apple Music API
├── lib/                 # Utilities and config
│   └── firebase.ts      # Firebase configuration
└── pages/               # Page components
    └── Index.tsx        # Main app page
```

## Key Services

### Authentication Service (`authService.ts`)
- User registration and login
- Profile management
- Firebase Auth integration

### Game Service (`gameService.ts`)
- Create and join games
- Real-time game updates
- Location-based game discovery

### Maps Service (`mapsService.ts`)
- Cross-platform map support
- Court discovery
- Navigation integration

### YouTube Service (`youtubeService.ts`)
- Podcast episode fetching
- Video playback
- Channel management

### Music Service (`musicService.ts`)
- Apple Music integration
- Playlist management
- Cross-platform music links

## Deployment

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@whogotnext.app or join our Discord community.