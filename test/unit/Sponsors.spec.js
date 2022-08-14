
import { mount } from '@vue/test-utils'
import Sponsor from '@/components/Sponsor.vue'
import axios from "axios";

describe('Sponsor', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Sponsor)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Sponsor, {
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
