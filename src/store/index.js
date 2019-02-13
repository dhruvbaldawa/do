import Vue from 'vue';
import Vuex from 'vuex';

import todoistModule from './todoist.js';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

// export default function (/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules: {
//       example,
//     },
//   });

//   return Store;
// }

const store = new Vuex.Store({
  modules: {
    todoist: todoistModule,
  },
});

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./todoist'], () => {
    const newTodoistModule = require('./todoist').default; // eslint-disable-line global-require
    store.hotUpdate({ modules: { todoist: newTodoistModule } });
  });
}

export default store;
