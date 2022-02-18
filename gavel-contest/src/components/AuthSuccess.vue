<template>
  <div>
    <h1>Signup succeeded</h1>
    <button @click='logOut'>Log out</button>
    <hr>
    <input name='team-name' type='name' placeholder='Enter Team Name'>
    <button @click='createTeam'>Create new team</button>
    <!--<img :src="photo" style='height: 120px'> <br>
    <p>{{name}}</p>
    <p>{{email}}</p>
    <p>{{userId}}</p>
    <hr>
    <pre>{{user}}</pre>-->
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'
import AuthenticationService from '@/services/AuthenticationService'
import TeamCreationService from '@/services/TeamCreationService'

async function register(vm) {
  const response = await AuthenticationService.register({
          email: vm.email,
          name: vm.name
        });
}

async function createNewTeam(info) {
  await TeamCreationService.create({
    name: info.name,
    email: info.email
  })
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
    },
    createTeam() {
      const val = document.querySelector("input[name=team-name]").value
      document.querySelector("input[name=team-name]").value = ''
      createNewTeam({
        name: val,
        email: firebase.auth().currentUser.email
      })
    }
  },
};
</script>