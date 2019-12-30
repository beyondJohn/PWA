importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyCrJ1j5DjRhyGQiqB0ZMb4hMhyKVZRv9RQ",
    authDomain: "mebloggy-33c13.firebaseapp.com",
    databaseURL: "https://mebloggy-33c13.firebaseio.com",
    projectId: "mebloggy-33c13",
    storageBucket: "mebloggy-33c13.appspot.com",
    messagingSenderId: "11087891465",
    appId: "1:11087891465:web:d698b7dbc1f269d87fbcd8",
    measurementId: "G-1JS54ECKN8"
});
const messaging = firebase.messaging();