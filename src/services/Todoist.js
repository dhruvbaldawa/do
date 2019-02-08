import axios from 'axios';
import qs from 'qs';

export default class TodoistService {
  constructor(token) {
    this.token = token;
    this.rest_client = axios.create({
      baseURL: 'https://beta.todoist.com/API/v8/',
      headers: {Authorization: `Bearer ${this.token}`},
    });

    this.sync_client = axios.create({
      baseURL: 'https://todoist.com/api/v7/',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
  }

  initialSync() {
    return this.sync_client
      .post('/sync', qs.stringify({token: this.token, sync_token: '*', resource_types: '["labels", "projects", "user"]'}));
  }
}
