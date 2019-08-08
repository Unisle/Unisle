class ProjectNetwork {
    constructor() {
    }

    create(title, content, recruit, period, density) {
        //List contains title, content_message, recruit_message, period, density_message, member
        //member is pid Array, othres is String
        let date = Today()
        let projectkey = database.ref('Group/' + currentGroupKey + '/project/').push().key//一括管理のための最重要key
        let Ref = database.ref('Account/' + uid + '/project')
        let projects
        let member
        //Account/uid/projectsからprojects(一覧)を取り出す。それに乗じてすべての処理を行う
        Ref.once('value').then(function (snapshot) {
            projects = snapshot.val().projects
            //projects(一覧)を取り出す
            if (projects === undefined) projects = projectkey + ','
            else projects += projectkey + ','
            //新しく作成したprojectを追加して自分の一覧に書き戻す
            Ref.update({
                projects: projects
            })
            //Group/key/projectからproject_list(グループにあるすべてのプロジェクトの一覧)を取り出す
            //それに乗じてグループ内における自分の参加しているプロジェクト一覧を書きこむ
            Ref = database.ref('Group/' + currentGroupKey + '/project')
            Ref.once('value').then(function (snapshot) {
                let tmp = snapshot.val().project_list
                if (tmp != undefined) {
                    //project_listが空じゃないとき
                    let list = tmp
                    list += projectkey + ','
                    //新しく作成したプロジェクトを一覧に書き込む
                    Ref = database.ref('Group/' + currentGroupKey + '/project')
                    Ref.update({
                        project_list: list
                    })
                    let p = ''
                    let lists = list.split(',')
                    let projectlists = projects.split(',')
                    //自分の参加しているすべてのグループのプロジェクトのなかで、現在のグループの中に存在しているプロジェクトを取り出す
                    for (let a of lists) {
                        for (let b of projectlists) {
                            if (a === b && a.length > 1) {
                                p += a + ','
                            }
                        }
                    }
                    //今のグループに存在するプロジェクトで自分の参加しているプロジェクトを書き込む
                    Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
                    Ref.update({
                        projects: p
                    })
                }
                else {
                    //project_listが存在しない初期のグループにおいて
                    Ref = database.ref('Group/' + currentGroupKey + '/project')
                    Ref.update({
                        project_list: projectkey + ','
                    })
                    Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
                    Ref.update({
                        projects: projectkey + ','
                    })
                }
            })
            //参加しているメンバーリストに自分のpidを追加して返す
            Ref = database.ref('Group/' + currentGroupKey + '/project/' + projectkey)
            Ref.once('value').then(function (snapshot) {
                member = snapshot.val().member
            })
            if (member === undefined) member = mypid + ','
            else member += mypid + ','
            Ref.update({
                key: projectkey,
                title: title,
                startdate: date,
                member: member,
                content: content,
                recruit: recruit,
                period: period,
                density: density
            })
        })
    }

    private_join(key) {
        //uid直下、currentGroup/mypid直下の参加project一覧に追加
        //projectのmemberにmypid追加
        let Ref = database.ref('Account/' + uid + '/project')
        Ref.once('value').then(function (snapshot) {
            let projects = snapshot.val().projects
            let list = projects.split(',')
            let joined = false
            for (let li of list) {
                if (li === key) joined = true
            }
            if (joined != true) {
                Ref = database.ref('Account/' + uid + '/project')
                Ref.update({
                    projects: projects + key + ','
                })
                Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
                Ref.once('value').then(function (snapshot) {
                    projects = snapshot.val().projects
                })
                Ref.update({
                    projects: projects + key + ','
                })
                Ref = database.ref('Group/' + currentGroupKey + '/project/' + key)
                Ref.once('value').then(function (snapshot) {
                    let member = snapshot.val().member
                    member += mypid + ','
                    Ref = database.ref('Group/' + currentGroupKey + '/project/' + key)
                    Ref.update({
                        member: member
                    })
                })
            } else alert("既に参加しています")
        })

    }

    private_getout(key) {
        //uid直下、currentGroup/mypid直下の参加project一覧から削除
        //projectのmemberにmypidを削除
        let Ref = database.ref('Account/' + uid + '/project')
        Ref.once('value').then(function (snapshot) {
            let projects = snapshot.val().projects
            let list = projects.split(',')
            let _list = ''
            let joined = false
            for (let li of list) {
                if (li === key)
                    joined = true
                else if (li.length > 1)
                    _list += li + ','
            }
            if (joined != false) {
                Ref = database.ref('Account/' + uid + '/project')
                Ref.update({
                    projects: _list
                })
                Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
                Ref.once('value').then(function (snapshot) {
                    projects = snapshot.val().projects
                })
                list = []
                _list = ''
                list = projects.split(',')
                for (let li of list) {
                    if (li !== key && li.length > 1)
                        _list += li + ','
                }
                Ref.update({
                    projects: _list
                })

                Ref = database.ref('Group/' + currentGroupKey + '/project/' + key)
                Ref.once('value').then(function (snapshot) {
                    let member = snapshot.val().member
                    list = []
                    list = member.split(',')
                    _list = ''
                    for (let li of list) {
                        if (li !== mypid && li.length > 1)
                            _list += li + ','
                    }
                    Ref = database.ref('Group/' + currentGroupKey + '/project/' + key)
                    Ref.update({
                        member: _list
                    })
                })
            } else alert("参加していません")
        })
    }

    private_delete(key, ProjectNetwork) {
        //uid直下、currentGroup/mypid直下の参加project一覧から削除
        //projectのrefを削除する
        //projectのproject_listから削除するprojectのkeyを取り除いて返す
        ProjectNetwork.private_getout(key)
        let Ref = database.ref('Group/' + currentGroupKey + '/project/' + key)
        Ref.remove()
        let promise = new Promise(function (resolve, reject) {
            try {
                let Ref = database.ref('Group/' + currentGroupKey + '/project/')
                Ref.once('value').then(function (snapshot) {
                    let project_list = snapshot.val().project_list
                    let list = project_list.split(',')
                    let _list = ''
                    for (let li of list) {
                        if (li !== key && li.length > 1) _list += li + ','
                    }
                    resolve(_list)
                })
            } catch (e) { reject(e) }
        })

        promise.then(function (value) {
            let Ref = database.ref('Group/' + currentGroupKey + '/project')
            Ref.update({
                project_list: value
            })
        })
    }

    update() {
        //projectはグループで共有されるためpeerが削除したProjectが存在しないことが判明したら
        //自分のproject一覧からそれを削除する必要がある
        //Group直下の自分のproject一覧と全体のproject一覧を比較
        Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
        Ref.once('value').then(function (snapshot) {
            let projects = snapshot.val().projects
            let mylist = projects.split(',')
            Ref = database.ref('Group/' + currentGroupKey + '/project')
            Ref.once('value').then(function (snapshot) {
                let alllist = snapshot.val().project_list
                let alist = alllist.split(',')
                let list = ''
                for (let m of mylist) {
                    for (let a of alist) {
                        if (m === a && m.length > 1) list += a + ','
                    }
                }
                Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
                Ref.update({
                    projects: list
                })
            })
        })
    }

    getMine_makeButton(ProjectNetwork) {
        //Group/直下のpost一覧からmypidでクエリしてpostを取得する
        let createButton = function (value) {
            let contentBlock = document.getElementById('projectkey')
            contentBlock.insertAdjacentHTML('afterbegin', value.key)
            let btn = document.createElement('button')
            btn.type = 'button'
            btn.onclick = function () {
                //onclick function
                alert(value.title + ' : ' + value.key)
                ProjectNetwork.private_delete(value.key, ProjectNetwork)
                ProjectNetwork.update()
            }
            btn.textContent = value.key + ':  Delete'
            let pbtn = document.getElementById('projectbtn')
            pbtn.appendChild(btn)
        }

        let List = new Promise(function (resolve, reject) {
            try {
                let Ref = database.ref('Group/' + currentGroupKey + '/profile/' + mypid + '/project')
                Ref.once('value').then(function (snapshot) {
                    let projects = snapshot.val().projects
                    let list = []
                    list = projects.split(',')
                    resolve(list)
                })
            } catch (e) { reject(e) }
        })
        //一応Promiseを返す
        return List.then(function (list) {
            return new Promise(function (resolve, reject) {
                try {
                    let project = []
                    for (let key of list) {
                        project.push(new Promise(function (resolve, reject) {
                            try {
                                let Ref = database.ref('Group/' + currentGroupKey + '/project/' + key)
                                Ref.once('value').then(function (snapshot) {
                                    if (snapshot.val().key != null) {
                                        let project = []
                                        project.key = snapshot.val().key
                                        project.title = snapshot.val().title
                                        project.startdate = snapshot.val().startdate
                                        project.member = snapshot.val().member
                                        project.content = snapshot.val().content
                                        project.recruit = snapshot.val().recruit
                                        project.period = snapshot.val().period
                                        project.density = snapshot.val().density
                                        resolve(project)
                                    }
                                })
                            } catch (e) { reject(e) }
                        }))
                    }
                    for (let p of project) p.then(function (value) { createButton(value) })
                    resolve(project)
                } catch (e) { reject(e) }
            })
        })
    }

    getPeer(pid) {
        //Group/直下のpost一覧からpeerpidでクエリしてpostを取得する
    }
}