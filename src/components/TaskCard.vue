<template>
  <q-card class="q-ma-md">
    <q-card-media style="height:150px" :class="getPriorityBackground">
      <q-card-title slot="overlay" class="flex flex-top">
        {{ task.content }}
        <span slot="subtitle">{{ task.project_id }}</span>
      </q-card-title>
    </q-card-media>
    <q-list>
      <q-item>
        <q-item-side>
          <q-item-tile color="primary" icon="flag"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile>
            <q-chip tag="true" v-for="label_id in task.label_ids" :key="label_id">
              {{ label_id }}
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
    getPriorityBackground() { return `bg-${this.getPriorityColor()(this.task.priority)}`; },
  },
  methods: {
    ...mapGetters(['getPriorityColor']),
  },
};
</script>

<style>
</style>
