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
        "BNtOBv8BTDC2scY-AI5jLVLS42Bd4Kc-m1cMH22t9-BNQLvMbGDtrSokTycovVHJuxc_eCg51z79T1dxMC2TYdY",
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
