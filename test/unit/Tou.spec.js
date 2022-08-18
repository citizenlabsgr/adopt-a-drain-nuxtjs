
import { mount } from '@vue/test-utils'
import Tou from '@/components/Tou.vue'
import Statistic from "~/components/Statistic";
import axios from "axios";

describe('Tou', () => {
  /*
  test('is a Vue instance', () => {
    const wrapper = mount(Tou)
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
