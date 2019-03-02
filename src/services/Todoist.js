import axios from 'axios';
import qs from 'qs';

const SYNCED_RESOURCE_TYPES = '["labels", "projects", "user", "items"]';

export default class TodoistService {
  constructor(token) {
    this.token = token;
    this.rest_client = axios.create({
      baseURL: 'https://beta.todoist.com/API/v8/',
      headers: { Authorization: `Bearer ${this.token}` },
    });

    this.sync_client = axios.create({
      baseURL: 'https://todoist.com/api/v7.4/',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
  }

  async getTask(id) {
    return new Promise((resolve, reject) => {
      this.rest_client
        .get(`/tasks/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }

  async closeTask(id) {
    return new Promise((resolve, reject) => {
      this.rest_client
        .post(`/tasks/${id}/close`)
        .then((response) => {
          resolve(response.status === 204);
        })
        .catch(reject);
    });
  }

  async getTasksByFilter(filter) {
    return new Promise((resolve, reject) => {
      this.rest_client
        .get('/tasks', { params: { filter } })
        .then((response) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }

  async sync(syncToken, commands = []) {
    const payload = {
      token: this.token,
      resource_types: SYNCED_RESOURCE_TYPES,
      sync_token: syncToken,
    };

    if (commands.length) {
      payload.commands = JSON.stringify(commands);
    }

    return new Promise((resolve, reject) => {
      this.sync_client
        .post('/sync', qs.stringify(payload))
        .then((response) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}
