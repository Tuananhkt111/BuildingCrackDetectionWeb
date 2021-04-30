importScripts("https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js"
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
  "https://www.gstatic.com/firebasejs/8.4.3/firebase-analytics.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "1047943924708",
  apiKey: "AIzaSyABojssKDK-JQReXikpuiCKsajEVlNTiMY",
  projectId: "building-cracks-detection",
  appId: "1:1047943924708:web:7a342d12551cbc3ede15f1",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/itwonders-web-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});