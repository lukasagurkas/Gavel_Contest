import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/compat/app'
import router from './router'
import VuejsDialog from "vuejs-dialog"
import { firebaseConfig } from './helpers/firebase.config'
import 'firebaseui/dist/firebaseui.css'

Vue.use(VueRouter)
Vue.use(VuejsDialog)

new Vue({
  router,
  created() {
    let self = this;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        if (user.emailVerified) {
          self.$router.push('/teams')
        } else {
          self.$router.push('/verifyEmail')
        }
      } else {
        self.$router.push('/auth')
      }
     });
    },
  el: '#app',
  render: h => h(App)
});