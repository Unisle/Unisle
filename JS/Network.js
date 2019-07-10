/*
Network.js

b1018194 Ito Hajime
*/

/* 依存関係：*/

/*
コンストラクタで必要なデータを取得しているので、
最新のデータを得るためには呼び出し側で必要なタイミングで初期化する必要がある 
Network n;
n = new Network();

//when onload
n = null;
n = new Network();
*/
class Network {

    constructor() {
        //sessionStorageによる取得 LOAD時にRTDBを経由したget処理が可能になる
        this.uid = sessionStorage.getItem('uid');
        this.mypid = sessionStorage.getItem('pid');
        this.currentGroupKey = sessionStorage.getItem('currentGroup');

        if (this.mypid == null) {
            database.ref('Account/' + this.uid + '/profile').on('value', function (snapshot) {
                this.mypid = snapshot.val().pid;
            });
        }

        if (this.uid == null) {
            this.uid = firebase.auth().currentUser.uid;
        }

        if (this.currentGroupKey == null) {
            database.ref('Account/' + this.uid + '/profile/currentgroup').on('value', function (snapshot) {
                this.currentGroupKey = snapshot.val().groupkey;
            });
        }

        //連想配列を配列に入れる
        this.myGroupList = [];//[[key:String, name:String], [key:XXXX, name:YYYYY], .....]
        database.ref('Account/' + this.uid + '/profile/group/').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.key = snapshot.val().groupkey;
            tmp.name = snapshot.val().groupname;
            this.myGroupList.push(tmp);
        });

        //連想配列を配列に入れる
        this.peerList = [];//[[pid:String, name:String, pic:int, attendance:boolean], .....]
        database.ref('Group/' + this.currentGroupKey + '/profile').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.pid = snapshot.val().pid;
            tmp.name = snapshot.val().username;
            tmp.pic = snapshot.val().pic;
            tmp.attendance = snapshot.val().attendance;
            // tmp.attendance = snapshot.val().attendance;
            this.peerList.push(tmp);
        });


        if (this.mypid == null) {
            //First time only fired.
            const tmpname = 'nanashi';
            const defaultpic = 0;
            this.mypid = database.ref('Profile/').push().key;

            let Ref = database.ref('Account/' + this.uid + '/profile');
            Ref.update({
                username: tmpname,
                pic: defaultpic,
                pid: this.mypid,
                attendance: false
            });

            Ref = database.ref('Profile/' + this.mypid);
            Ref.update({
                username: tmpname,
                pic: defaultpic,
                pid: this.mypid,
                attendance: false
            });

            Ref = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid);
            Ref.update({
                username: tmpname,
                pic: defaultpic,
                pid: this.mypid,
                attendance: false
            });
        }
    }

    setUserName(username) {
        //username is String
        let Ref = database.ref('Account/' + this.uid + '/profile');
        Ref.update({
            username: username
        });

        Ref = database.ref('Profile/' + this.mypid);
        Ref.update({
            username: username
        });

        Ref = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid);
        Ref.update({
            username: username
        });
    }

    setProfilePic(type) {
        //type is Int
        //type determine default profile picture
        let Ref = database.ref('Account/' + this.uid + '/profile');
        Ref.update({
            pic: type
        });

        Ref = database.ref('Profile/' + this.mypid);
        Ref.update({
            pic: type
        });

        Ref = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid);
        Ref.update({
            pic: type
        });
    }

    setPost(message) {
        let date = Today();
        let key = database.ref('Account/' + this.uid + '/info/post/').push().key;
        let Ref = database.ref('Account/' + this.uid + '/info/post/' + key);

        Ref.update({
            // username: this.username,
            //usernameは廃止してget時に現在のusernameを与える方法ではpeerpostをgetする際にpeerのusernameが識別できない
            //ので、group内のプロファイルから参照することにする
            message: message,
            date: date,
            selfkey: key /*uid直下でkeyを管理し、削除もここで行う。データの同期のためgroup直下のデータに関しては
            すべて削除したうえでuidからコピーしてくるようにする*/
        });

        key = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/post/').push().key;
        Ref = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/post/' + key);

        Ref.update({
            //username: this.username,
            message: message,
            date: date
        });
    }

    setSchedule(message, type) {
        //message is String, type is int
        //制限数を設ける予定　およそ1o個くらい
        let date = Today();
        let key = database.ref('Account/' + this.uid + '/info/schedule/').push().key;
        let Ref = database.ref('Account/' + this.uid + '/info/shedule/' + key);

        Ref.update({
            message: message,
            date: date,
            type, type,
            selfkey: key
        });

        key = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/schedule/').push().key;
        Ref = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/schedule/' + key);

        Ref.update({
            message: message,
            date: date,
            type: type
        });
    }


    createProject(List) {
        //List contains title, content_message, recruit_message, period, density_message, member
        //member is pid Array, othres is String

        let date = Today();
        let projectkey = database.ref('Project/').push().key;
        let key = database.ref('Account/' + this.uid + '/info/project/').push().key;
        let Ref = database.ref('Account/' + this.uid + '/info/project/' + key);

        Ref.update({
            projectkey: projectkey,
            selfkey: key
        });

        key = database.ref('Group/' + this.currentGroupKey + '/Account/' + this.uid + '/info/project/').push().key;

        Ref = database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/project/' + key);

        Ref.update({
            projectkey: projectkey,
            selfkey: key
        });

        Ref = database.ref('Group/' + this.currentGroupKey + '/project/' + projectkey);

        Ref.update({
            key: projectkey,
            title: List.title,
            startdate: date,
            member: List.member,
            content: List.content_message,
            recruit: List.recruit_message,
            period: List.period,
            density: List.density_message
        });
    }

    createGroup(name) {
        // name is String
        let groupkey = database.ref('Group/').push().key;
        let tmpchildkey = database.ref('Account/' + this.uid + '/profile/group').push().key;

        database.ref('Group/' + this.currentGroupKey).update({
            groupname: name,
            groupkey: groupkey
        });

        database.ref('Account/' + this.uid + '/profile/group/' + tmpchildkey).update({
            groupname: name,
            groupkey: groupkey,
            selfkey: tmpchildkey
        });

        database.ref('Account/' + this.uid + '/profile/currentgroup').update({
            groupname: name,
            groupkey: groupkey
        });
    }

    joinGroup(groupkey) {
        //groupkey is String
        let groupname;
        let childkey = database.ref('Account/' + this.uid + '/profile/group').push().key;

        database.ref('Group/' + groupkey).on('value', function (snapshot) {
            groupname = snapshot.val().groupname;
        });

        database.ref('Group/' + groupkey).update({
            groupname: groupname,
            groupkey: groupkey
        });

        database.ref('Account/' + this.uid + '/profile/group/' + childkey).update({
            groupname: groupname,
            groupkey: groupkey,
            selfkey: childkey
        });

        database.ref('Account/' + this.uid + '/profile/currentgroup').update({
            groupkey: groupkey,
            groupname: groupname
        });
    }

    selectCurrentGroup(index) {
        database.ref('Account/' + this.uid + '/profile/currentgroup').update({
            groupkey: this.myGroupList[index].key,
            groupname: this.myGroupList[index].name
        });
    }

    //以下get
    //自分に関するデータ取得系
    getMyProfile() {
        let tmp = [];
        database.ref('Group/' + this.currentGroupKey + '/profile').on('child_added', function (snapshot) {
            tmp.pid = snapshot.val().pid;
            tmp.name = snapshot.val().username;
            tmp.pic = snapshot.val().pic;
            tmp.attendance = snapshot.val().attendance;
        });
        return tmp;
    }

    getMyProjectList() {
        let projectKeyList = [];
        let projectList = [];

        database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/project').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.key = snapshot.val().projectkey;
            //tmp.selfkey = snapshot.val().selfkey;
            projectKeyList.push(tmp);
        });

        for (project in projectKeyList) {
            database.ref('Group/' + this.currentGroupKey + '/project/' + project.key).on('value', function (snapshot) {
                let tmp = [];
                tmp.key = snapshot.val().key;
                tmp.title = snapshot.val().title;
                tmp.startdate = snapshot.val().startdate;
                tmp.member = snapshot.val().member;
                tmp.content = snapshot.val().content;
                tmp.recruit = snapshot.val().recruit;
                tmp.period = snapshot.val().period;
                tmp.density = snapshot.val().density;
                projectList.push(tmp);
            });
        }

        return projectList;//連想配列の配列
    }

    getMyGroupList() {
        return this.myGroupList;
    }

    getUid() {
        return this.uid;
    }

    getMyPid() {
        return this.mypid;
    }

    getCurrentGroupKey() {
        return this.currentGroupKey;
    }

    getMyScheduleList() {
        let Ref = database.ref('Account/' + this.uid + '/info/shedule');
        let scheduleList = [];//連想配列の配列
        Ref.on('child_added', function (snapshot) {
            let tmp = [];
            tmp.message = snapshot.val().message;
            tmp.date = snapshot.val().date;
            tmp.type = snapshot.val().type;
            tmp.key = snapshot.val().selfkey;
            scheduleList.push(tmp);
        });

        return scheduleList;
    }

    getMyPostList() {
        let postList = [];
        let name;

        database.ref('Account/' + this.uid + '/info/username').on('value', function (snapshot) {
            name = snapshot.val().username;
        });

        database.ref('Group/' + this.currentGroupKey + '/profile/' + this.mypid + '/post').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.date = snapshot.val().date;
            tmp.name = name
            tmp.message = snapshot.val().message;
            postList.push(tmp);
        });

        return postList;//連想配列の配列
    }

    getPeerProfileList() {
        return this.peerList;
    }

    //以下Pidをもとに取得するメソッド
    getPeerPostList(pid) {
        let postList = [];

        database.ref('Group/' + this.currentGroupKey + '/profile/' + pid + '/post').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.date = snapshot.val().date;
            if (private_CmpPid(pid) != null) {
                tmp.name = private_CmpPid(pid).name;
            }
            else {
                tmp.name = snapshot.val().username;
            }
            tmp.message = snapshot.val().message;
            postList.push(tmp);
        });

        return postList;//連想配列の配列
    }

    getPeerScheduleList(pid) {
        let scheduleList = [];

        database.ref('Group/' + this.currentGroupKey + '/profile/' + pid + '/schedule').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.date = snapshot.val().date;
            if (private_CmpPid(pid) != null) {
                tmp.name = private_CmpPid(pid).name;
            }
            else {
                tmp.name = snapshot.val().username;
            }
            tmp.message = snapshot.val().message;
            scheduleList.push(tmp);
        });

        return scheduleList;//連想配列の配列
    }

    getPeerProjectList(pid) {
        let projectKeyList = [];
        let projectList = [];

        database.ref('Group/' + this.currentGroupKey + '/profile/' + pid + '/project').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.key = snapshot.val().projectkey;
            //tmp.selfkey = snapshot.val().selfkey;
            projectKeyList.push(tmp);
        });
        for (project in projectKeyList) {
            database.ref('Group/' + this.currentGroupKey + '/project/' + project.key).on('value', function (snapshot) {
                let tmp = [];
                tmp.key = snapshot.val().key;
                tmp.title = snapshot.val().title;
                tmp.startdate = snapshot.val().startdate;
                tmp.member = snapshot.val().member;
                tmp.content = snapshot.val().content;
                tmp.recruit = snapshot.val().recruit;
                tmp.period = snapshot.val().period;
                tmp.density = snapshot.val().density;
                projectList.push(tmp);
            });
        }
        return projectList;//連想配列の配列
    }

    //以下getList系はすべての投稿をまとめて取得できる（共有ページを想定）
    getGroupScheduleList() {
        let scheduleList = [];
        database.ref('Group/' + this.currentGroupKey + '/profile').on('child_added', function (snapshot) {
            let pids = snapshot.val().pid;

            database.ref('Group/' + this.currentGroupKey + '/profile/' + pids + '/schedule').on('child_added', function (snapshot) {
                let tmp = [];
                tmp.date = snapshot.val().date;
                if (private_CmpPid(pids) != null) {
                    tmp.name = private_CmpPid(pids).name;
                }
                else {
                    tmp.name = snapshot.val().username;
                }
                tmp.message = snapshot.val().message;
                scheduleList.push(tmp);
            });
        });

        return scheduleList;//連想配列の配列
    }

    getGroupProjectList() {
        let projectList = [];
        database.ref('Group/' + this.currentGroupKey + '/project').on('child_added', function (snapshot) {
            let tmp = [];
            tmp.key = snapshot.val().key;
            tmp.title = snapshot.val().title;
            tmp.startdate = snapshot.val().startdate;
            tmp.member = snapshot.val().member;
            tmp.content = snapshot.val().content;
            tmp.recruit = snapshot.val().recruit;
            tmp.period = snapshot.val().period;
            tmp.density = snapshot.val().density;
            projectList.push(tmp);
        });
        return projectList;//連想配列の配列
    }

    getGroupPostList() {
        let postList = [];
        database.ref('Group/' + this.currentGroupKey + '/profile').on('child_added', function (snapshot) {
            let pids = snapshot.val().pid;

            database.ref('Group/' + this.currentGroupKey + '/profile/' + pids + '/post').on('child_added', function (snapshot) {
                let tmp = [];
                tmp.date = snapshot.val().date;
                if (private_CmpPid(pid) != null) {
                    tmp.name = private_CmpPid(pids).name;
                }
                else {
                    tmp.name = snapshot.val().username;
                }
                tmp.message = snapshot.val().message;
                postList.push(tmp);
            });
        });

        return postList;//連想配列の配列
    }

    private_CmpPid(pid) {
        for (plist in this.peerList) {
            if (pid == plist.pid) {
                return plist;
            }
            else {
                return null;
            }
        }
        return null;
    }


}


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

    var ToDate = String(year) + "年" + String(month) + "月" + String(date) + "日" +
        + " (" + String(day) + ") " + String(hours) + ":" + String(minutes)
        + ":" + String(seconds);

    return ToDate;
}