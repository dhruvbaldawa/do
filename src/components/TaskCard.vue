<template>
  <div>
    <q-slide-item clickable v-ripple>
      <template v-slot:left>
        <q-icon name="done"/>
      </template>
      <template v-slot:right>
        <q-icon name="alarm"/>
      </template>
      <q-item :class="getCSSClasses">
        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium text-body-1">{{ task.content }}</span>
          </q-item-label>
          <div>
          <q-chip
              outline
              dense
              square
              v-for="label in labels"
              :key="label.id"
              :color="label.color"
              class="q-mr-xs q-ml-none"
            >
              <span class="text-weight-medium">{{ label.name }}</span>
            </q-chip>
            </div>
          <q-item-label lines="1">{{ projectName }}</q-item-label>
          <q-item-label
            caption
            lines="1"
            v-if="task.due && task.due.recurring"
          >
            {{ task.due.dateString }}
          </q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-item-label caption>{{ dueDate }}</q-item-label>


            <!-- <q-btn class="gt-xs" size="12px" flat dense round icon="delete"></q-btn>
            <q-btn class="gt-xs" size="12px" flat dense round icon="done"></q-btn>
            <q-btn size="12px" flat dense round icon="more_vert"></q-btn> -->
          </div>
        </q-item-section>
      </q-item>
    </q-slide-item>
    <q-separator></q-separator>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';

const { mapGetters: mapTodoistGetters, mapActions: mapTodoistActions } = createNamespacedHelpers(
  'todoist',
);
const { mapActions: mapFilterActions } = createNamespacedHelpers('todoist/filter');

export default {
  name: 'TaskCard',
  props: {
    task: Object,
  },
  computed: {
    getCSSClasses() {
      return `border-priority-${this.task.priority}`;
    },
    projectName() {
      return this.getProjectById()(this.task.project_id).name;
    },
    labels() {
      return this.task.label_ids.map((labelId) => {
        const label = this.getLabelById()(labelId);
        return {
          id: label.id,
          name: label.name,
          color: `todoist-label-${label.color}`,
        };
      });
    },
    dueDate() {
      if (!this.task.due) {
        return '';
      }

      const datetime = this.task.due.datetime || this.task.due.date;
      return moment(datetime).calendar(null, {
        sameDay: 'LT',
        nextDay: '[Tomorrow@]LT',
        nextWeek: 'dddd[@]LT',
        lastDay: '[Yesterday@]LT',
        lastWeek: '[Last] dddd[@]LT',
        sameElse: 'Do MMMM, YYYY[@]LT',
      });
    },
  },
  methods: {
    ...mapTodoistGetters(['getPriorityColor', 'getProjectById', 'getLabelById', 'getLabelColor']),
    ...mapTodoistActions(['getItem', 'updateItemDate', 'closeItem']),
    ...mapFilterActions(['replaceTaskById', 'removeTaskById']),
    async updateDueDate(dateString) {
      try {
        await this.updateItemDate({ id: this.task.id, dateString });
        const response = await this.getItem(this.task.id);
        this.replaceTaskById({ taskId: this.task.id, newTask: response });
        this.$q.notify({ message: 'Task rescheduled', type: 'positive' });
      } catch (err) {
        console.error(err);
        this.$q.notify({ message: 'Task update failed', type: 'negative' });
      }
    },

    async markDone() {
      try {
        await this.closeItem(this.task.id);
        this.removeTaskById(this.task.id);
        this.$q.notify({ message: 'Task marked as done', type: 'positive' });
      } catch (err) {
        this.$q.notify({ message: 'Could not mark task as done', type: 'negative' });
      }
    },
  },
};
</script>

<style>
</style>
