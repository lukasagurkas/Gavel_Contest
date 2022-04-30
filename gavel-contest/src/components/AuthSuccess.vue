<template>
  <div>
    <button class="button_sign_out" style = "float: right;" @click="logOut">Log out</button>
    <h1>Name of the game</h1>
    <hr />
    <div v-if="teamName">
      <p>Your team is:</p>
      <p>{{ teamName }}</p>
    </div>
    <div v-else>
      <p>You are not part of a team</p>
    </div>
    
    <input name="team-name" class = "text" type="name" placeholder="Enter Team Name" />
    <button class="button" style="margin-left: 20px" @click="createTeam">Create new team</button>
    <br />
    <div class="error" />
    <br />
    <div>
      <div style = "width:50%; float:left"> <ul class="team-list" >
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
      </ul> </div>
      <div style = "width:50%; float:right">
        <h1> Visualize Games</h1>
        <div id="selectGameDiv">
          <label for="gameFilter">Search for games</label>
          <br/>
          <input type="text" name="gameFilter" id="gameFilter" v-model="gameFilter" @input="getGameList"/>
          <br/>
          <label for="selectGame">Select which game you want to view:</label>

          <select name="selectGame" id="selectGame">
            <!-- <option
              v-for="(data, index) in gameListJSON.data"
              :key="index"
              :value="data.id"
            >
              {{ data.team1Name + " &emsp; | &emsp; " + data.team2Name }}
            </option> -->
            <option v-for="(data, index) in gameList" :key="index">
              {{ data }}
            </option>
          </select>
        </div>

        <!-- <button id="import" @click="viewGame">View game</button>

        <button @click="getGame">View Game</button>
        <div>
          <p hidden id="gameId"></p>
        </div> -->
        <button  class="view-game" id="gameViewerLink" @click="getGameName()">View Game</button>
        <br />
        <h1> File Upload Section</h1>
        <div class="file-upload">
          <input type="file" id="uploadSourceFile" @change="onFileChange" />
          <button
              @click="onUploadFile"
              class="upload-button"
              :disabled="!this.selectedFile"
          >
            Upload file
          </button>
        </div>
        <div class="uploadResponse" />
        <div class="uploadError" />
      </div>
    </div>
    <br />
    <div>
      <button class="button" @click="showTeamPassword">Get Team Password</button>
      <p id="teamPasswordField"></p>
    </div>

    <button class="button" @click="deleteUserTeam()">Delete User teams</button>

    <!-- <input type="file" id="selectFiles" value="Import" accept=".json" /><br />
    for displaying json <pre id="result"></pre>

    <div id="selectTeamName1Div">
      <label for="Team 1">Choose team 1:</label>

      <select name="Team 1" id="Team 1">
        <option v-for="(data, index) in teamJSON.data" :key="index">
          {{ data.name }}
        </option>
      </select>
    </div>
    <div id="selectTeamName2Div">
      <label for="Team 2">Choose team 2:</label>

      <select name="Team 2" id="Team 2">
        <option v-for="(data, index) in teamJSON.data" :key="index">
          {{ data.name }}
        </option>
      </select>
    </div>
    <button id="import" @click="onUploadGame">
      Upload game and team information
    </button>

    <div class="error_upload_game"/> -->
    <!--<img :src="photo" style='height: 120px'> <br>
    <p>{{name}}</p>
    <p>{{email}}</p>
    <p>{{userID}}</p>
    <hr>
    <pre>{{user}}</pre>-->

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
import axios from "axios";
import { upload_file_path } from '../configurations/config.js';

