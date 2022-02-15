<template>
  <div>
    <h1>Signup succeeded</h1>
    <button @click='logOut'>Log out</button>
    <hr>
    <img :src="photo" style='height: 120px'> <br>
    <p>{{name}}</p>
    <p>{{email}}</p>
    <p>{{userId}}</p>
    <hr>
    <pre>{{user}}</pre>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'
import AuthenticationService from '@/services/AuthenticationService'

async function register(vm) {
  const response = await AuthenticationService.register({
          email: vm.email,
          name: vm.name
        });
}

export default {
 data(){
     return {
       photo: '',
       userId: '',
       name: '',
       email: '',
       user: {}
     }
   },
   created() {
     var vm = this
     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         vm.user = user;
         vm.name = vm.user.displayName;
         vm.email = vm.user.email;
         vm.photo = vm.user.photoURL;
         vm.userId = vm.user.uid;
         
         register(vm)
      }
    });
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    }
  },
};
</script>