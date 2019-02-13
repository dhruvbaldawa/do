import { isLoggedIn } from '../services/TokenAuth';

function requireLogin(to, from, next) {
  if (!isLoggedIn()) {
    next('/login');
  }
  next();
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Filter.vue'),
        props: { filter: 'today' },
        beforeEnter: requireLogin,
      },
      {
        path: 'login',
        component: () => import('pages/Login.vue'),
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
