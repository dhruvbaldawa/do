<template>
  <q-card bordered class="q-ma-md">
    <q-card-section>
      <div class="row item-center bg-dark">
        <q-icon name="flag" :color="priorityColor" size="1.5em"/>
        <div class="text-h6">{{ task.content }}</div>
        <q-chip icon="watch_later" color="deep-orange">{{ dueDate }}</q-chip>
      </div>
      <div class="text-subtitle2">{{ projectName }}</div>
    </q-card-section>
    <q-separator/>
    <q-list>
      <q-item v-if="labels.length">
        <q-item-section avatar>
          <q-icon color="primary" name="bookmarks"/>
        </q-item-section>
          <q-item-section>
            <div>
            <q-chip
              tag
              v-for="label in labels"
              :key="label.id"
              :color="label.color"
              style="mix-blend-mode: difference;"
            >{{ label.name }}</q-chip>
            </div>
          </q-item-section>
      </q-item>
      <q-item v-if="task.due.recurring">
        <q-item-section avatar>
          <q-icon color="primary" name="repeat"/>
        </q-item-section>
        <q-item-section>
          <div class="text-h7">{{ task.due.string }}</div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="event"/>
        </q-item-section>
        <q-item-section>
          <div>
            <q-btn
              outline
              label="10 am"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 10am')"
            />
            <q-btn
              outline
              label="12 pm"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 12pm')"
            />
            <q-btn
              outline
              label="02 pm"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 2pm')"
            />
            <q-btn
              outline
              label="04 pm"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 4pm')"
            />
            <q-btn
              outline
              label="06 pm"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 6pm')"
            />
            <q-btn
              outline
              label="08 pm"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 8pm')"
            />
            <q-btn
              outline
              label="10 pm"
              color="primary"
              class="q-mx-xs"
              @click="updateDueDate('today 10pm')"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-separator/>
    <q-card-actions>
      <q-btn label="Done" color="positive" icon="check_circle" outline @click="markDone()"/>
      <q-btn label="Postpone" color="negative" icon="update" outline/>
    </q-card-actions>
  </q-card>
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
    priorityColor() {
      return `${this.getPriorityColor()(this.task.priority)}`;
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
      const datetime = this.task.due.datetime || this.task.due.date;
      return moment(datetime).calendar(null, {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'Do MMMM, YYYY [at] LT',
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
