class GroupNetwork {
    constructor() {

    }

    create(name) {
        let groupkey = database.ref('Group/').push().key
        let Ref = database.ref('Account/' + uid + '/group/')
        Ref.once('value').then(function (snapshot) {
            let groups = ''
            let list = []
            let _list = ''
            groups = snapshot.val().groups
            if (groups === '') groups = groupkey + ','
            else groups += groupkey + ','
            list = groups.split(',')
            for (let li of list) if (li.length > 1) _list += li + ','

            Ref = database.ref('Account/' + uid + '/group/')
            Ref.update({
                groups: _list
            })

            Ref = database.ref('Group/' + groupkey)
            Ref.update({
                groupname: name,
                groupkey: groupkey
            })

            Ref = database.ref('Account/' + uid + '/profile' + '/currentgroup')
            Ref.update({
                groupkey: groupkey
            })
        })
    }

    join(groupkey) {
        //groupkey is String
        let Ref = database.ref('Account/' + uid + '/group').once('value', function (snapshot) {
            let groups = ''
            let list = []
            let _list = ''
            groups = snapshot.val().groups
            if (groups === '') groups = groupkey + ','
            else groups += groupkey + ','
            list = groups.split(',')
            for (let li of list) if (li.length > 1) _list += li + ','

            Ref = database.ref('Account/' + uid + '/group/')
            Ref.update({
                groups: _list
            })

            Ref = database.ref('Account/' + uid + '/profile' + '/currentgroup')
            Ref.update({
                groupkey: groupkey
            })

        })
    }

}
