<template>
  <div>
		<div>
			<p>Current email:</p>
			<p>{{ email }}</p>
		</div>
    <p>Please verify your email</p>
    <div>
      <button @click="resendVerificationEmail">Resend</button>
      <button @click="emailVerified">Continue</button>
      <div class="error"/>
    </div>
    <div>
      <input name="new-email" type="email" placeholder="Enter new email" />
      <button @click="setNewEmail">Set new email address</button>
			<div class="errorSettingNewEmail"/>
    </div>
    <button @click="logOut">Log out</button>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import router from "../router";
import AuthenticationService from "@/services/AuthenticationService";

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
    firebase.auth().onAuthStateChanged(function (user) {
			vm.email = user.email;
      if (user.emailVerified) {
        reg(vm);
        router.push("/teams");
      }
    });
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
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          console.log("Verification email sent");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    emailVerified() {
      const user = firebase.auth().currentUser;
			console.log(user.emailVerified)
      if (user.emailVerified) {
        router.push("/teams");
      } else {
        document.querySelector(".error").innerHTML =
          "Email was not verified or try reloading the page";
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
.error {
  color: red;
}
</style>