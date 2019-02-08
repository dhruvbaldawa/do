import TodoistService from '../services/Todoist';

// const types = {

// }

const PRIORITY_COLOR = {
  1: 'grey-4',
  2: 'yellow-6',
  3: 'amber-10',
  4: 'red-14',
};

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

    getPriorityColor: () => (priority) => PRIORITY_COLOR[priority],
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
