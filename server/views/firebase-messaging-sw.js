if ("function" === typeof importScripts) {
  importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
  importScripts(
    "https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js"
  );

  const firebaseConfig = {
    apiKey: "AIzaSyDaz0OAIHrVrRZbKFJgKL4jKSqTZeVbA5g",
    authDomain: "gdud-erez.firebaseapp.com",
    projectId: "gdud-erez",
    storageBucket: "gdud-erez.appspot.com",
    messagingSenderId: "1047611297686	",
    appId: "1:1047611297686:web:12d9a71475eeef8f7117b7",
    // measurementId: "G-WK7BC81V5T",
  };

  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
