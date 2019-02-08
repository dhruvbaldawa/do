<template>
  <q-page>
    <template v-if="tasks.length">
      <task-card v-for="task in tasks" :key="task.id" :task="task" class="q-ma-md"></task-card>
    </template>
  </q-page>
</template>

<style></style>

<script>
import {mapGetters} from 'vuex';
import {getToken} from '../services/TokenAuth.js';
import TodoistService from '../services/Todoist.js';
import TaskCard from '../components/TaskCard';

export default {
  name: 'IndexPage',
  components: {
    TaskCard,
  },
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
