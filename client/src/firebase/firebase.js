// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDaz0OAIHrVrRZbKFJgKL4jKSqTZeVbA5g",
    authDomain: "gdud-erez.firebaseapp.com",
    projectId: "gdud-erez",
    storageBucket: "gdud-erez.appspot.com",
    messagingSenderId: "1047611297686	",
    appId: "1:1047611297686:web:12d9a71475eeef8f7117b7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const messaging = getMessaging(app);

export const getNotificationToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BG2bw2WVmLskDqWHGYk-Dl7QxQ2S-_r1Fri74KXmZE67s1lQlIduZlwXARO6i5aujAce-l_d_BYAx2arIdaR9yo",
    });

    if (token) {
      return token;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }

    return null;
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const requestNotificationPermissions = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    return true;
  }

  return false;
};

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // ...
});
