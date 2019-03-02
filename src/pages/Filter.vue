<template>
  <q-page>
    <template v-if="hasItems">
      <q-list>
        <task-card v-for="(task, id) in filteredItems" :task="task" :key="id"> </task-card>
      </q-list>
    </template>
  </q-page>
</template>

<style></style>

<script>
import _ from 'lodash';

import { createNamespacedHelpers } from 'vuex';
import { getToken } from '../services/TokenAuth.js';
import TaskCard from '../components/TaskCard';

const { mapGetters: mapTodoistGetters } = createNamespacedHelpers('todoist');

export default {
  name: 'FilterView',
  components: {
    TaskCard,
  },
  props: {
    filter: Function,
  },
  data() {
    return {
      filteredIds: [],
    };
  },
  computed: {
    ...mapTodoistGetters(['oAuthToken', 'getItemById', 'items', 'data']),
    hasItems() {
      return _.size(this.filteredItems);
    },
    filteredItems() {
      const filterFn = this.filter(this.data);
      return _.filter(this.items, filterFn);
    },
  },

  async mounted() {
    // @TODO: think how to handle local storage, within the container or action
    await this.$store.dispatch('todoist/login', getToken());
  },
};
</script>
