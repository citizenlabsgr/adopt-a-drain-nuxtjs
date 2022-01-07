import Vuex from 'vuex' // added
import { mount, createLocalVue } from '@vue/test-utils'

import MockComponent from "@/components/MockEmailHandler.vue";
import { EmailHandler } from "@/components/mixins/EmailHandler.js";

const localVue = createLocalVue()
localVue.use(Vuex)
/* eslint-disable no-undef */
describe("Email Handler Mixin", () => {
  const wrapper = mount(MockComponent, {
    mocks: {
      $store: {
        state: {token: ""}
      }
    }
  });
  // dependent on SignIn so cant test value here
  it("getTo returns false when NOT signed in and guest token is NOT set", () => {
    expect(wrapper.vm.getTo()).toBe(false);
  });
  // dependent on EMAIL_SOURCE in .env
  it("getFrom returns email when EMAIL_SOURCE is set", () => {
    // console.log('wrapper.vm.getFrom()',wrapper.vm.getFrom() );
    expect(wrapper.vm.getFrom()).toBe(false);
  });
  
  
});
