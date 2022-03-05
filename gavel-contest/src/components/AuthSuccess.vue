<template>
  <div>
    <h1>Signup succeeded</h1>
    <button @click="logOut">Log out</button>
    <hr />
    <input name="team-name" type="name" placeholder="Enter Team Name" />
    <button @click="createTeam">Create new team</button>
    <br />
    <div class="error" v-html="error" />
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
    <input type="file" id="selectFiles" value="Import" accept=".json" /><br />
    <!--for displaying json <pre id="result"></pre>-->

    <div id="selectTeamName1Div">
      <label for="Team 1">Choose team 1:</label>

      <select name="Team 1" id="Team 1">
        <option
          v-for="(data, index) in teamJSON.data"
          :key="index"
        >
          {{ data.name }}
        </option>
      </select>
    </div>
    <div id="selectTeamName2Div">
      <label for="Team 2">Choose team 2:</label>

      <select name="Team 2" id="Team 2">
        <option
          v-for="(data, index) in teamJSON.data"
          :key="index"
          >
          {{ data.name }}
        </option>
      </select>
    </div>
    <button id="import" @click="onUploadGame">Upload game and team information</button>

    <div class="error_upload_game" v-html="error" />
    <!--<img :src="photo" style='height: 120px'> <br>
    <p>{{name}}</p>
    <p>{{email}}</p>
    <p>{{userId}}</p>
    <hr>
    <pre>{{user}}</pre>-->

    <div id="selectGameDiv">
      <label for="selectGame">Select which game you want to view:</label>

      <select name="selectGame" id="selectGame" v-model="selectedGameVModel">
        <option
          v-for="(data, index) in gameListJSON.data"
          :key="index" :value="data.id"
        >
          {{ data.team1Name + " &emsp; | &emsp; " + data.team2Name }}
        </option>
      </select>
    </div>

    <button id="import" @click="viewGame">View game</button>

    <div>
      <p hidden id="gameId">
        {{selectedGameVModel.id}}
      </p>
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
import GameInfoServe from "@/services/GameInfoService";
import GameGetterService from "@/services/GameGetterService";

export default {
  data() {
    return {
      photo: "",
      userId: "",
      name: "",
      email: "",
      user: {},
      teamJSON: {},
      gameJSON: {},
      gameListJSON: {}
    };
  },
  mounted() {
    var vm = this;
    var reg = this.register;
    var team = this.getTeams;
    var games = this.getGames;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        vm.user = user;
        vm.name = vm.user.displayName;
        vm.email = vm.user.email;
        vm.photo = vm.user.photoURL;
        vm.userId = vm.user.uid;
        reg(vm);
      }
    });

    team();
    games();
  },
  components: {
    ConfirmDialogue,
    AlertDialogue,
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
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
      const ok = await this.$refs.confirmDialogue.show({
        title: "Join " + name,
        message: "Are you sure you want to join team '" + name + "'?",
        okButton: "Join",
      });
      if (ok) {
        try {
          await TeamCreationService.join({
            email: firebase.auth().currentUser.email,
            name: name,
          });
        } catch (error) {
          await this.$refs.alertDialogue.show({
            title: "You did not join team " + name,
            message: "You are already a member of a team",
            okButton: "Okay",
          });
        }
      } else {
      }
    },
    async onUploadGame() {
      {
        const files = document.getElementById("selectFiles").files;
        if (files.length <= 0) {
          return false;
        }

        const fr = new FileReader();

        fr.onload = async (e) => {
          const result = JSON.parse(e.target.result);
          const formatted = JSON.stringify(result, null, 2);
          // document.getElementById("result").innerHTML = formatted; // Displays json
          const team1NameTemp = document.querySelector("#selectTeamName1Div select"); 
          const team2NameTemp = document.querySelector("#selectTeamName2Div select"); 

          const team1Name = team1NameTemp.selectedOptions[0].innerHTML;
          const team2Name = team2NameTemp.selectedOptions[0].innerHTML;

          console.log("Team 1:", team1Name);
          console.log("Team 2:", team2Name);

          try {
            await GameInfoServe.uploadGame({
              gameJSON: formatted,
              team1Name: team1Name,
              team2Name: team2Name
            });
          } catch (error) {
            document.querySelector(".error_upload_game").innerHTML =
              error.response.data.error;
          }
        };
        fr.readAsText(files.item(0));
      }
    },
    async viewGame() {
      const gameName = document.querySelector("#selectGameDiv select");

      //const gameId = document.querySelector("#selectGameDiv option:checked").value;

      const gameId = document.querySelector("#gameId").innerHTML;

      console.log(gameName.selectedOptions[0].innerHTML)
      console.log(gameId)
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