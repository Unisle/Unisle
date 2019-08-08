class ScheduleNetwork {
    constructor() { }

    create(message, type) {
        let Ref = database.ref('Schedule/')
        let key = database.ref('Schedule/').push().key
        Ref = database.ref('Schedule/' + key)
        Ref.update({
            date: Today(),
            message: message,
            type: type,
            owner: mypid,
            selfkey: key
        })
    }

    get() {
        //取得した後に削除する
        let Ref = database.ref('Schedule/').orderByChild('owner').equalTo(mypid)
        let schedule = []
        Ref.on('child_added', function (snapshot) {
            schedule.date = snapshot.val().date
            schedule.message = snapshot.val().member
            schedule.type = snapshot.val().type
            schedule.owner = snapshot.val().owner
            schedule.selfkey = snapshot.val().selfkey

            schedule.sort(function (a, b) {
                return (a.date < b.date ? 1 : -1)
            })
            ///
            //表示処理
            ///
            Ref.off(snapshot.val())
        })
    }

    delete(key) {
        database.ref('Schedule/' + key).delete()
    }
}