<template>
  <q-page>
    <template v-if="tasks.length">
      <q-list>
        <task-card v-for="task in tasks" :key="task.id" :task="task"></task-card>
      </q-list>
    </template>
  </q-page>
</template>

<style></style>

<script>
import { createNamespacedHelpers } from 'vuex';
import { getToken } from '../services/TokenAuth.js';
import TodoistService from '../services/Todoist.js';
import TaskCard from '../components/TaskCard';

const { mapGetters: mapTodoistGetters } = createNamespacedHelpers('todoist');
const { mapState: mapFiltersState, mapMutations: mapFilterMutations } = createNamespacedHelpers('todoist/filter');

export default {
  name: 'FilterView',
  components: {
    TaskCard,
  },
  props: {
    filter: String,
  },
  computed: {
    ...mapTodoistGetters(['oAuthToken']),
    ...mapFiltersState(['tasks']),
  },
  methods: {
    ...mapFilterMutations(['setTasks']),
  },
  async mounted() {
    // @TODO: think how to handle local storage, within the container or action
    await this.$store.dispatch('todoist/login', getToken());
    const service = new TodoistService(this.oAuthToken);
    const tasks = await service.getTasksByFilter(this.filter);
    this.setTasks(tasks);
  },
};
</script>
