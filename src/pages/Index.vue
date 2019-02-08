<template>
  <q-page>
    <template v-if="tasks.length">
      <q-card v-for="task in tasks" :key="task.id" class="q-ma-md">
        <q-card-media style="height:150px" class="bg-amber-8">
          <q-card-title slot="overlay" class="flex flex-top">
            {{ task.content }}
            <span slot="subtitle">{{ task.project_id }}</span>
          </q-card-title>
        </q-card-media>
        <q-list>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="flag"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile>{{ task.label_ids }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-if="task.due.recurring">
            <q-item-side>
              <q-item-tile color="primary" icon="repeat"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile>{{ task.due.string }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
        <q-card-separator/>
        <q-card-actions>
          <q-btn flat round dense icon="event"/>
          <q-btn flat label="5:30PM"/>
          <q-btn flat label="7:30PM"/>
          <q-btn flat label="9:00PM"/>
          <q-btn flat color="primary" label="Reserve"/>
        </q-card-actions>
      </q-card>
    </template>
  </q-page>
</template>

<style></style>

<script>
import {mapGetters} from 'vuex';
import {getToken} from '../services/TokenAuth.js';
import TodoistService from '../services/Todoist.js';

export default {
  name: 'IndexPage',
  data: () => ({
    tasks: [],
  }),
  computed: {
    ...mapGetters(['oAuthToken']),
  },
  async mounted() {
    // @TODO: think how to handle local storage, within the container or action
    await this.$store.dispatch('login', getToken());
    const service = new TodoistService(this.oAuthToken);
    const tasks = await service.getTasksByFilter('overdue | today');
    this.tasks = tasks;
    // this.$data.tasks = tasks;
  },
};
</script>
