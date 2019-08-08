class NoticeNetwork {
    constructor() { }

    send_makeButton() {

        let createButton = function (value) {
            let btn = document.createElement('button')
            btn.type = 'button'
            btn.onclick = function () {
                //onclick function
                let Ref = database.ref('Notice/')
                let key = Ref.push().key
                Ref = database.ref('Notice/' + key)
                Ref.update({
                    owner: value,
                    from: mypid,
                    type: 0,
                    day: Today(),
                    selfkey: key
                })
            }
            btn.textContent = value + ':  sendNotice'
            let pbtn = document.getElementById('noticebtn')
            pbtn.appendChild(btn)
        }

        for (let p of pids)
            createButton(p)
    }

    get() {
        let Ref = database.ref('Notice/').orderByChild('owner').equalTo(mypid)
        let notice = []

        Ref.on('child_added', function (snapshot) {
            notice.owner = snapshot.val().owner
            notice.from = snapshot.val().from
            notice.type = snapshot.val().type
            notice.day = snapshot.val().day
            database.ref('Notice/' + snapshot.val().selfkey).delete()
            notice.sort(function (a, b) {
                return (a.date < b.date ? 1 : -1)
            })
            let contentBlock = document.getElementById('notice')
            contentBlock.insertAdjacentHTML('afterbegin', notice.from)
            Ref.off(snapshot.val())
        })

    }

}
