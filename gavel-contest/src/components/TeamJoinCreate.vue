<template>
  <div>
    <div>
      <p>Current team:</p>
      <p>{{ teamName }}</p>
    </div>
    <div>
      <button @click="logOut">Log out</button>
      <hr />
      <input name="team-name" type="name" placeholder="Enter Team Name" />
      <button @click="createTeam">Create new team</button>
      <br />
      <div class="error" />
      <br />
      <div>
        <ul class="team-list">
          <li
            class="team-name"
            @click="clickedTeam(data.name)"
            v-for="(data, index) in teamJSON.data"
            :key="index"
          >
            {{ data.name }}
          </li>
          <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
          <alert-dialogue ref="alertDialogue"></alert-dialogue>
        </ul>
      </div>
      <div>
        <button @click="teamJoinedOrCreated">Continue</button>
        <div class="error" />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import AuthenticationService from "@/services/AuthenticationService";
import TeamCreationService from "@/services/TeamCreationService";
import TeamGetterService from "@/services/TeamGetterService";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";
import AlertDialogue from "../components/AlertDialogue.vue";
import GameGetterService from "@/services/GameGetterService";
import GameListGetterService from "@/services/GameListGetterService";
import UserGetterService from "@/services/UserGetterService";
import axios from "axios";
import router from "../router";

export default {
  data() {
    return {
      teamName: "",
      user: {},
      teamJSON: {},
      email: "",
    };
  },
  mounted() {
    var vm = this;
    var team = this.getTeams;
    var getTeamName = this.getUserTeamName;
    var userIsRegistered = this.userIsRegistered;
    let userRegistered = false;
    firebase.auth().onAuthStateChanged(function (user) {
      vm.email = user.email;
      while (!userRegistered) {
        userRegistered = userIsRegistered(vm.email);
      }
      //getTeamName(vm);
      //vm.reroute(vm.email);
    });
    team();
  },
  components: {
    ConfirmDialogue,
    AlertDialogue,
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
    async reroute(email) {
      var userInTeam;
      userInTeam = await TeamGetterService.getUserInTeam({
        email: email,
      }).then((result) => result.data);

      if (userInTeam) {
        router.push("/success");
      }
    },
    async getTeams() {
      try {
        this.teamJSON = await TeamGetterService.getAll();
      } catch (error) {}
    },
    teamJoinedOrCreated() {
      // const user = firebase.auth().currentUser;
      // if (user.emailVerified) {
      //   router.push("/success");
      // } else {
      //   document.querySelector(".error").innerHTML =
      //     "Team was not joined or created";
      // }
      this.reroute(this.email);
    },
    async createTeam() {
      const val = document.querySelector("input[name=team-name]").value;
      document.querySelector("input[name=team-name]").value = "";
      try {
        await TeamCreationService.create({
          name: val,
          email: firebase.auth().currentUser.email,
        }).then(this.reroute(this.email));
      } catch (error) {
        document.querySelector(".error").innerHTML = error.response.data.error;
      }
    },
    async clickedTeam(name) {
      let err = "";
      let msg = "";
      const ok = await this.$refs.confirmDialogue
        .show({
          title: "Join " + name,
          message: "Are you sure you want to join team '" + name + "'?",
          okButton: "Join",
          email: firebase.auth().currentUser.email,
          name: name,
        })
        .then((message) => {
          msg = message;
        })
        .catch((error) => {
          err = error.message;
        });

      if (!ok && err) {
        await this.$refs.alertDialogue.show({
          title: "You did not join team " + name,
          message: err,
          okButton: "Okay",
        });
      } else if (!err && msg) {
        await this.$refs.alertDialogue.show({
          title: "You joined the team!",
          message: "You successfully joined team " + name,
          okButton: "Okay",
        });
        this.reroute(this.email);
      }
    },
    async getUserTeamName(vm) {
      this.teamName = await this.getUserTeam(vm.email).then(
        (result) => result.data
      );
    },
    async getUserTeam(email) {
      return await TeamGetterService.getUserTeam({
        email: email,
      });
    },
    async userIsRegistered(email) {
      return await UserGetterService.getUserIsRegistered({
        email: email,
      });
    },
    async userIsInTeam(email) {
      return await TeamGetterService.getUserInTeam({
        email: email,
      });
    }
  },
};
</script>

<style scoped>
.error {
  color: red;
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