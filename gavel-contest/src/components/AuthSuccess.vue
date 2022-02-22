<template>
  <div>
    <h1>Signup succeeded</h1>
    <button @click='logOut'>Log out</button>
    <hr>
    <input name='team-name' type='name' placeholder='Enter Team Name'>
    <button @click='createTeam'>Create new team</button>
    <br>
    <div class="error" v-html="error"/>
    <br>
    <div>
      <ul class="team-list">
        <li class="team-name" @click='clickedTeam(data.name)' v-for="(data, index) in teamJSON.data" :key="index">{{data.name}}</li>
        <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
        <alert-dialogue ref="alertDialogue"></alert-dialogue>
      </ul>
    </div>
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
import TeamGetterService from '@/services/TeamGetterService'
import ConfirmDialogue from '../components/ConfirmDialogue.vue'
import AlertDialogue from '../components/AlertDialogue.vue'

export default {
 data(){
     return {
       photo: '',
       userId: '',
       name: '',
       email: '',
       user: {},
       teamJSON: {}
     }
   },
   mounted() {
     var vm = this
     var reg = this.register
     var team = this.getTeams
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

    team()
  },
  components: { 
    ConfirmDialogue, 
    AlertDialogue
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
      try {
        await AuthenticationService.register({
            email: vm.email,
            name: vm.name
          });
      } catch (error) {}
    },
    async getTeams() {
      try {
        this.teamJSON = await TeamGetterService.getAll()
      } catch (error) {

      }
    },
    async clickedTeam(name) {
      const ok = await this.$refs.confirmDialogue.show({
                title: 'Join ' + name,
                message: 'Are you sure you want to join team \'' + name + '\'?',
                okButton: 'Join',
            })
            if (ok) {
                try {
                  await TeamCreationService.join({
                    email: firebase.auth().currentUser.email,
                    name: name
                  })
                } catch (error) {
                  await this.$refs.alertDialogue.show({
                    title: 'You did not join team ' + name,
                    message: 'You are already a member of a team',
                    okButton: 'Okay',
                  })
                }
            } else {

            }
    }
  },
};
</script>



<style scoped>
.error {
  color: red
}

.team-list {
  list-style-type: none;
}

.team-name {
  padding: 0.25em 0.5em;
  background-color: #eccfc9;
  color: #000000;
  border: 2px solid #70352a;
  border-radius: 2px;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  width: 10%;
  height: 1em;
}
</style>