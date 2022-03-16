import VueRouter from 'vue-router';
import Auth from './components/Auth.vue';
import AuthSuccess2 from './components/AuthSuccess2.vue';
import EmailVerification from './components/EmailVerification.vue';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Auth },
    { path: '/auth', component: Auth },
    { path: '/success', component: AuthSuccess2 },
    { path: '/verifyEmail', component: EmailVerification }
  ]
});

export default router;