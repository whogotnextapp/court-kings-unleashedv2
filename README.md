# 🏀 Who Got Next™ – Pickup Sports App

**Who Got Next™** is a community-powered app for finding and joining **pickup basketball games** in your city. Built for hoopers, by hoopers — it's where reputation, music, and streetball culture come together.

---

## 🚀 Features

* 🗘️ **Interactive Map** – See nearby pickup games, active players, and courts in real time
* 🢑 **Player Profiles** – Win/loss records, skill level (auto-ranked), and premium status
* 🎵 **Music Player** – Built-in Spotify playlist to keep the vibes right
* 🎧 **Podcast Tab** – Listen to the “2 Tears in a Bucket” show inside the app
* 🔐 **Google Authentication** – Quick, secure sign-in to track your record

---

## 🧱 Tech Stack

| Layer      | Tech Used                                |
| ---------- | ---------------------------------------- |
| Frontend   | React (Vite + TypeScript) + Tailwind CSS |
| Backend    | Firebase Auth, Firestore, and Storage    |
| Mapping    | Google Maps API                          |
| Media      | Spotify SDK + YouTube Embed              |
| Deployment | GitHub Codespaces (Dev) / TBD (Prod)     |

---

## 📦 Local Dev Setup

> You'll need Node.js (v18+) and Firebase CLI

```bash
git clone https://github.com/YOUR_USERNAME/who-got-next.git
cd who-got-next

# Install dependencies
npm install

# Create .env.local and add your Firebase keys
cp .env.example .env.local

# Run the dev server
npm run dev
```

---

## 🔑 Environment Variables

Here’s what you need to put in your `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📁 Folder Structure

```
src/
├── components/       # Music player, bottom tabs, layout
├── lib/              # Firebase config, auth utils
├── pages/            # Map, Music, Podcast, Login, Onboarding
├── services/         # Game, Auth, Music, YouTube APIs
└── main.tsx          # App entry point
```

---

## 🧐 About the Founder

This project is led by **Jerrel Cooper**, a visionary with passion, grit, and a love for changing the world. The mission? Empower players, elevate the game, and turn hoopers into heroes — city by city.

---

## 🤝 Contributors

* Jerrel Cooper – Founder, Product, Vision
* You? PRs are welcome.

---

## 📩 Contact

Want to collaborate or invest? Reach out:
📧 [jerrel@whogotnextapp.com](mailto:jerrel@whogotnextapp.com)
📷 [@whogotnextapp](https://instagram.com/whogotnextapp)

---

## 🏑️ License

This project is licensed under the MIT License.


## Support

For support, email support@whogotnext.app or join our Discord community.
