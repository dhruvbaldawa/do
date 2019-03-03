<template>
  <q-dialog :value="showDialog" @hide="close" full-width position="bottom">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ activeTask.content }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ScheduleDialog',
  props: {
    task: Object,
    show: Boolean,
  },
  data() {
    return {
      activeTask: { ...this.task },
      dueDate: null,
      dueValue: '',
    };
  },
  computed: {
    showDialog() {
      return this.$props.show;
    },
  },
  methods: {
    close(evt) {
      this.$emit('close', evt);
    },
  },
};
</script>

<style lang="stylus">
</style>
