<template>
<div class="container">
    <div class="header">
      <button class="button" style="float: right" @click="logOut">
        Log out
      </button>
      <h1>Digital Tabletop Competition</h1>
    </div>
    <div class="content">
      <div class="your-team">
        <div v-if="teamName">
        <h2><b>Your team is:</b> {{ teamName }}</h2>
        <button class="button" style="margin-bottom: 20px" @click="leaveTeam">Leave Team</button>
        <delete-dialogue ref="deleteDialogue"></delete-dialogue>
        </div>
        <div v-else>
          <h2>You are not part of a team</h2>
        </div>
        <div v-if="!teamName">
          <input
          name="team-name"
          class="text"
          type="name"
          placeholder="Enter Team Name"
          />
          <button class="button" style="margin-left: 20px" @click="createTeam">
          Create new team
          </button>
          <br />
          <div class="error"></div>
          <br />
          <alert-dialogue ref="createTeamAlert"></alert-dialogue>
        </div>
        <button class="button" @click="showTeamPassword">
            Get Team Password
          </button>
          <p id="teamPasswordField"></p>
        <button class="button" @click="viewDocumentation()">View Documentation</button>
      </div>
      <!-- <div class="teams">
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
      </div> -->
      <div class="other">
          
          <h1>Visualize Games</h1>
          <div id="selectGameDiv">
            <label for="gameFilter">Search for games</label>
            <br />
            <input
              type="text"
              name="gameFilter"
              id="gameFilter"
              placeholder="Search games"
              v-model="gameFilter"
              @input="getGameList"
            />
            <br />
            <label for="selectGame">Select which game you want to view:</label>

            <select name="selectGame" id="selectGame">
              <option v-for="(data, index) in gameList" :key="index">
                {{ data }}
              </option>
            </select>
          </div>
          <button class="button" id="gameViewerLink" @click="getGameName()">
            View Game
          </button>
          <br />
          <h2>Upload Source Code</h2>
          <div class="file-upload">
            <input type="file" id="uploadSourceFile" @change="onFileChange" />
            <button
              @click="onUploadFile"
              class="button"
              :disabled="!this.selectedFile"
            >
              Upload file
            </button>
          </div>
          <div style="margin-bottom: 20px; margin-top: 20px" class="uploadResponse" />
          <div style="margin-bottom: 20px; margin-top: 20px" class="uploadError" />
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
import DeleteDialogue from "../components/DeleteDialogue.vue"
import GameGetterService from "@/services/GameGetterService";
import GameListGetterService from "@/services/GameListGetterService";
import UserTeamDeletionService from "@/services/UserTeamDeletionService";
import axios from "axios";
import { upload_file_path } from "../configurations/config.js";

const config = require("../configurations/config.js");

