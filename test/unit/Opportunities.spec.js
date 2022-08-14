
import { mount } from '@vue/test-utils'
import Opportunity from '@/components/Opportunity.vue'
import axios from "axios";

describe('Opportunity', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Opportunity)
    expect(wrapper.vm).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Opportunity, {
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
