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
    oAuthToken: (state) => state.credentials.oAuthToken,
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
    async login({ commit }, token) {
      const service = new TodoistService(token);
      try {
        const response = await service.initialSync();
        commit('setOAuthToken', token);
        commit('setSyncToken', response.data.sync_token);
        commit('setTodoistData', {
          user: response.data.user,
          projects: response.data.projects,
          labels: response.data.labels,
        });
      } catch (err) {
        Promise.reject(err);
      }
    },
  },
};

export default todoistModule;
