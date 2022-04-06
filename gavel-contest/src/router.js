import VueRouter from 'vue-router';
import Auth from './components/Auth.vue';
import AuthSuccess from './components/AuthSuccess.vue';
import EmailVerification from './components/EmailVerification.vue';
import TeamJoinCreate from './components/TeamJoinCreate.vue';

const router = new VueRouter({
  mode: 'history',
  base: '/contest/',
  routes: [
    { path: '/', component: Auth },
    { path: '/auth', component: Auth },
    { path: '/success', component: AuthSuccess },
    { path: '/verifyEmail', component: EmailVerification },
    { path: '/teams', component: TeamJoinCreate }
  ]
});

export default router;