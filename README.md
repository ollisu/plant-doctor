# plant-doctor
# PlantDoc 🌿

PlantDoc is a cross-platform mobile app built with **React Native**, **Expo Router**, and **Firebase** that helps users identify plant diseases using AI. It leverages a Hugging Face model for diagnosis, stores results with location data, and allows users to review past diagnoses on a map or in a history list.

---

## 🚀 Features

* 📸 **Capture or upload images** to diagnose plant conditions
* 🧠 **AI model integration** via Hugging Face
* 📍 **Location tagging** of diagnoses
* 🗒️ **Optional notes** with each submission
* 🧾 **View history** of past diagnoses
* 🗺️ **Map view** of diagnosis locations
* 🔐 **Firebase Authentication** (Email + Password, Google optional)
* ☁️ **Firebase Firestore** for storing user data

---

## 🛠️ Tech Stack

* **React Native** via **Expo**
* **Expo Router** for navigation
* **Firebase** (Auth + Firestore)
* **Hugging Face Inference API** for ML predictions
* **Expo Camera**, **ImagePicker**, and **Location** APIs

---

## 📦 Installation

```bash
npm install
npx expo start
```

Ensure you have:

* A `.env` file with the following:

```env
HUGGINGFACE_API_TOKEN=your_token_here
HUGGINGFACE_MODEL_URL=https://api-inference.huggingface.co/models/your-model-name
```

---

## 🔑 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password Authentication**
3. (Optional) Enable **Google Authentication**:

   * Get your web, iOS, and Android client IDs from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Create a Firestore database
5. Configure Firebase in `/services/firebaseConfig.js`:

```js
// services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 🧪 Testing

Tested on:

* Android (Expo Go)
* iOS Simulator
* Web (limited camera support)

---

## 📁 Folder Structure

```
app/
  index.js             # Home screen
  diagnose.js          # Capture image + diagnose
  diagnoses.js         # List of past diagnoses
  map.js               # Map view
  login.js             # Login screen
  register.js          # Registration screen
  _layout.js           # Expo Router layout
services/
  firebaseConfig.js    # Firebase setup
.env                   # Env vars for Hugging Face
```

---

## 💡 Tips

* If you rename `firebaseConfig.js`, **make sure imports match exactly**
* Use `router.replace()` after login/register to prevent back navigation to auth screens
* Use `console.log(router)` to debug navigation issues

---

## 🧰 Future Enhancements

* Google sign-in integration
* Offline support
* Push notifications for diagnosis reminders

---

## 📝 License

MIT License — Feel free to use, modify, and share!
