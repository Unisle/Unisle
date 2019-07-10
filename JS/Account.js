/*
Account.js

b1018194 Ito Hajime
*/

/* 依存関係：Network.js */
/**/
class FactoryAccount {

    constructor(network) {
        this.peerAccountList = [];
        this.network = network;//new Network();
        this.network = new Network();// 仮に
    }

    //Use on load
    create() {
        //自分のAccountを作成
        this.MyAccount = new MyAccount(this.network);

        let peerprofiles = this.network.getPeerProfileList();
        for (profiles in peerprofiles) {
            if (profiles.pid != network.getMyPid()) {
                //自分以外のpeerについて
                this.peerAccountList.push(new peerAccount(
                    profiles.pid, profiles.name, profiles.pic, profiles.attendance, this.network));
            }

        }
    }

    getPeerAccountList() {
        return this.peerAccountList;
    }

    getMyAccount() {
        return this.MyAccount;
    }

    freePeerAccountList() {
        this.peerAccountList = [];
    }

    freeMyAccount() {
        this.MyAccount = null;
    }

}

class Account {

    constructor() {

    }

    getname() {
        return 'nanashi';
    }

    getpid() {
        return null;
    }

    getpic() {
        return 0;
    }

    getattendance() {
        return false;
    }

    getpost() {
        return null;
    }

    getschedeule() {
        return null;
    }

    getproject() {
        return null;
    }
}

class peerAccount extends Account {

    constructor(pid, name, pic, attendance, network) {
        super();
        this.name = name;
        this.pid = pid;
        this.pic = pic;
        this.attendance = attendance;
        this.network = network;
    }

    //権限がある行動についてのメソッド群

    getname() {
        return this.name;
    }

    getpid() {
        return this.pid;
    }

    getpic() {
        return this.pic;
    }

    getattendance() {
        return this.attendance;
    }

    getpost() {
        return this.network.getPeerPostList(this.pid);
    }

    getschedeule() {
        return this.network.getPeerScheduleList(this.pid);
    }

    getproject() {
        return this.network.getPeerProjectList(this.pid);
    }
}

class MyAccount extends Account {

    constructor(network) {
        super();
        this.network = network;
    }

    //権限がある行動についてのメソッド群

    getname() {
        return this.network.getMyProfile().name;
    }

    getpid() {
        return this.network.getMyProfile().pid;
    }

    getpic() {
        return this.network.getMyProfile().pic;
    }

    getattendance() {
        return this.network.getMyProfile().attendance;
    }

    getpost() {
        return this.network.getMyPostList();
    }

    getschedeule() {
        return this.network.getMyScheduleList();
    }

    getproject() {
        return this.network.getMyProjectList();
    }

    editprofile(List) {

    }

    setpost(message) {

    }

    deletepost(key) {

    }

    makeproject(List) {

    }

    joinproject(key) {

    }

    deleteproject(key) {

    }

    editproject(key) {

    }

    makegroup(name, key) {
        //簡単にできないようにすべきか？
    }

    joingroup(key) {
        //招待があった場合
    }



}