<template>
  <q-card class="q-ma-md">
    <q-card-title class="flex flex-top bg-dark text-white">
      <q-icon name="flag" :color="priorityColor" size="1.5em"/>
      {{ task.content }}
      <span slot="subtitle" class="text-white">{{ projectName }}</span>
      <q-chip icon="watch_later" color="deep-orange">{{ dueDate }}</q-chip>
    </q-card-title>
    <q-list>
      <q-item v-if="labels.length">
        <q-item-side>
          <q-item-tile color="primary" icon="bookmarks"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile>
            <q-chip
              tag
              v-for="label in labels"
              :key="label.id"
              :color="label.color"
              style="mix-blend-mode: difference;"
            >{{ label.name }}</q-chip>
          </q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-if="task.due.recurring">
        <q-item-side>
          <q-item-tile color="primary" icon="repeat"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile>{{ task.due.string }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
    <q-card-separator/>
    <q-card-actions>
      <q-btn flat round dense icon="event"/>
      <q-btn flat label="5:30PM"/>
      <q-btn flat label="7:30PM"/>
      <q-btn flat label="9:00PM"/>
      <q-btn flat color="primary" label="Reserve"/>
    </q-card-actions>
  </q-card>
</template>

<script>
import {mapGetters} from 'vuex';
import moment from 'moment';

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
    ...mapGetters(['getPriorityColor', 'getProjectById', 'getLabelById', 'getLabelColor']),
  },
};
</script>

<style>
</style>
