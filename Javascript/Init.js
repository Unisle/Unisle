let card = (pids) => {
    let parent_object = document.getElementById('rowCard')
    for (let p of pids) {
        let cardrow = document.createElement('div')
        cardrow.className = 'row'

        let card = document.createElement('div')
        card.className = 'col-sm-6 col-md-3'

        let cardimg = document.createElement('div')
        cardimg.className = 'card img-thumbnail'

        let cardimgtop = document.createElement('img')
        cardimgtop.className = 'card-img-top'
        cardimgtop.src = '../img/akko.png'
        cardimgtop.alt = 'Account'

        let cardbody = document.createElement('div')
        cardbody.className = 'card-body px-2 py-3'

        let cardtitle = document.createElement('h5')
        cardtitle.className = 'card-title'
        //let text = document.createTextNode('pid')
        //cardtitle.appendChild(text)
        cardtitle.innerHTML = 'タイトル'

        let cardtext = document.createElement('p')
        cardtext.className = 'card-text'
        let text = document.createTextNode('コンテンツ')
        cardtext.appendChild(text)
        let btn = document.createElement('p')
        btn.className = 'mb-0'

        let btn0 = document.createElement('a')
        btn0.className = 'btn btn-primary btn-sm'
        btn0.href = '#'
        text = document.createTextNode('Button0')
        btn0.appendChild(text)

        let btn1 = document.createElement('a')
        btn1.className = 'btn btn-secondary btn-sm'
        btn1.href = '#'
        text = document.createTextNode('Button1')
        btn1.appendChild(text)

        let a1 = parent_object.appendChild(card).appendChild(cardimg)
        a1.appendChild(cardimgtop)
        let a2 = parent_object.appendChild(card).appendChild(cardimg).appendChild(cardbody)
        a2.appendChild(cardtitle)
        a2.appendChild(cardtext)
        a2.appendChild(btn).appendChild(btn0)
        a2.appendChild(btn).appendChild(btn1)
    }
}

let Init_func_currentGroupKey = (currentGroupKey) => {
    let contentBlock1 = document.getElementById('currentGroupKey')
    contentBlock1.insertAdjacentHTML('afterbegin', 'currentGroupKey :' + currentGroupKey)
}

const uid = sessionStorage.getItem('uid')//自分のuserID
let mypid//自分のpeerID
database.ref('Account/' + uid + '/profile/').on('value', function (snapshot) {
    mypid = snapshot.val().pid
    //isLogin()の処理を追加
    //document.addEventListener('DOMContentLoaded'...)ではpidをここで取得する前に実行されるので
    //新しいpidが生成されてしまう
    if (uid == undefined) alert('you did not login now')
    else {
        if (mypid == undefined) {
            //First time only fired. 初期化時の処理
            let tmpname = 'nanashi'
            let defaultpic = 0
            //pid生成
            let mypid = database.ref('Profile/').push().key
            let Ref = database.ref('Account/' + uid + '/profile')
            Ref.update({
                username: tmpname,
                pic: defaultpic,
                pid: mypid,
                attendance: false
            })

            Ref = database.ref('Profile/' + mypid)
            Ref.update({
                username: tmpname,
                pic: defaultpic,
                pid: mypid,
                attendance: false
            })
            //初期状態を確保することで読み取りからの書き込みを可能にする
            Ref = database.ref('Account/' + uid + '/group/')
            Ref.update({
                groups: ','
            })
            //初期状態を確保することで読み取りからの書き込みを可能にする
            Ref = database.ref('Account/' + uid + '/project')
            Ref.update({
                projects: ","
            })
        }
    }
    //リスナーをデタッチ
    database.ref('Account/' + uid + '/profile/').off(snapshot.val())
})
let currentGroupKey//現在のGroupKey
let pids = []//peerのpid配列

let promise_currentGroupKey = new Promise(function (resolve, reject) {
    try {
        database.ref('Account/' + uid + '/profile/currentgroup').on('value', function (snapshot) {
            currentGroupKey = snapshot.val().groupkey
            resolve(currentGroupKey)
            database.ref('Account/' + uid + '/profile/currentgroup').off(snapshot.val())
        })
    } catch (e) { reject(e) }
})
promise_currentGroupKey.then(function (currentGroupKey) {
    //////////////////////////////////////////////////
    Init_func_currentGroupKey(currentGroupKey)
    /////////////////////////////////////////////////
    //peer pid get
    let promise_pid = new Promise(function (resolve, reject) {
        try {
            database.ref('Group/' + currentGroupKey + '/profile').on('child_added', function (snapshot) {
                let pid = snapshot.val().pid
                if (pid != mypid) pids.push(pid)
                resolve()
                database.ref('Group/' + currentGroupKey + '/profile').off(snapshot.val())
            })
        } catch (e) { reject(e) }
    })
    promise_pid.then(function () {
        ///////////////////////////////////////////////////////////////////////////////////////                          
        card(pids)
        /////////////////////////////////////////////////////////////////////////////////////////////
    })
    //currentGroupKey取得とprofile自動書き込み
    let promise_profile = new Promise(function (resolve, reject) {
        try {
            let Ref = database.ref('Account/' + uid + '/profile/')
            Ref.once('value').then(function (snapshot) {
                let tmp = []
                tmp.name = snapshot.val().username
                tmp.pic = snapshot.val().pic
                resolve(tmp)
            })
        } catch (e) { reject(e) }
    })
    promise_profile.then(function (value) {
        Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid)
        Ref.update({
            username: value.name,
            pic: value.pic,
            pid: mypid
        })
    })

})

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//現在の日付と時間を文字列で返すグローバル関数
let Today = function () {
    var dt = new Date()
    //年
    var year = dt.getFullYear()
    //月
    //1月が0、12月が11。そのため+1をする。
    var month = dt.getMonth() + 1
    //日
    var date = dt.getDate()
    //曜日
    //日曜が0、土曜日が6。配列を使い曜日に変換する。
    dateT = ["日", "月", "火", "水", "木", "金", "土"]
    var day = dateT[dt.getDay()]
    //時
    var hours = dt.getHours()
    //分
    var minutes = dt.getMinutes()
    //秒
    var seconds = dt.getSeconds()

    /*var ToDate = String(year) + "年" + String(month) + "月" + String(date) + "日"
        + " (" + String(day) + ") " + String(hours) + ":" + String(minutes)
        + ":" + String(seconds);*/
    var ToDate = String(year) + "/" + String(month) + "/" + String(date) + "/" + " " +
        + String(hours) + ":" + String(minutes) + ":" + String(seconds)

    return ToDate;
}