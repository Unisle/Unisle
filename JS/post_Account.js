/*
post_Account.js

b1018194 Ito Hajime
*/

//Post MyProfile

function handlePid() {
  const userid = firebase.auth().currentUser.uid;
  var Ref = database.ref('Account/' + userid + '/profile');
  var pid;

  Ref.on('value', function (snapshot) {
    pid = snapshot.val().pid;
  });

  if (pid != null) {
    return pid;
  } else {
    pid = database.ref('Profile/').push().key;
    return pid;
  }
}

function postMyProfile() {
  const userid = firebase.auth().currentUser.uid;
  var groupkey = handleGroup('getCurrent');
  var Ref = database.ref('Account/' + userid + '/profile');
  var username = document.getElementById('username').value; //ID = username
  var pic = document.getElementById('pic').value;  //ID = pic
  var pid = handlePid();

  Ref.update({
    username: username,
    uid: userid,
    pic: pic,
    pid: pid
  });

  Ref = database.ref('Profile/' + pid);
  Ref.update({
    username: username,
    pic: pic
  });

  Ref = database.ref('Group/' + groupkey + '/profile/' + pid);
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
  var key = database.ref('Account/' + userid + '/info/post/').push().key;

  Ref.on('value', function (snapshot) {
    username = snapshot.val().username;
  });

  Ref = database.ref('Account/' + userid + '/info/post/' + key);
  Ref.update({
    username: username,
    message: message,
    date: date,
    key: key
  });
  postPost(username, message, date);
}

function postPost(username, message, date) {
  const database = firebase.database();
  var groupkey = handleGroup('getCurrent');
  var pid = handlePid();
  var key = database.ref('Group/' + groupkey + '/profile/' + pid + '/post/').push().key;
  var Ref = database.ref('Group/' + groupkey + '/profile/' + pid + '/post/' + key);
  Ref.update({
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
  var groupkey = handleGroup('getCurrent');
  var Ref = database.ref('Account/' + userid + '/profile');

  var title = document.getElementById('ProjectTitle').value;  //ID = ProjectTitle
  var contents_message = document.getElementById('ProjectContent').value;  //ID = ProjectContent
  var recruit_message = document.getElementById('ProjectRecruit').value;  //ID = ProjectRecruit
  var period = document.getElementById('ProjectPeriod').value;  //ID = ProjectPeriod
  var density_message = document.getElementById('ProjectDensity').value;  //ID = ProjectDensity

  var date = Today();
  var pid = handlePid();
  var projectkey = database.ref('Project/').push().key;

  var tmpkey = database.ref('Group/' + groupkey + '/Account/' + userid + '/info/project/').push().key;
  Ref = database.ref('Account/' + userid + '/info/project/' + tmpkey);

  Ref.update({
    projectkey: projectkey,
    selfkey: tmpkey
  });

  Ref = database.ref('Group/' + groupkey + '/profile/' + pid + '/project/' + tmpkey);

  Ref.update({
    projectkey: projectkey,
    selfkey: tmpkey
  });

  Ref = database.ref('Group/' + groupkey + '/project/' + projectkey);

  Ref.update({
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

function makeGroup() {
  const userid = firebase.auth().currentUser.uid;
  var groupname = document.getElementById('Groupname').value;  //ID = Groupname
  var groupkey = database.ref('Group/').push().key;
  var tmpchildkey = database.ref('Account/' + userid + '/profile/group').push().key;

  database.ref('Group/' + groupkey).update({
    groupname: groupname,
    groupkey: groupkey
  });

  database.ref('Account/' + userid + '/profile/group/' + tmpchildkey).update({
    groupkey: groupkey,
    selfkey: tmpchildkey
  });

  database.ref('Account/' + userid + '/profile/currentgroup').update({
    groupkey: groupkey
  });
}

function handleGroup(mode) {
  const userid = firebase.auth().currentUser.uid;
  var groupList;
  var currentgroup;

  if (mode == 'getList') {
    database.ref('Account/' + userid + '/profile/group/').on('child_added', function (snapshot) {
      groupList = groupList.push(snapshot.val().groupkey);
    });
    return groupList;
  }
  else if (mode == 'getCurrent') {
    database.ref('Account/' + userid + '/profile/currentgroup').on('value', function (snapshot) {
      currentgroup = snapshot.val().groupkey;
    });
    return currentgroup;
  }
}
