<template>
  <div>
    <h1>Signup succeeded</h1>
    <v-btn @click="logOut">Log out</v-btn>
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
    <br />
    <div>
      <button @click="showTeamPassword">Get Team Password</button>
      <p id="teamPasswordField"></p>
    </div>

    <div id="selectGameDiv">
      <label for="selectGame">Select which game you want to view:</label>

      <select name="selectGame" id="selectGame">
        <option v-for="(data, index) in gameList" :key="index">
          {{ data }}
        </option>
      </select>
    </div>

    <button id="gameViewerLink" @click="getGameName()">View Game</button>
    <br />
    <div class="file-upload">
      <input type="file" @change="onFileChange" />
      <button
        @click="onUploadFile"
        class="upload-button"
        :disabled="!this.selectedFile"
      >
        Upload file
      </button>
    </div>
    <button @click="deleteUserTeam()">Delete User teams</button>
    <div class="uploadResponse" />
    <div class="uploadError" />
    <button @click="gototestpage()">AuthSuccess222222</button>
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
import router from "../router";

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
    gototestpage() {
      router.push("/AuthSuccess2");
    },
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
    },
    onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile); // appending file
      formData.append("teamName", this.teamName);

      // sending file to the backend
      axios
        .post("http://localhost:7081/uploadFile", formData) //TODO
        //.post("/contest/api/uploadFile", formData)
        .then((res) => {
          document.querySelector(".uploadResponse").innerHTML = res;
        })
        .catch((err) => {
          document.querySelector(".uploadError").innerHTML =
            err.response.data.error;
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

      let cipher = "";
      await GameGetterService.getCipher({
        name: this.gameNameList[index],
      }).then((res) => {
        cipher = res.data;
      });

      window.open("http://localhost:8000/?game=" + cipher); //TODO
      //window.open("/contest/visualizer/?game=" + cipher)
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

    async deleteUserTeam() {
      await TeamCreationService.delete();
    },
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