export default {
  data() {
    return {
      photo: "",
      userID: "",
      name: "",
      email: "",
      teamName: "",
      user: {},
      teamJSON: {},
      gameJSON: {},
      gameListJSON: {},
      gameList: "",
      gameNameList: "",
      selectedFile: "",
      gameFilter: "",
    };
  },
  mounted() {
    var vm = this;
    var reg = this.register;
    var team = this.getTeams;
    var games = this.getGames;
    var gamelist = this.getGameList;
    var getTeamName = this.getUserTeamName;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        vm.user = user;
        vm.name = vm.user.displayName;
        vm.email = vm.user.email;
        vm.photo = vm.user.photoURL;
        vm.userID = vm.user.uid;
        //reg(vm);
        getTeamName(vm);
      }
    });
    team();
    games();
    gamelist();
  },
  components: {
    ConfirmDialogue,
    AlertDialogue,
    DeleteDialogue
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
    async getUserTeamName(vm) {
      this.teamName = await this.getUserTeam(vm.email).then(
        (result) => result.data
      );
    },
    async createTeam() {
      const val = document.querySelector("input[name=team-name]").value;
      document.querySelector("input[name=team-name]").value = "";
      try {
        await TeamCreationService.create({
          name: val,
          email: firebase.auth().currentUser.email,
        }).then((response) => {if (response.status === 200) {this.teamName = val}})
          .then(() => {this.teamJSON.data = this.getTeams()})
          .then(() => this.showTeamAlert())
      } catch (error) {
        document.querySelector(".error").innerHTML = error.response.data.error;
      }
    },
    async register(vm) {
      try {
        await AuthenticationService.register({
          email: vm.email,
          name: vm.name,
        });
      } catch (error) {}
    },
    async getTeams() {
      try {
        this.teamJSON = await TeamGetterService.getAll();
      } catch (error) {}
    },
    async getGames() {
      try {
        this.gameListJSON = await GameGetterService.getAll();
      } catch (error) {}
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
          if (msg) {
            this.teamName = name
          }
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
      }
    },

    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
      if (selectedFile.size > 1474560) {
        alert("File exceeds 1474560 bytes");
        document.getElementById("uploadSourceFile").value = "";
      }
    },
    onUploadFile() {
      document.querySelector(".uploadResponse").innerHTML = "";
      document.querySelector(".uploadError").innerHTML = "";

      const formData = new FormData();
      formData.append("file", this.selectedFile); // appending file
      formData.append("teamName", this.teamName);

      document.getElementById("uploadSourceFile").value = "";

      var now = new Date();
      var deadline = new Date(2022, 4, 21, 23, 59, 0, 0);

      if (now <= deadline) {
        // sending file to the backend
        axios
          .post(config.upload_file_path, formData)
          .then((res) => {
            document.querySelector(".uploadResponse").innerHTML = res.data;
          })
          .catch((err) => {
            document.querySelector(".uploadError").innerHTML =
              err.response.data.error;
          });
      } else {
        alert(
          "The deadline of " + deadline + " has passed"
        );
      }
    },

    async getGameName() {
      var link = document.querySelector("#gameViewerLink");
      const index = this.gameList.indexOf(
        document
          .querySelector("#selectGameDiv select")
          .selectedOptions[0].innerHTML.trim()
      );

      let cipher = "";
      await GameGetterService.getCipher({
        name: this.gameNameList[index],
      }).then((res) => {
        cipher = res.data;
      });

      window.open(config.visualize_game_path + cipher);
    },
    async getGameList() {
      let rawGames = await GameListGetterService.getGames();
      let gameNames = [];
      let displayNames = [];

      rawGames = rawGames.data;
      const email = firebase.auth().currentUser.email;
      let teamName = "";
      await this.getUserTeam(email)
        .then((result) => result.data)
        .then((data) => {
          teamName = data.replace(" ", "_");
        });

      for (let i = 0; i < rawGames.length; i++) {
        
        if (rawGames[i].indexOf(this.gameFilter) !== -1) {
          if (
            rawGames[i].indexOf("-" + teamName) !== -1 &&
            rawGames[i].indexOf("-T2") !== -1
          ) {
            // user in second team, team 2 specific
            gameNames.push(rawGames[i].slice(0, rawGames[i].lastIndexOf(".")));
            displayNames.push(
              rawGames[i]
                .slice(0, rawGames[i].lastIndexOf("-T2"))
                .replace(/_/g, " ")
            );
          } else if (
            rawGames[i].indexOf("-" + teamName) === -1 && // user in first team, team 1 specific
            rawGames[i].indexOf(teamName) !== -1 &&
            rawGames[i].indexOf("-T1") !== -1
          ) {
            gameNames.push(rawGames[i].slice(0, rawGames[i].lastIndexOf(".")));
            displayNames.push(
              rawGames[i]
                .slice(0, rawGames[i].lastIndexOf("-T1"))
                .replace(/_/g, " ")
            );
          } else if (
            rawGames[i].indexOf("-G") !== -1 &&
            rawGames[i].indexOf(teamName) === -1 &&
            rawGames[i].indexOf("-T1") === -1 &&
            rawGames[i].indexOf("-T2") === -1
          ) {
            // general game
            gameNames.push(rawGames[i].slice(0, rawGames[i].lastIndexOf(".")));
            displayNames.push(
              rawGames[i]
                .slice(0, rawGames[i].lastIndexOf("-G"))
                .replace(/_/g, " ")
            );
          }
        }
      }
      this.gameList = displayNames;
      this.gameNameList = gameNames;
    },
    async getUserTeam(email) {
      return await TeamGetterService.getUserTeam({
        email: email,
      });
    },
    async showTeamPassword() {
      let password = "";
      await TeamGetterService.getPassword({
        email: firebase.auth().currentUser.email,
      })
        .then((result) => result.data)
        .then((data) => {
          password = data;
        });

      document.querySelector("#teamPasswordField").innerHTML = password;
      await new Promise((resolve) => setTimeout(resolve, 5000)).catch();
      document.querySelector("#teamPasswordField").innerHTML = "";
    },

    async leaveTeam() {
      let err = "";
      let msg = "";
      const ok = await this.$refs.deleteDialogue
        .show({
          title: "Leave " + this.teamName,
          message: "Are you sure you want to leave team '" + this.teamName + "'?",
          okButton: "Leave",
          email: firebase.auth().currentUser.email,
          name: this.teamName,
        })
        .then((message) => {
          msg = message;
          if (msg) {
            this.teamName = ""
          }
        })
        .catch((error) => {
          err = error.message;
        });

      if (!ok && err) {
        await this.$refs.alertDialogue.show({
          title: "You did not leave team " + this.teamName,
          message: err,
          okButton: "Okay",
        });
      } else if (!err && msg) {
        await this.$refs.alertDialogue.show({
          title: "You left the team",
          message: "You successfully left team " + this.teamName,
          okButton: "Okay",
        });
      }
    },
    async showTeamAlert() {
      await this.$refs.createTeamAlert.show({
          title: "Created a team",
          message: "You have created a team! Now you can add two other people to this team by sharing the team password with them. After this you can upload your code. After the deadline you will be able to see the results of each match-up.",
          okButton: "Okay",
        });
    },
    viewDocumentation() {
      window.open(`https://digital-tabletop-competition.github.io/`)
    }
  },
};
</script>


<style scoped>
.error,
.uploadError {
  color: red;
}

.team-list {
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
  width: 30em;
  height: 1em;
  margin-top: 5px;
  font-family: 'Fira Sans';
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  margin: auto;

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
  align: "right";
}

.view-game {
  padding: 0.5em 1em;
  background-color: #dee2e6;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 20px;
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

.your-team {
  width: 25%;
  padding: 1rem;
  display:inline-block;
  box-sizing: border-box;
  vertical-align: top;
  text-align: center;
}

/* .teams {
  width: 40%;
  height: 500px;
  background-color: #ffffff;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  text-align: center;
  padding-right: 40px;
}

.teams h2 {
  padding-left: 40px;
} */
.other {
  width: 65%;
  height: 400px;
  padding: 1rem;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
}

</style>