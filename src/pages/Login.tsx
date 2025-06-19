const handleLogin = async () => {
  try {
    const user = await loginWithGoogle();
    console.log('✅ Logged in user:', user);

    if (!navigator.geolocation) {
      console.error('Geolocation not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          location: new GeoPoint(latitude, longitude),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        console.log('📍 Location saved to Firestore!');
      },
      (error) => {
        console.error('Geolocation error:', error.message);
      }
    );
  } catch (err) {
    console.error('❌ Login failed:', err);
  }
};
