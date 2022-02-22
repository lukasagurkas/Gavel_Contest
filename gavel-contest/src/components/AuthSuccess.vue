<template>
  <div>
    <h1>Signup succeeded</h1>
    <button @click='logOut'>Log out</button>
    <hr>
    <input name='team-name' type='name' placeholder='Enter Team Name'>
    <button @click='createTeam'>Create new team</button>
    <br>
    <div class="error" v-html="error"/>
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
   mounted() {
     var vm = this
     var reg = this.register
     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         vm.user = user;
         vm.name = vm.user.displayName;
         vm.email = vm.user.email;
         vm.photo = vm.user.photoURL;
         vm.userId = vm.user.uid;    
         reg(vm) 
      }
    });


  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
    async createTeam() {
      const val = document.querySelector("input[name=team-name]").value
      document.querySelector("input[name=team-name]").value = ''
      try{
        await TeamCreationService.create({
          name: val,
          email: firebase.auth().currentUser.email
        })
      } catch (error) {
        document.querySelector(".error").innerHTML = error.response.data.error
      }
    },
    async register(vm) {
    await AuthenticationService.register({
            email: vm.email,
            name: vm.name
          });
    }
  },
  
};
</script>

<style scoped>
.error {
  color: red
}
</style>