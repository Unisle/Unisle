
class AccountNetwork {
    constructor() { }

    setProfile(name, pic, bio, currentGroupKey) {
        //username is String, pic is number
        let Ref = database.ref('Account/' + uid + '/profile')
        let _pic
        if (pic == 'Akko0') _pic = 0
        else if (pic == 'Akko1') _pic = 1
        else if (pic == 'Sucy0') _pic = 2
        else if (pic == 'Sucy1') _pic = 3
        else _pic = 4

        Ref.update({
            username: name,
            pic: _pic,
            bio: bio
        })

        Ref = database.ref('Profile/' + mypid)
        Ref.update({
            username: name,
            pic: _pic,
            bio: bio
        })
        if (currentGroupKey.length > 2) {
            Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid)
            Ref.update({
                username: name,
                pic: _pic,
                bio: bio,
                pid: mypid
            })
        }
    }

    isLogin() {
        //Loginしているかどうかに加えてpidが生成されていない初期状態に必要な処理
        if (uid == undefined) return false
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
            return true
        }
    }

    getpeer() {
        let contentBlock = document.getElementById('pids')
        for (let p of pids) contentBlock.insertAdjacentHTML('afterbegin', p + '  ')
    }

    getcurrentGroup() {
        let Ref = database.ref('Group/' + currentGroupKey)
        Ref.once('value').then(function (snapshot) {
            let tmp = []
            tmp.name = snapshot.val().groupname
        })
    }

}