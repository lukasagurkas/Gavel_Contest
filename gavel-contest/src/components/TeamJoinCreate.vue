<template>
  <div class="container">
    <div class="header">
    <button class="button" style = "float: right;" @click="logOut">Log out</button>
      <h1>Digital Tabletop Competition</h1>
    </div>
    <div class="content">
      <div class="create-team">
        <div v-if="teamName">
          <p><b>Your team is:</b> {{ teamName }}</p>
        </div>
        <div v-else>
          <h2>You are not part of a team</h2>
        </div>
        <input id="create-team-name-input" name="team-name" type="name" class = "text" placeholder="Enter Team Name" />
        <br/>
        <button class = "button" style="margin-top:10px" @click="createTeam">Create new team</button>
        <br />
        <div class="error" />
        <br />
        <alert-dialogue ref="createTeamAlert"></alert-dialogue>
      </div>
      <div class="teams">
        <h2>Teams:</h2>
        <br/>
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
      getTeamName(vm);
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
      } else {
        document.querySelector("#continueError").innerHTML = "Please join a team before going further. This can be done by (1) entering a unique team name and pressing the `Create New Team` button, or (2) by clicking on an existing team in the list and entering the password, which you can get from someone who is already in the team."
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
        })
        .then(() => this.showTeamAlert())
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
      await this.getUserTeam(vm.email).then((result) => {if (result.data){router.push("/success")}})
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
    },

    async showTeamAlert() {
      await this.$refs.createTeamAlert.show({
          title: "Created a team",
          message: "You have created a team! Now you can add two other people to this team by sharing the team password with them. After this you can upload your code. After the deadline you will be able to see the results of each match-up.",
          okButton: "Okay",
        }).then(() => this.reroute(this.email));
    }
  },
};
</script>

<style scoped>
.error, .uploadError {
  color: red;
}

.team-list {
  height: 210px;
  margin-top: -40px;
  list-style-type: none;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.team-list::-webkit-scrollbar {
  display: none;
}

.team-name {
  padding: 0.5em 1em;
  background-color: #1a2e3f;
  color: #F2FFED;
  border: 0.1px solid #F2FFED;
  border-radius: 2px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  width: 33%;
  height: 1em;
  margin-top: 5px;
  font-family: 'Fira Sans';
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  margin-left: 125px;
}

.button {
  padding: 0.5em 1em;
  background-color: #4BB052;
  color: #F2FFED;
  border: 0.1px solid #F2FFED;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  font-family: 'Fira Sans';
}

.button_sign_out {
  padding: 0.5em 1em;
  background-color: #dee2e6;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  margin-right: 20px;
}

.text {
  padding: 0.5em 1em;
  background-color: #ffffff;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.upload-button {
  padding: 0.5em 1em;
  background-color: #dee2e6;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  margin-left: 5px;
  align: "right";
}

/* Split the screen in half */
.split {
  height: 100%;
  width: 50%;
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: hidden;
  padding-top: 20px;
}

/* Control the left side */
.left {
  left: 0;
  background-color: #ffffff;
  margin-left: 20px;
}

/* Control the right side */
.right {
  right: 0;
  background-color: #ffffff;
  margin-right: 20px;
}

.header {
  width: 100%;
  margin: 1rem;
  height: 50px;
}

.header .button {
  margin-right: 50px;
  float: right;
}

.container {
  font-family: 'Fira Sans';
}

.content {
  width: 70%;
  height: 200px;
  padding: 2rem;
  padding-bottom: 100px;
  margin-left: 15%;
  text-align: center;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 75px;
}

.create-team {
  width: 40%;
  display: inline-block;
}

.teams {
  width: 50%;
  float: right;
  text-align: center;
}

#create-team-name-input::placeholder {
  text-align: center;
}
</style>
