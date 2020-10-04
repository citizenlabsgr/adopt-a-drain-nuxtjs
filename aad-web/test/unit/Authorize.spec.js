import Vuex from 'vuex' // added
import { mount, createLocalVue } from '@vue/test-utils'

import Authorize from '@/components/Authorize.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe("Authorize", () => {
  const wrapper = mount(Authorize, {
   mocks: {
     $store: {
       state: {token: ""}
     }
   }
  })
  
  it('is Not Authenticated ', async () => {
    wrapper.setData({ aadform: {displayname: 'a', name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isAuthenticated).toBeFalsy()
  })
})
