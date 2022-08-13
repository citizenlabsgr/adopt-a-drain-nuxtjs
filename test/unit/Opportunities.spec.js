
import { mount } from '@vue/test-utils'
import Opportunities from '@/components/Opportunities.vue'
import axios from "axios";

describe('Opportunities', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Opportunities)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Opportunities, {
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
