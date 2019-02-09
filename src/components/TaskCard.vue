<template>
  <q-card class="q-ma-md">
    <q-card-media style="height:150px" :class="priorityBackground">
      <q-card-title slot="overlay" class="flex flex-top">
        {{ task.content }}
        <span slot="subtitle">{{ projectName }}</span>
      </q-card-title>
    </q-card-media>
    <q-list>
      <q-item v-if="labels.length">
        <q-item-side>
          <q-item-tile color="primary" icon="flag"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile>
            <q-chip
              tag
              v-for="label in labels"
              :key="label.id"
              :color="label.color"
              style="mix-blend-mode: difference;"
            >
              {{ label.name }}
            </q-chip>
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

export default {
  name: 'TaskCard',
  props: {
    task: Object,
  },
  computed: {
    priorityBackground() { return `bg-${this.getPriorityColor()(this.task.priority)}`; },
    projectName() { return this.getProjectById()(this.task.project_id).name; },
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
  },
  methods: {
    ...mapGetters(['getPriorityColor', 'getProjectById', 'getLabelById', 'getLabelColor']),
  },
};
</script>

<style>
</style>
