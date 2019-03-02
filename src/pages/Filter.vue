<template>
  <q-page>
    <template v-if="hasItems">
      <q-list>
        <task-card
          v-for="(task, id) in items"
          :task="task"
          :key="id"
        >
        </task-card>
      </q-list>
    </template>
  </q-page>
</template>

<style></style>

<script>
import _ from 'lodash';

import { createNamespacedHelpers } from 'vuex';
import { getToken } from '../services/TokenAuth.js';
import TodoistService from '../services/Todoist.js';
import TaskCard from '../components/TaskCard';

const { mapGetters: mapTodoistGetters } = createNamespacedHelpers('todoist');
const { mapState: mapFiltersState, mapMutations: mapFilterMutations } = createNamespacedHelpers(
  'todoist/filter',
);

export default {
  name: 'FilterView',
  components: {
    TaskCard,
  },
  props: {
    filter: String,
  },
  data () {
    return {
      filteredIds: [],
    };
  },
  computed: {
    ...mapTodoistGetters(['oAuthToken', 'getItemById']),
    ...mapFiltersState(['tasks']),
    hasItems() {
      return _.size(this.tasks);
    },
    items() {
      return _.reduce(this.filteredIds, (obj, id) => {
        obj[id] = this.getItemById(id);
        return obj;
      }, {});
    },
  },
  methods: {
    ...mapFilterMutations(['setTasks']),
  },
  async mounted() {
    // @TODO: think how to handle local storage, within the container or action
    await this.$store.dispatch('todoist/login', getToken());
    const service = new TodoistService(this.oAuthToken);
    const tasks = await service.getTasksByFilter(this.filter);
    this.filteredIds = _.map(tasks, (task) => task.id);

    this.setTasks(_.reduce(tasks, (obj, item) => {
      obj[item.id] = this.getItemById(item.id);
      return obj;
    }, {}));
  },
};
</script>
