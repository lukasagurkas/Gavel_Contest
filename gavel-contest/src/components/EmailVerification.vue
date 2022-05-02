<template>
  <div>
    <div class="verificationResponse" />
    <div>
      <p><b>Current email:</b> {{ email }}</p>
    </div>
    <p>Please verify your email</p>
    <div>
      <button class="resend-button" @click="resendVerificationEmail">
        Resend
      </button>
      <button
        style="margin-left: 20px"
        class="continue-button"
        @click="emailVerified"
      >
        Continue
      </button>
      <div class="error" />
    </div>
    <div style="margin-top: 20px">
      <input
        name="new-email"
        type="email"
        class="text"
        placeholder="Enter new email"
      />
      <button
        style="margin-left: 5px"
        class="setNewEmail-button"
        @click="setNewEmail"
      >
        Set new email address
      </button>
      <div class="errorSettingNewEmail" />
    </div>
    <button style="margin-top: 20px" class="logout-button" @click="logOut">
      Log out
    </button>
    <div class="verificationError" />
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import router from "../router";
import AuthenticationService from "@/services/AuthenticationService";
import Vue from "vue";

export default {
  data() {
    return {
      email: "",
      user: {},
    };
  },
  mounted() {
    var vm = this;
    var reg = this.register;
    var userLocal;

    firebase.auth().onAuthStateChanged(function (user) {
      vm.email = user.email;
      vm.user = user;
      userLocal = user;
      if (user.emailVerified) {
        reg(vm);
        router.push("/teams");
      } else {
        user.sendEmailVerification();
      }
    });

    let temp =
      "Verification email sent. It might take a couple of minutes to appear in your inbox. If it doesn't apper after a couple of minutes press the resend button.";
    document.querySelector(".verificationResponse").innerHTML = temp;
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
    async register(vm) {
      try {
        await AuthenticationService.register({
          email: vm.email,
          name: vm.name,
        });
      } catch (error) {}
    },
    async resendVerificationEmail() {
      await firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          let temp =
            "Verification email re-sent. It might take a couple of minutes to appear in your inbox";
          document.querySelector(".verificationResponse").innerHTML = temp;
          document.querySelector(".verificationError").innerHTML = "";
        })
        .catch((error) => {
          console.log(error);
          document.querySelector(".verificationError").innerHTML = error;
        });
    },
    emailVerified() {
      let vm = this
      firebase.auth().currentUser.reload();
      if (firebase.auth().currentUser.emailVerified) {
        vm.register(vm);
        router.push("/teams");
      } else {
        document.querySelector(".error").innerHTML =
          "Email was not verified or try pressing the Continue button again or try reloading the page";
      }
    },
    async setNewEmail() {
      const user = firebase.auth().currentUser;

      const newEmail = document.querySelector("input[name=new-email]").value;
      document.querySelector("input[name=new-email]").value = "";

      user
        .updateEmail(newEmail)
        .then(() => {
          this.email = firebase.auth().currentUser.email;
          console.log("User email updated");
        })
        .catch((error) => {
          console.log(error);
          document.querySelector(".errorSettingNewEmail").innerHTML =
            "To change your email address you have to sign out, sign in and try again.";
        });
    },
  },
};
</script>

<style scoped>
.error,
.verificationError {
  color: red;
}

.logout-button,
.resend-button,
.continue-button,
.setNewEmail-button {
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
</style>