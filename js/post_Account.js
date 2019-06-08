/*
post_Account.js

b1018194 Ito Hajime
*/

function postMyProfile() {
  const database = firebase.database();
  const userid = firebase.auth().currentUser.uid;   
  const Ref = database.ref('Account/'+userid+'/profile');
  const username = document.getElementById('username').value; 
  const uid = document.getElementById('uid').value;
  const pic = document.getElementById('pic').value;
  const pid;

  Ref.on('value', function(snapshot) {
    pid = snapshot.val().pid;
    });

    if(pid != null) {
      Ref.set({
        username:username,
        uid:uid,
        pic:pic
      });
      postProfiles(username, pic, pid);
    }
    else 
    {
      pid = String(push().key);
      Ref.set({
        username:username,
        uid:uid,
        pic:pic,
        pid:pid
      });
      postProfiles(username, pic, pid);
    }
}
/// Do not use only!
function postProfiles(username, pic, pid) {
  const database = firebase.database();
  const Ref = database.ref('Profile/'+pid);
  Ref.set({
    username:username,
    pic:pic
  });
}