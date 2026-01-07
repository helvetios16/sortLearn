import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Visualize from '../views/Visualize.vue';
import Compare from '../views/Compare.vue';
import Learn from '../views/Learn.vue';
import UnderConstruction from '../views/UnderConstruction.vue';
import Test from '../views/Test.vue';
import { featureFlags } from '../features';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/visualize',
      name: 'visualize',
      component: Visualize,
      beforeEnter: (to, from, next) => {
        if (featureFlags.visualize) {
          next();
        } else {
          next({ name: 'under-construction' });
        }
      },
    },
    {
      path: '/compare',
      name: 'compare',
      component: Compare,
      beforeEnter: (to, from, next) => {
        if (featureFlags.compare) {
          next();
        } else {
          next({ name: 'under-construction' });
        }
      },
    },
    {
      path: '/learn',
      name: 'learn',
      component: Learn,
      beforeEnter: (to, from, next) => {
        if (featureFlags.learn) {
          next();
        } else {
          next({ name: 'under-construction' });
        }
      },
    },
    {
      path: '/under-construction',
      name: 'under-construction',
      component: UnderConstruction,
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
  ],
});

export default router;
