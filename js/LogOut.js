/*
LogOut.js

b1018194 Ito Hajime
*/
function logout(){
firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log('USER LOGOUT SUCCESS');
  }).catch(function(error) {
    // An error happened.
    console.log('USER LOGOUT FAULT');
  });
}