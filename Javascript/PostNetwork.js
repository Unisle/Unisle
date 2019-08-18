
class PostNetwork {
    constructor() {
    }

    set(message) {
        //alert('set post')
        let date = Today()
        let key = database.ref('Account/' + uid + '/post/').push().key
        let Ref = database.ref('Account/' + uid + '/post/' + key)

        Ref.update({
            message: message,
            date: date,
            selfkey: key
        })

        key = database.ref('Group/' + currentGroupKey + '/post/').push().key
        Ref = database.ref('Group/' + currentGroupKey + '/post/' + key)

        Ref.update({
            message: message,
            date: date,
            selfkey: key,
            owner: mypid
        })
    }

    delete(key) {
        database.ref('Account/' + uid + '/post/' + key).remove()
        database.ref('Group/' + currentGroupKey + '/post/' + key).remove()
    }

    get() {
        let Ref = database.ref('Group/' + currentGroupKey + '/post/').orderByChild('owner').equalTo(mypid)
        Ref.on('child_added', function (snapshot) {
            let tmp = []
            tmp.message = snapshot.val().message
            tmp.date = snapshot.val().date
            tmp.selfkey = snapshot.val().selfkey
            tmp.owner = snapshot.val().owner
            let contentBlock = document.getElementById('body')
            contentBlock.insertAdjacentHTML('afterbegin', tmp.owner + ' on ' + tmp.message + ' on ' + tmp.date + '$')
            Ref.off(snapshot.val())
        })

    }

}