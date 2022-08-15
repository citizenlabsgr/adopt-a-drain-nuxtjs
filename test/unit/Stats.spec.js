
import { mount } from '@vue/test-utils'
import Statistic from '@/components/Statistic.vue'
import axios from "axios";

describe('Statistic', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Statistic)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Statistic, {
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
