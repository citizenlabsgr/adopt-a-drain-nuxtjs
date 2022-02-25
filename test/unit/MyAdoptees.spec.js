require('dotenv').config();
import axios from 'axios';

import { mount } from '@vue/test-utils'
import MyAdoptees from '@/components/MyAdoptees.vue'

describe('MyAdoptees', () => {

  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()
    /*
    const wrapper = mount(MyAdoptees)
    expect(wrapper.vm).toBeTruthy()
    */
    const wrapper = mount(MyAdoptees, {
      mocks: {
        $store: {
          state: {token: ''}
        },
        $axios: axios
      }
    });
    expect(wrapper.vm).toBeTruthy()
  })
})
