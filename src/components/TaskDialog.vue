<template>
  <q-dialog :value="showDialog" @hide="close" full-width position="bottom">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ task.content }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn-toggle
            ripple
            unelevated
            size="lg"
            stretch
            v-model="task.priority"
            toggle-color="blue-grey-3"
            toggle-text-color="pink"
            :options="[
              { value: 4, textColor: 'priority-4', icon: 'flag' },
              { value: 3, textColor: 'priority-3', icon: 'flag' },
              { value: 2, textColor: 'priority-2', icon: 'flag' },
              { value: 1, textColor: 'priority-1', icon: 'flag' },
            ]"
          />
        </q-card-section>

        <q-separator inset />

        <q-card-section align="center">
          <q-btn-toggle
            ripple
            stretch
            no-wrap
            v-model="task.priority"
            toggle-color="primary"
            :options="[
              { value: 4, label: 'today' },
              { value: 3, label: 'tomorrow' },
              { value: 2, label: 'weekend' },
              { value: 1, label: 'next week' },
            ]"
          />
        </q-card-section>

        <q-separator inset />

        <q-card-section align="center">
          <q-btn-toggle
            ripple
            stretch
            v-model="task.priority"
            toggle-color="primary"
            :options="[
              { value: 4, label: '8am' },
              { value: 3, label: '10am' },
              { value: 2, label: '12pm' },
              { value: 1, label: '2pm' },
              { value: 1, label: '4pm' },
              { value: 1, label: '6pm' },
              { value: 1, label: '8pm' },
              { value: 1, label: '10pm' },
            ]"
          />
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters: mapTodoistGetters } = createNamespacedHelpers('todoist');

export default {
  name: 'TaskDialog',
  props: {
    task: Object,
    show: Boolean,
  },
  computed: {
    showDialog() {
      return this.$props.show;
    },
  },
  methods: {
    ...mapTodoistGetters(['getPriorityColor']),
    close(evt) {
      this.$emit('close', evt);
    },
  },
};
</script>

<style lang="stylus">
</style>
