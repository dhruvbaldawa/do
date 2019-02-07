<template>
  <q-page class="flex flex-center">
    <q-card inline style="width: 500px">
      <q-card-title>
        Enter Todoist Token
        <span slot="subtitle">Please add your Todoist personal access token here</span>
      </q-card-title>
      <q-card-main>
        <q-field :error="form.error" :error-label="form.error_label">
          <q-input
            v-model.trim="form.token"
            :error="form.error"
            :loading="form.loading"
            error-label="bokokok"
            placeholder="Personal Token"
            autofocus
            @keyup.enter="submit"
          />
        </q-field>
      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn flat color="primary" label="Save" @click="submit"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style></style>

<script>
import {setToken} from '../services/TokenAuth';

export default {
  name: 'LoginPage',
  data: () => ({
    form: {
      token: null,
      error: false,
      error_label: '',
      loading: false,
    },
  }),
  // validations: {
  //   token: { required }
  // }
  methods: {
    submit() {
      this.form.error = false;
      this.form.loading = true;

      if (!this.form.token) {
        this.form.error = true;
        this.form.loading = false;
        this.form.error_label = 'Token is required.';
        return;
      }

      setToken(this.form.token);
    },
  },
};
</script>
