<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
//import "firebaseui/dist/firebaseui.css";

export default {
  name: "auth",
  mounted() {
    var uiConfig = {
      signInSuccessUrl: "/verifyEmail",
      signInOptions: [
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      // callbacks: {
      //   signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      //     var user = authResult.user;

      //     if (authResult.additionalUserInfo.isNewUser) {
      //       console.log("new signin");
      //       user.sendEmailVerification();
      //     }

      //     return true;
      //   },
      // },
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<style lang="css">
</style>