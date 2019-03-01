<template>
  <q-dialog :value="showDialog" @hide="close" @show="onShow" full-width position="bottom">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ activeTask.content }}</div>
      </q-card-section>

      <q-card-section align="center">
        <q-btn-toggle
          ripple
          unelevated
          size="lg"
          stretch
          v-model="activeTask.priority"
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
          v-model="dueValue"
          toggle-color="primary"
          @input="onChangeDueDate"
          :options="[
              { value: 'today', label: 'today' },
              { value: 'tomorrow', label: 'tomorrow' },
              { value: 'friday', label: 'weekend' },
            ]"
        />
      </q-card-section>

      <q-card-section>
        <div class="row inline justify-center full-width">
          <q-btn
            v-for="label in contextLabels"
            outline
            rounded
            :class="label.selected ? 'label-selected q-ma-xs' : 'label-not-selected q-ma-xs'"
            @click="toggleLabel(label)"
            :key="label.id"
            :label="label.label"
          />
        </div>
        <div class="row inline justify-center full-width">
          <q-btn
            v-for="label in effortLabels"
            outline
            rounded
            :class="label.selected ? 'label-selected q-ma-xs' : 'label-not-selected q-ma-xs'"
            @click="toggleLabel(label)"
            :key="label.id"
            :label="label.label"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="negative" @click="close">Cancel</q-btn>
        <q-btn flat color="amber">Postpone</q-btn>
        <q-btn flat color="positive" @click="onSave">Save</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import _ from 'lodash';

import moment from 'moment';

const { mapGetters: mapTodoistGetters } = createNamespacedHelpers('todoist');

export default {
  name: 'TaskDialog',
  props: {
    task: Object,
    show: Boolean,
  },
  data() {
    return {
      activeTask: { ...this.task },
      dueDate: null,
      dueValue: '',
      contextLabels: [
        { id: 2149282899, label: 'followup', selected: false },
        { id: 2150460844, label: 'email', selected: false },
        { id: 2150224661, label: 'next', selected: false },
        { id: 2150231805, label: 'home', selected: false },
        { id: 2150231806, label: 'work', selected: false },
      ],
      effortLabels: [
        { id: 2152020507, label: '5m', selected: false },
        { id: 2152020508, label: '10m', selected: false },
        { id: 2152020510, label: '30m', selected: false },
      ],
    };
  },
  computed: {
    showDialog() {
      return this.$props.show;
    },
  },
  methods: {
    ...mapTodoistGetters(['getLabelByName']),

    close(evt) {
      this.$emit('close', evt);
    },

    toggleLabel(label) {
      label.selected = !label.selected;
    },

    getAllLabelIds() {
      return _.map(_.concat(this.effortLabels, this.contextLabels), (item) => item.id);
    },

    updateActiveLabels(activeLabels, labels) {
      _.each(labels, (item) => {
        if (_.includes(activeLabels, item.id)) {
          item.selected = true;
        }
      });
    },

    onChangeDueDate(value) {
      this.dueValue = value;

      switch (value) {
        case 'today':
          this.dueDate = moment()
            .utc()
            .format('YYYY-MM-DDT00:00');
          break;

        case 'tomorrow':
          this.dueDate = moment()
            .add(1, 'd')
            .utc()
            .format('YYYY-MM-DDT00:00');
          break;

        case 'friday':
          this.dueDate = moment()
            .endOf('week')
            .subtract(1, 'd')
            .utc()
            .format('YYYY-MM-DDT00:00');
          break;

        default:
          break;
      }
    },

    onShow() {
      const labelIds = this.getAllLabelIds();
      const activeLabels = _.intersection(labelIds, this.activeTask.labels);

      this.updateActiveLabels(activeLabels, this.contextLabels);
      this.updateActiveLabels(activeLabels, this.effortLabels);
    },

    updateFinalLabelIds() {
      const labelsToAdd = _.chain(_.concat(this.effortLabels, this.contextLabels))
        .filter((item) => item.selected)
        .map((item) => item.id)
        .value();
      const labelsToRemove = _.chain(_.concat(this.effortLabels, this.contextLabels))
        .filter((item) => !item.selected)
        .map((item) => item.id)
        .value();

      return _.chain(this.activeTask.labels)
        .union(labelsToAdd)
        .difference(labelsToRemove)
        .value();
    },

    onSave() {
      const payload = {
        id: this.activeTask.id,
        labels: this.updateFinalLabelIds(),
        priority: this.activeTask.priority,
        content: this.activeTask.content,
      };

      if (this.dueDate !== null) {
        payload.due_date_utc = this.dueDate;
        payload.date_string = this.activeTask.due.date_string
          ? this.activeTask.due.date_string
          : null;
      }

      this.$emit('save', payload);
    },
  },
};
</script>

<style lang="stylus">
@import '~quasar-variables';

.label-selected {
  background: $primary !important;
  color: white;
}

.label-not-selected {
  background: white;
  color: $primary;
}
</style>
