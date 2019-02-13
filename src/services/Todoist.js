import axios from 'axios';
import qs from 'qs';

export default class TodoistService {
  constructor(token) {
    this.token = token;
    this.rest_client = axios.create({
      baseURL: 'https://beta.todoist.com/API/v8/',
      headers: { Authorization: `Bearer ${this.token}` },
    });

    this.sync_client = axios.create({
      baseURL: 'https://todoist.com/api/v7/',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
  }

  async initialSync() {
    return this.sync_client.post(
      '/sync',
      qs.stringify({
        token: this.token,
        sync_token: '*',
        resource_types: '["labels", "projects", "user"]',
      }),
    );
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

  async doSync(commands) {
    return new Promise((resolve, reject) => {
      this.sync_client
        .post('/sync', qs.stringify({ token: this.token, commands: JSON.stringify(commands) }))
        .then((response) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}
