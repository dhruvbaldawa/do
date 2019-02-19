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

      <q-separator inset/>

      <q-card-section align="center">
        <q-btn-toggle
          ripple
          v-model="task.priority"
          toggle-color="primary"
          :options="[
              { value: 4, label: 'today' },
              { value: 3, label: 'tomorrow' },
              { value: 2, label: 'weekend' },
            ]"
        />
        <q-input :placeholder="task.dueString" dense>
          <template v-slot:prepend>
            <q-icon name="schedule" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section align="center">
        <div class="row inline">
          <q-btn class="q-ma-xs" outline rounded label="follow up"/>
          <q-btn class="q-ma-xs" outline rounded label="email"/>
          <q-btn class="q-ma-xs" outline rounded label="next"/>
          <q-btn class="q-ma-xs" outline rounded label="home"/>
          <q-btn class="q-ma-xs" outline rounded label="work"/>
        </div>
        <div class="row inline">
          <q-btn class="q-ma-xs" outline rounded label="5m"/>
          <q-btn class="q-ma-xs" outline rounded label="15m"/>
          <q-btn class="q-ma-xs" outline rounded label="30m"/>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat>Cancel</q-btn>
        <q-btn flat>Postpone</q-btn>
        <q-btn flat color="positive">Done</q-btn>
      </q-card-actions>
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
