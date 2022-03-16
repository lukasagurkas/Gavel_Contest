<template>
  <v-app id="inspire">
    <v-app-bar
        app
        color="white"
        flat
    >

      <v-tabs
          centered
          class="ml-n9"
          color="grey darken-1"
      >
      </v-tabs>

      <v-btn @click="logOut">Log out</v-btn>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col
              cols="12"
              sm="2"
          >
            <!--  -->
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
              <v-text-field
                  v-model="teamName"
                  :counter="10"
                  :rules="nameRules"
                  label="Team Name"
                  required
              ></v-text-field>

              <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="createTeam()"
              >
                Validate
              </v-btn>
            </v-form>
            <!-- -->
          </v-col>

          <v-col
              cols="12"
              sm="8"
          >
            <v-sheet
                min-height="70vh"
                rounded="lg"
            >
              <v-card>
                <v-list dense>
                  <v-subheader>Teams</v-subheader>
                  <v-list-item-group
                      v-model="selectedItem"
                      color="primary"
                  >
                    <v-list-item
                        v-for="(data, index) in teamJSON.data"
                        :key="index"
                        @click="clickedTeam(data.name)"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="data.name"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
                <alert-dialogue ref="alertDialogue"></alert-dialogue>
              </v-card>
            </v-sheet>
          </v-col>

          <v-col
              cols="12"
              sm="2"
          >
            <!--  -->
            <v-file-input type="file" id="selectFiles"  accept=".json" @change="onFileChange"/>
            <v-btn id="import" @click="onUploadFile" :disabled="!this.selectedFile">
              Upload source code
            </v-btn>

            <v-select
                v-model = "selectedGame"
                :items="gameList"
                item-text='data'
                item-value='index'
                label="Select Games to play"
                return-object
            ></v-select>

            <v-btn ref="gameViewerLink" v-bind:href="'http://localhost:8000/?game='+ selectedGame" @click="getGameName()" target="_blank">View Game</v-btn>
            <br/>
            <!--  -->
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
import GameSenderService from "@/services/GameSenderService"
import GameListGetterService from "@/services/GameListGetterService"
import SourceCodeUploadService from "@/services/SourceCodeUploadService"

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
      gameListJSON: {},
      gameList: ["abcd","abcd"],
      selectedFile: "",
      selectedItem: 1,
      valid: true,
      teamName: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      selectedGame: "",
    };
  },
  mounted() {
    var vm = this;
    var reg = this.register;
    var team = this.getTeams;
    var games = this.getGames;
    var gamelist = this.getGameList;
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
    async createTeam() {
      const val = this.teamName;
      this.teamName = "";
      try {
        await TeamCreationService.create({
          name: val,
          email: firebase.auth().currentUser.email,
        });
      } catch (error) {
        await this.$refs.alertDialogue.show({
          title: "You did not create a team",
          message: "You are already a member of a team",
          okButton: "Okay",
        });
        this.$refs.form.reset()
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

    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
      console.log(this.selectedFile)
    },

    async onUploadFile() {
      const formData = new FormData();
      console.log(this.selectedFile)
      formData.append("file", this.selectedFile);  // appending file
      for (var pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }
      await SourceCodeUploadService.uploadFile({
        content: formData,
        email: firebase.auth().currentUser.email
      })
    },

    getGameName() {
      var selectedGame = this.selectedGame;
      //var link = document.querySelector(".gameViewerLink");
      this.setAttribute("href", "http://localhost:8000/?game=" + selectedGame);
      return false;
    },
    async getGameList() {
      let rawGames = await GameListGetterService.getGames()
      const gameNames = []
      rawGames = rawGames.data
      for (let i = 0; i < rawGames.length; i++) {
        gameNames.push(rawGames[i].slice(0, rawGames[i].lastIndexOf('.')))
      }
      this.gameList = gameNames
    }
  },
};
</script>