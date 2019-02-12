// import { shallowMount, createLocalVue } from '@vue/test-utils';
import TaskCard from '../TaskCard.vue';

// I see that you already alias "quasar" in your .babelrc,
// otherwise replace "quasar" with "quasar-framework/dist/quasar.mat.esm.js"
import Quasar from 'quasar-framework/dist/quasar.mat.esm.js';
// or if you are using a lot of Quasar components then do
// import Quasar, * as All from "quasar";

describe('Something Something', () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, {components: 'all', plugins: 'all'});
  // or if you are using a lot of Quasar components then do
  // localVue.use(Quasar, { components: All, directives: All, plugins: All });

  const wrapper = shallowMount(TaskCard, {
    localVue,
  });

  it('works', () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });
});
