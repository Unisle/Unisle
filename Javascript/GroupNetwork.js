
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
            if (groups == '') groups = groupkey + ','
            else groups += groupkey + ','
            list = groups.split(',')
            for (let li of list) if (li.length > 1 && li != groupkey) _list += li + ','
            _list += groupkey + ','
            Ref = database.ref('Account/' + uid + '/group/')
            Ref.update({
                groups: _list
            })

            Ref = database.ref('Account/' + uid + '/profile' + '/currentgroup')
            Ref.update({
                groupkey: groupkey
            })

            Ref = database.ref('Account/' + uid + '/profile')
            Ref.once('value').then(function (snapshot) {
                let name = snapshot.val().username
                let pic = snapshot.val().pic
                let bio = snapshot.val().bio
                let Ref = database.ref('Group/' + groupkey + '/profile/' + mypid)
                Ref.update({
                    username: name,
                    pic: pic,
                    bio: bio,
                    pid: mypid
                })

            })

        })
    }

    getGroups_join_makeButton() {
        let Ref = database.ref('Account/' + uid + "/group")
        Ref.once('value').then(function (snapshot) {
            let _list = snapshot.val().groups
            let list = _list.split(',')
            for (let l of list) if (l.length > 1) {
                let btn = document.createElement('button')
                btn.type = 'button'
                btn.onclick = function () {
                    //onclick function
                    //GroupNetwork.join(l)
                }
                btn.textContent = l + 'に参加'

                let a_element = document.createElement('a')
                a_element.innerHTML = '<a' + ' class="dropdown-item"' + ' id="BB"' + '</a>'
                let parent_object = document.getElementById('joinGroups')
                parent_object.appendChild(a_element)
                parent_object = document.getElementById('BB')
                parent_object.appendChild(btn)
            }
            //createButton(l)
        })
        window.location.reload(true)
    }

}
