import TodoistService from '../services/Todoist';
import { uid } from 'quasar';

const PRIORITY_COLORS = {
  1: 'grey-4',
  2: 'yellow-6',
  3: 'amber-10',
  4: 'red-14',
};

const LABEL_COLORS = [
  '#019412',
  '#a39d01',
  '#e73d02',
  '#e702a4',
  '#9902e7',
  '#1d02e7',
  '#0082c5',
  '#555555',
  '#008299',
  '#03b3b2',
  '#ac193d',
  '#82ba00',
  '#111111',
];

const PROJECT_COLORS = [
  '#95ef63',
  '#ff8581',
  '#ffc471',
  '#f9ec75',
  '#a8c8e4',
  '#d2b8a3',
  '#e2a8e4',
  '#cccccc',
  '#fb886e',
  '#ffcc00',
  '#74e8d3',
  '#3bd5fb',
  '#dc4fad',
  '#ac193d',
  '#d24726',
  '#82ba00',
  '#03b3b2',
  '#008299',
  '#5db2ff',
  '#0072c6',
  '#000000',
  '#777777',
];

const filterModule = {
  namespaced: true,
  state: {
    tasks: [],
  },
  getters: {},
  mutations: {},
  actions: {},
};

const todoistModule = {
  namespaced: true,
  modules: {
    filter: filterModule,
  },

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

    getPriorityColor: () => (priority) => PRIORITY_COLORS[priority],

    getProjectById: (state) => (id) => state.data.projects.find((project) => project.id === id),

    getLabelById: (state) => (id) => state.data.labels.find((label) => label.id === id),

    getLabelColor: () => (id) => LABEL_COLORS[id],

    getProjectColor: () => (id) => PROJECT_COLORS[id],
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

    async updateItemDate({ commit, getters }, {id, dueDateUtc = null, dateString = null}) {
      const service = new TodoistService(getters.oAuthToken);
      const commandUuid = uid();
      const command = {
        type: 'item_update',
        args: {
          id,
          due_date_utc: dueDateUtc,
          date_string: dateString,
        },
        uuid: commandUuid,
      };

      try {
        const response = await service.doSync([command]);
        commit('setSyncToken', response.sync_token);

        if (response.data.sync_status[commandUuid] !== 'ok') {
          Promise.reject(response.data.sync_status[commandUuid]);
        }
      } catch (err) {
        Promise.reject(err);
      }
    },

    async getItem({ getters }, id) {
      const service = new TodoistService(getters.oAuthToken);
      return service.getTask(id);
    },

    async closeItem({ getters }, id) {
      const service = new TodoistService(getters.oAuthToken);
      return service.closeTask(id);
    },
  },
};

export default todoistModule;
