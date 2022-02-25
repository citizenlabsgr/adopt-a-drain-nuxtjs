/*
Jest doenst like axios
*/
require('dotenv').config();
import axios from 'axios';
import Vuex from 'vuex'; // added

import { mount } from '@vue/test-utils';
import Communities from '@/components/Communities.vue';

/*
const username = 'john.newhouser45@newuser.com';
const payload = new GuestTokenPayload().payload();
const secret = process.env.JWT_SECRET;

let token = Jwt.token.generate(payload, secret);

token = `Bearer ${token}`;
*/

describe('Communities', () => {
  // const guestToken = '';
  /*
  test('Environment', () => {
    expect(process.env.AAD_API_TOKEN).toBeTruthy()
  })
  */
  test('is a Vue instance', () => {
    // expect(true).toBeTruthy()

    const wrapper = mount(Communities, {
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

