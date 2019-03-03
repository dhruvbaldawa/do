<template>
  <q-page>
    <template v-if="hasItems">
      <q-list>
        <template v-if="title">
          <q-item-label header class="text-h6">{{ this.title }}</q-item-label>
          <q-separator />
        </template>
        <task-card v-for="task in filteredItems" :task="task" :key="task.id"> </task-card>
      </q-list>
    </template>
    <template v-else>
      <h5>No tasks</h5>
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
    filter: {
      type: Function,
      required: true,
    },
    sort: [Function, Array],
    title: String,
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
      return _.chain(this.items)
        .filter(filterFn)
        .sortBy(this.sort)
        .values();
    },
  },

  async mounted() {
    // @TODO: think how to handle local storage, within the container or action
    await this.$store.dispatch('todoist/login', getToken());
  },
};
</script>
