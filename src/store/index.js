import Vue from 'vue';
import Vuex from 'vuex';

import 'es6-promise/auto';
import todoistModule from './todoist.js';

Vue.use(Vuex);

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
