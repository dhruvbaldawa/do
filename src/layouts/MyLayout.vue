<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar color="primary" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>
        <q-toolbar-title>Do</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list no-border link inset-delimiter>
        <q-item-label header>Essential Links</q-item-label>
        <q-item @click.native="openURL('http://quasar-framework.org')"  clickable v-ripple>
          <q-item-section avatar>
             <q-icon name="school"/>
          </q-item-section>
          <q-item-section>
             <q-item-label lines="1">Docs</q-item-label>
             <q-item-label caption>quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
  },
};
</script>

<style>
</style>
