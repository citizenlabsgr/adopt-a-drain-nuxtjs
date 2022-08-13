
import { mount } from '@vue/test-utils'
import About from '@/components/About.vue'
import axios from "axios";

describe('About', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(About)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(About, {
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
