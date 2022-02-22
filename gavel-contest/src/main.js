import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/compat/app'
import router from './router'
import VuejsDialog from "vuejs-dialog"
import { firebaseConfig } from './helpers/firebase.config'

Vue.use(VueRouter)
Vue.use(VuejsDialog)

new Vue({
  router,
  created() {
    let self = this;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        self.$router.push('/success')
      } else {
        self.$router.push('/auth')
      }
     });
    },
  el: '#app',
  render: h => h(App)
});