/*
post_Attendance.js

b1018194 Ito Hajime
*/

function postMyProfile() {
    const database = firebase.database();
    const userid = firebase.auth().currentUser.uid;   
    const Ref = database.ref('Account/'+userid+'/info');
    const attendance = document.getElementById('attendance').value; 
    const pid;

    database.ref('Account/'+userid+'/profile').on('value', function(snapshot) {
        pid = snapshot.val().pid;
        });
    
    if(pid != null) {
        Ref.set({
            attendance:attendance //write to attendance (boolean)
          });
        database.ref('Profile'+pid).set({
            attendance:attendance //write to attendance (boolean)
        });    
    }
    else
    {
        pid = String(push().key);
        Ref.set({
            attendance:attendance //write to attendance (boolean)
          });
          database.ref('Profile'+pid).set({
            attendance:attendance //write to attendance (boolean)
        }); 
    }
  }