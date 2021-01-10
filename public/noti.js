var config = {
  messagingSenderId: "1047943924708",
  apiKey: "AIzaSyABojssKDK-JQReXikpuiCKsajEVlNTiMY",
  projectId: "building-cracks-detection",
  appId: "1:1047943924708:web:7a342d12551cbc3ede15f1",
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging
  .requestPermission()
  .then(function() {
    console.log("Notification permission granted.");
    return messaging.getToken();
  })
  .then(function(token) {
    localStorage.setItem("fcm", token);
    console.log(token);
  })
  .catch(function(err) {
    console.log("Unable to get permission to notify.", err);
  });
messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
  console.log(payload.notification);
  alert(payload.notification.body);
  // location.reload();
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