const config = require('../configurations/config.js')

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
        });
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

        let err = ""
        let msg = ""
        const ok = await this.$refs.confirmDialogue.show({
          title: "Join " + name,
          message: "Are you sure you want to join team '" + name + "'?",
          okButton: "Join",
          email: firebase.auth().currentUser.email,
          name: name
        }).then(message => {msg = message}).catch(error => {err = error.message})
        
      if(!ok && err) {
        await this.$refs.alertDialogue.show({
            title: "You did not join team " + name,
            message: err,
            okButton: "Okay",
          });
      } else if (!err && msg) {
        await this.$refs.alertDialogue.show({
            title: "You joined the team!",
            message: "You successfully joined team " + name,
            okButton: "Okay"
        })
      }
    },
    // async onUploadGame() {
    //   {
    //     const files = document.getElementById("selectFiles").files;
    //     if (files.length <= 0) {
    //       return false;
    //     }

    //     const fr = new FileReader();

    //     fr.onload = async (e) => {
    //       const result = JSON.parse(e.target.result);
    //       const formatted = JSON.stringify(result, null, 2);
    //       // document.getElementById("result").innerHTML = formatted; // Displays json
    //       // const team1NameTemp = document.querySelector(
    //       //   "#selectTeamName1Div select"
    //       // );
    //       // const team2NameTemp = document.querySelector(
    //       //   "#selectTeamName2Div select"
    //       // );

    //       // const team1Name = team1NameTemp.selectedOptions[0].innerHTML;
    //       // const team2Name = team2NameTemp.selectedOptions[0].innerHTML;

    //       // console.log("Team 1:", team1Name);
    //       // console.log("Team 2:", team2Name);

    //       try {
    //         await GameInfoServe.uploadGame({
    //           gameJSON: formatted,
    //           team1Name: team1Name,
    //           team2Name: team2Name,
    //         });
    //       } catch (error) {
    //         document.querySelector(".error_upload_game").innerHTML =
    //           error.response.data.error;
    //       }
    //     };
    //     fr.readAsText(files.item(0));
    //   }
    // },
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

      // sending file to the backend
      axios
        .post(config.upload_file_path, formData)
        .then((res) => {
          document.querySelector(".uploadResponse").innerHTML = res.data;
        })
        .catch((err) => {
          document.querySelector(".uploadError").innerHTML = err.response.data.error;
        });
    },
    // async viewGame() {
    //   const gameName = document.querySelector("#selectGameDiv select");

    //   //const gameId = document.querySelector("#selectGameDiv option:checked").value;

    //   const gameId = document.querySelector("#gameId").innerHTML;

    //   console.log(gameName.selectedOptions[0].innerHTML);
    //   console.log(gameId);
    // },
    // selectGameId(id) {
    //   document.querySelector("#gameId").innerHTML =
    //     id.target.selectedOptions[0].value;
    // },
    // async getGame() {
    //   const id = document.querySelector("#gameId").innerHTML
    //   const game = this.gameListJSON.data.filter(function(json) {return (json['id'] == id);})[0].game
    //   await GameSenderService.sendGame(game)
    // },
    async getGameName() {
      var link = document.querySelector("#gameViewerLink");
      const index = this.gameList.indexOf(
        document
          .querySelector("#selectGameDiv select")
          .selectedOptions[0].innerHTML.trim()
      );

      let cipher = ""
      await GameGetterService.getCipher({name: this.gameNameList[index]}).then(res => {cipher = res.data})

      window.open(config.visualize_game_path + cipher)
 
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
                .replace("_", " ")
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
                .replace("_", " ")
            );
          } else if (
            rawGames[i].indexOf("-G") !== -1 &&
            rawGames[i].indexOf(teamName) === -1
          ) {
            // general game
            gameNames.push(rawGames[i].slice(0, rawGames[i].lastIndexOf(".")));
            displayNames.push(
              rawGames[i]
                .slice(0, rawGames[i].lastIndexOf("-G"))
                .replace("_", " ")
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

      document.querySelector("#teamPasswordField").innerHTML = password
      await new Promise(resolve => setTimeout(resolve, 5000)).catch() 
      document.querySelector("#teamPasswordField").innerHTML = ''
      
    },

    async deleteUserTeam() {
      await TeamCreationService.delete()
    }
  },
};
</script>


<style scoped>
.error, .uploadError {
  color: red;
}

.team-list {
  list-style-type: none;
}

.team-name {
  padding: 0.5em 1em;
  background-color: #4FB0C6;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 2px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  width: 66%;
  height: 1em;
  margin-top: 5px;
}

.button {
  padding: 0.5em 1em;
  background-color: #dee2e6;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
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

</style>