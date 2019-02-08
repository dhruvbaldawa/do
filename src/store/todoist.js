import TodoistService from '../services/Todoist';

// const types = {

// }

const todoistModule = {
  // the all great state
  state: {
    credentials: {
      oAuthToken: '',
    },
    syncToken: '*',
    data: {
      projects: {},
      labels: {},
      user: {},
    },
  },

  getters: {
    getToken: (state) => state.credentials.oAuthToken,
  },

  mutations: {
    setOAuthToken: (state, token) => {
      state.credentials = {...state.credentials, oAuthToken: token};
    },

    setSyncToken: (state, syncToken) => {
      state.syncToken = syncToken;
    },

    setTodoistData: (state, { user, projects, labels }) => {
      state.data = { user, projects, labels };
    },
  },

  actions: {
    login({ commit }, token) {
      const service = new TodoistService(token);
      return new Promise((resolve, reject) => {
        service.initialSync().then((response) => {
          commit('setOAuthToken', token);
          commit('setSyncToken', response.data.sync_token);
          commit('setTodoistData', {
            user: response.data.user,
            projects: response.data.projects,
            labels: response.data.labels,
          });
          resolve();
        }).catch(reject);
      });
    },
  },
};

export default todoistModule;
