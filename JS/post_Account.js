/*
post_Account.js

b1018194 Ito Hajime
*/

//Post MyProfile

function postMyProfile() {
  const userid = firebase.auth().currentUser.uid;
  var Ref = database.ref('Account/' + userid + '/profile');
  var username = document.getElementById('username').value; //ID = username
  var pic = document.getElementById('pic').value;  //ID = pic
  var pid;

  Ref.on('value', function (snapshot) {
    pid = snapshot.val().pid;
  });

  if (pid != null) {
    Ref.update({
      username: username,
      uid: userid,
      pic: pic
    });
    postProfiles(username, pic, pid);
  }
  else {
    pid = database.ref('Account/' + userid + '/profile/').push().key;
    Ref.update({
      username: username,
      uid: userid,
      pic: pic,
      pid: pid
    });
    postProfiles(username, pic, pid);
  }
}
/// Do not use only!
function postProfiles(username, pic, pid) {
  const database = firebase.database();
  let Ref = database.ref('Profile/' + pid);
  Ref.update({
    username: username,
    pic: pic
  });
}


//Post MyPost

function PostMyPost() {
  const userid = firebase.auth().currentUser.uid;
  var Ref = database.ref('Account/' + userid + '/profile');
  var username;
  var message = document.getElementById('message').value;  //ID = message
  var date = Today();
  var pid;
  var key = database.ref('Account/' + userid + '/info/post/').push().key;

  Ref.on('value', function (snapshot) {
    pid = snapshot.val().pid;
  });

  Ref.on('value', function (snapshot) {
    username = snapshot.val().username;
  });

  if (pid != null) {
    Ref = database.ref('Account/' + userid + '/info/post/' + key);
    Ref.set({
      username: username,
      message: message,
      date: date
    });
    postPost(username, message, date, pid);
  } else {
    Ref = database.ref('Account/' + userid + '/info/post/' + key);

    Ref.set({
      username: username,
      message: message,
      date: date
    });

    pid = database.ref('Account/' + userid + '/profile/').push().key;
    Ref = database.ref('Account/' + userid + '/profile');

    Ref.update({
      pid: pid
    });

    postPost(username, message, date, pid);
  }

}

// do not use only
function postPost(username, message, date, pid) {
  const database = firebase.database();
  var key = database.ref('Profile/' + pid + '/post/').push().key;
  let Ref = database.ref('Profile/' + pid + '/post/' + key);
  Ref.set({
    username: username,
    message: message,
    date: date
  });
}

//get today data String
function Today() {
  var dt = new Date();
  //年
  var year = dt.getFullYear();
  //月
  //1月が0、12月が11。そのため+1をする。
  var month = dt.getMonth() + 1;
  //日
  var date = dt.getDate();
  //曜日
  //日曜が0、土曜日が6。配列を使い曜日に変換する。
  dateT = ["日", "月", "火", "水", "木", "金", "土"];
  var day = dateT[dt.getDay()];
  //時
  var hours = dt.getHours();
  //分
  var minutes = dt.getMinutes();
  //秒
  var seconds = dt.getSeconds();

  var ToDate = String(year) + " " + String(month) + " " + String(date)
    + " (" + String(day) + ") " + String(hours) + ":" + String(minutes)
    + ":" + String(seconds);

  return ToDate;
}

//Post Project
function MakeProject() {
  const userid = firebase.auth().currentUser.uid;
  var Ref = database.ref('Account/' + userid + '/profile');

  var title = document.getElementById('ProjectTitle').value;  //ID = ProjectTitle
  var contents_message = document.getElementById('ProjectContent').value;  //ID = ProjectContent
  var recruit_message = document.getElementById('ProjectRecruit').value;  //ID = ProjectRecruit
  var period = document.getElementById('ProjectPeriod').value;  //ID = ProjectPeriod
  var density_message = document.getElementById('ProjectDensity').value;  //ID = ProjectDensity

  var date = Today();
  var pid;
  var projectkey = database.ref('Project/').push().key;

  Ref.on('value', function (snapshot) {
    pid = snapshot.val().pid;
  });

  var tmpkey = database.ref('Account/' + userid + '/info/project/').push().key;
  Ref = database.ref('Account/' + userid + '/info/project/' + tmpkey);

  Ref.update({
    projectkey: projectkey,
    selfkey: tmpkey
  });

  Ref = database.ref('Profile/' + pid + '/project/' + tmpkey);

  Ref.update({
    projectkey: projectkey,
    selfkey: tmpkey
  });

  Ref = database.ref('Project/' + projectkey);

  Ref.set({
    key: projectkey,
    title: title,
    startdate: date,
    member: pid,
    content: contents_message,
    recruit: recruit_message,
    period: period,
    density: density_message
  });
}