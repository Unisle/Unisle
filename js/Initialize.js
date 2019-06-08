/*
Initialize.js

b1018194 Ito Hajime

<!-- Firebase App is always required and must be first -->
<!-- Firebase App に以下を設定してください>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-app.js"></script>
<!-- Add additional services that you want to use -->
<!-- 以下から必要なものを追加してください /基本的にはすべて追加して問題ありません/>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-messaging.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-functions.js"></script>
*/
    // Firebaseの初期化
var config = {
       apiKey: "AIzaSyB91yPNhjOREC8S8RXEAoUaZa1gsj7s0MY",
       authDomain: "unisle-dbba5.firebaseapp.com",
       databaseURL: "https://unisle-dbba5.firebaseio.com",
    };
    
    firebase.initializeApp(config);