import firebase from "firebase/app";
import "@firebase/messaging";

var config = {
  messagingSenderId: "1047943924708",
  apiKey: "AIzaSyABojssKDK-JQReXikpuiCKsajEVlNTiMY",
  projectId: "building-cracks-detection",
  appId: "1:1047943924708:web:7a342d12551cbc3ede15f1",
};
firebase.initializeApp(config);

export default {
  messaging: firebase.messaging(),
};
