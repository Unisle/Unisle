/*
get_Account.js

b1018194 Ito Hajime
*/

function getMyProfile() { 
  const database = firebase.database();  
  const userid = firebase.auth().currentUser.uid;   
  var Ref = database.ref('Account/'+userid+'/profile');
  
  Ref.on('value', function(snapshot) {
  username.innerHTML = snapshot.val().username;
  uid.innerHTML = snapshot.val().uid; //write to uid
  pic.innerHTML = snapshot.val().pic; //write to pic    
  });

} 

function getMyInfo() {
  const database = firebase.database();  
  const userid = firebase.auth().currentUser.uid;
  var projectpass;
  database.ref('Account/'+userid+'/info').on('value', function(snapshot) {
  attendance.innerHTML = snapshot.val().attendance; //write to attendance
  });

  database.ref('Account/'+userid+'/info/project').on('child_add', function(snapshot) {
    projectpass = projectpass.push(snapshot.val().path);  
  });

  for (let count in projectpass) {
    const projectTitle = "projectTitle"+String(count);
    const projectDate = "projectDate"+String(count);
    
    database.ref('Project/'+projectpass[count]).on('value', function(snapshot) {
      const projecttitle = snapshot.val().titile;
      const projectdate = snapshot.val().date;
      projectTitle.innerHTML = projecttitle; //write to projectTitle0,1,2,3...
      projectDate.innerHTML = projectdate;  //write to projectDate0,1,2,3...
      });
  }
  
}

function getProfile() {
  const database = firebase.database();
  //Array
  var username;
  var pic;
  var attendance;
  var project;  
  //Double Array
  var projectArray;

  database.ref('Profile').on('child_added', function(snapshot) {
    username = username.push(snapshot.val().username);
    pic = pic.push(snapshot.val().pic);
    attendance = attendance.push(snapshot.val().attendance);
    
    database.ref('Profile/project').on('child_added', function(snapshot) {
      project = project.push(snapshot.val().path);
      projectArray = projectArray.push(project);
    });
    
  });

}

document.addEventListener("DOMContentLoaded", getMyProfile);
document.addEventListener("DOMContentLoaded", getMyInfo);