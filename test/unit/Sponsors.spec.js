
import { mount } from '@vue/test-utils'
import Sponsors from '@/components/Sponsors.vue'
import axios from "axios";

describe('Sponsors', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Sponsors)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Sponsors, {
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
