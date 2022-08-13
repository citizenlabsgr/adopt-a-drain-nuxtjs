
import { mount } from '@vue/test-utils'
import Stats from '@/components/Stats.vue'
import axios from "axios";

describe('Stats', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Stats)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Stats, {
      mocks: {
        $store: {
          state: {token: process.env.AAD_API_TOKEN}
        },
        $axios: axios
      }
    });
    expect(wrapper.vm).toBeTruthy()
  })
})
