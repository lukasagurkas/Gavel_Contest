<!-- TODO: not used -->
<template>
  <div>
    <div>
      <input name="new-email" type="email" placeholder="Enter new email" />
      <button @click="setNewEmail">Set new email address</button>
    </div>
    <button @click="logOut">Log out</button>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import router from "../router";
import UserGetterService from "@/services/UserGetterService";
import UserUpdateEmailService from "@/services/UserUpdateEmailService";

export default {
	data() {
    return {
      email: "",
      user: {},
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user.emailVerified) {
        router.push("/success");
      }
    });
    //this.email = user.email;
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
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
      if (user.emailVerified) {
        router.push("/success");
      } else {
        document.querySelector(".error").innerHTML =
          "Email was not verified. Try again.";
      }
    },
    async setNewEmail() {
      const user = firebase.auth().currentUser;

      const credential = promptForCredentials();

      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          console.log("User re-authenticated");
        })
        .catch((error) => {
          console.log(error);
        });

			try {
        this.user = await UserGetterService.getUser({
          email: user.email,
        });
      } catch (error) {}

      const newEmail = document.querySelector("input[name=new-email]").value;
      document.querySelector("input[name=new-email]").value = "";

			try {
        this.user = await UserUpdateEmailService.updateUserEmail({
          email: newEmail,
					id: user.id,
        });
      } catch (error) {}

      user
        .updateEmail(newEmail)
        .then(() => {
          //this.email = firebase.auth().currentUser.email;
          console.log("User email updated");
        })
        .catch((error) => {
          console.log(error);
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