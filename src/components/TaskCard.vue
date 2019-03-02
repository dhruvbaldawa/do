<template>
  <div>
    <q-item clickable v-ripple @click="showDialog()" class="q-pa-none">
      <q-slide-item @left="markDone" class="full-width">
        <template v-slot:left>
          <q-icon name="done" />
        </template>
        <template v-slot:right>
          <q-icon name="alarm" />
        </template>
        <q-item :class="getCSSClasses">
          <q-item-section top>
            <q-item-label lines="2" class="text-weight-medium title">
              {{ task.content }}
            </q-item-label>
            <q-item-label lines="1">{{ projectName }}</q-item-label>
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

            <q-item-label caption v-if="task.due && task.due.recurring">
              <q-icon name="repeat" />
              {{ task.due.string }}
            </q-item-label>
          </q-item-section>

          <q-item-section side class="section-bottom">
            <q-item-label>{{ dueDate }}</q-item-label>
            <!-- <q-btn class="gt-xs" size="12px" flat dense round icon="delete"></q-btn>
            <q-btn size="12px" flat dense round icon="more_vert" class="justify-top"></q-btn>
            <q-btn class="gt-xs" size="12px" flat dense round icon="done"></q-btn>-->
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-item>
    <q-separator></q-separator>
    <task-dialog :task="task" :show="dialog" @close="closeDialog" @save="saveDialog" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';
import TaskDialog from './TaskDialog';

const { mapGetters: mapTodoistGetters, mapActions: mapTodoistActions } = createNamespacedHelpers(
  'todoist',
);

export default {
  name: 'TaskCard',
  components: {
    TaskDialog,
  },
  data() {
    return {
      dialog: false,
    };
  },
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
      return this.task.labels.map((labelId) => {
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
        nextDay: '[Tom. @]LT',
        nextWeek: 'dddd[@]LT',
        lastDay: "[Y'day@]LT",
        lastWeek: '[Last] ddd[@]LT',
        sameElse: 'Do MMMM, YYYY[@]LT',
      });
    },
  },
  methods: {
    ...mapTodoistGetters(['getProjectById', 'getLabelById']),
    ...mapTodoistActions(['closeItem', 'updateItem', 'sync']),
    showDialog() {
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
    },

    async saveDialog(taskArgs) {
      this.closeDialog();
      try {
        await this.updateItem(taskArgs);
        this.$q.notify({ message: 'Task updated', type: 'positive' });
      } catch (err) {
        console.error(err);
        this.$q.notify({
          message: 'Task update failed, please re-save',
          type: 'negative',
        });
      }
    },

    async markDone(details) {
      try {
        await this.closeItem(this.task.id);
        this.sync();
        this.$q.notify({ message: 'Task marked as done', type: 'positive' });
      } catch (err) {
        this.$q.notify({
          message: 'Could not mark task as done',
          type: 'negative',
        });
      } finally {
        details.reset();
      }
    },
  },
};
</script>

<style lang="stylus">
.title {
  font-size: 1rem;
}

.section-bottom {
  justify-content: flex-end !important;
}
</style>
