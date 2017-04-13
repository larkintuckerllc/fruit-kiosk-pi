const firebase = require('firebase');
const app = require('express')();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var config = {
  apiKey: "AIzaSyCr5GWf_WNSVnRF6oBvIt0FFaHFu8KYCXE",
  authDomain: "fruit-kiosk.firebaseapp.com",
  databaseURL: "https://fruit-kiosk.firebaseio.com",
  projectId: "fruit-kiosk",
  storageBucket: "fruit-kiosk.appspot.com",
  messagingSenderId: "73507718012"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // GET FRUITS
    const fruitsRef = firebase.database().ref('fruits');
    fruitsRef.once('value') 
    .then((snap) => {
      const fruitsLookup = {};
      const fruits = snap.val();
      const fruitKeys = Object.keys(fruits);
      for (let i = 0; i < fruitKeys.length ; i += 1) {
        const fruitKey = fruitKeys[i];
        fruitsLookup[(fruits[fruitKey].order).toString()] = fruitKey;
      }
      // START LISTENING
      const touchedRef = firebase.database().ref('touched');
      io.on('connection', socket => {
        socket.on('message', msg => {
          const fruitKey = fruitsLookup[msg.toString()]; 
          if (fruitKey !== undefined) {
            touchedRef.set(fruitKey);
          }
        });
      });
      http.listen(3000, () => {
      })
    });
  } else {
    // AUTHENTICATE
    firebase.auth().signInWithEmailAndPassword(
      'touch@larkintuckerllc.com',
      '[OBMITTED]'
    );
  }
});
