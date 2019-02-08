<template>
  <q-page>
    <q-card v-bind:key="card.id" v-for="card in cards" class="q-ma-md">
      <q-card-title>{{ card.title }}</q-card-title>
      <q-card-separator/>
      <q-card-main>Card Content</q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn flat round dense icon="event"/>
        <q-btn flat label="5:30PM"/>
        <q-btn flat label="7:30PM"/>
        <q-btn flat label="9:00PM"/>
        <q-btn flat color="primary" label="Reserve"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style></style>

<script>
import {mapGetters} from 'vuex';
import {getToken} from '../services/TokenAuth.js';
import TodoistService from '../services/Todoist.js';

export default {
  name: 'IndexPage',
  data: () => ({
    cards: [
      {
        title: 'XYZ',
        id: 1,
      },
      {
        title: 'XYZ',
        id: 2,
      },
    ],
  }),
  computed: {
    ...mapGetters(['getOAuthToken']),
  },
  mounted() {
    // @TODO: think how to handle local storage, within the container or action
    const store = this.$store;
    this.$store.dispatch('login', getToken()).then(() => {
      const service = new TodoistService(store.getters.oAuthToken);
      service.getTasksByFilter('overdue | today').then(console.log);
    });
  },
};
</script>
