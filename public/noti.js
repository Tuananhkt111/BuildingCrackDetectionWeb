var config = {
  apiKey: "AIzaSyABojssKDK-JQReXikpuiCKsajEVlNTiMY",
  authDomain: "building-cracks-detection.firebaseapp.com",
  projectId: "building-cracks-detection",
  storageBucket: "building-cracks-detection.appspot.com",
  messagingSenderId: "1047943924708",
  appId: "1:1047943924708:web:24ef34b7089afe70de15f1",
  measurementId: "G-F5HV35DXK9",
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging
  .requestPermission()
  .then(function() {
    return messaging.getToken();
  })
  .then(function(token) {
    localStorage.setItem("fcm", token);
  })
  .catch(function(err) {
    console.log("Unable to get permission to notify.", err);
  });
messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
  console.log(payload.notification);
  // location.reload();
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
