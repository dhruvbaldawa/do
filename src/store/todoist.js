import { uid } from 'quasar';
import _ from 'lodash';
import TodoistService from '../services/Todoist';

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

const todoistModule = {
  namespaced: true,
  state: {
    credentials: {
      oAuthToken: '',
    },
    syncToken: '*',
    data: {
      projects: {},
      labels: {},
      user: {},
      items: {},
    },
  },

  getters: {
    items: (state) => state.data.items,

    oAuthToken: (state) => state.credentials.oAuthToken,

    syncToken: (state) => state.syncToken,

    getPriorityColor: () => (priority) => PRIORITY_COLORS[priority],

    getProjectById: (state) => (id) => state.data.projects[id],

    getLabelById: (state) => (id) => state.data.labels[id],

    getItemById: (state) => (id) => state.data.items[id],

    getLabelByName: (state) => (name) => {
      return _.values(state.data.labels).find((label) => label.name === name);
    },

    getLabelColor: () => (id) => LABEL_COLORS[id],

    getProjectColor: () => (id) => PROJECT_COLORS[id],
  },

  mutations: {
    setOAuthToken: (state, token) => {
      state.credentials = { ...state.credentials, oAuthToken: token };
    },

    setSyncToken: (state, syncToken) => {
      state.syncToken = syncToken;
    },

    setTodoistData: (
      state,
      { user, projects: projectsData, labels: labelsData, items: itemsData, fullSync },
    ) => {
      if (!fullSync) {
        projectsData = _.assign(state.data.projects, _.keyBy(projectsData, 'id'));
        itemsData = _.assign(state.data.items, _.keyBy(itemsData, 'id'));
        labelsData = _.assign(state.data.labels, _.keyBy(labelsData, 'id'));
      }

      const projects = _.chain(projectsData)
        .filter((item) => !_.some([item.is_archived, item.is_deleted]))
        .keyBy('id')
        .value();

      const items = _.chain(itemsData)
        .filter((item) => !_.some([item.is_archived, item.is_deleted, item.checked]))
        .keyBy('id')
        .value();

      const labels = _.chain(labelsData)
        .filter(['is_deleted', 0])
        .keyBy('id')
        .value();

      state.data = {
        user,
        projects,
        labels,
        items,
      };
    },
  },

  actions: {
    async login({ commit, dispatch }, token) {
      const service = new TodoistService(token);
      try {
        const response = await service.sync('*');
        commit('setOAuthToken', token);
        dispatch('handleResponse', response);
      } catch (err) {
        Promise.reject(err);
      }
    },

    /**
     * @param {*} ditch
     * @param {*} taskArgs - can have
     *  - content
     *  - priority
     *  - labels
     *  - due_date_utc
     *  - date_string
     *  - read docs - https://developer.todoist.com/sync/v7/#update-an-item
     */
    async updateItem({ dispatch, getters }, taskArgs) {
      const service = new TodoistService(getters.oAuthToken);
      const commandUuid = uid();
      const command = {
        type: 'item_update',
        args: {
          ...taskArgs,
        },
        uuid: commandUuid,
      };

      try {
        const response = await service.sync(getters.syncToken, [command]);

        dispatch('handleResponse', response);

        if (response.sync_status[commandUuid] !== 'ok') {
          Promise.reject(response.sync_status[commandUuid]);
        }
      } catch (err) {
        Promise.reject(err);
      }
    },

    async sync({ dispatch, getters }) {
      const service = new TodoistService(getters.oAuthToken);
      const response = await service.sync(getters.syncToken);
      dispatch('handleResponse', response);
    },

    handleResponse({ commit }, response) {
      commit('setSyncToken', response.sync_token);
      commit('setTodoistData', {
        user: response.user,
        projects: response.projects,
        labels: response.labels,
        items: response.items,
        fullSync: response.full_sync,
      });
    },

    async closeItem({ getters }, id) {
      const service = new TodoistService(getters.oAuthToken);
      return service.closeTask(id);
    },
  },
};

export default todoistModule;
