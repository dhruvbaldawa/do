<template>
  <q-dialog :value="showDialog" @hide="close()">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'TaskDialog',
  props: {
    task: Object,
    show: Boolean,
    close: Function,
  },
  computed: {
    showDialog() {
      return this.$props.show;
    },
  },
};
</script>

<style lang="stylus">
</style>
