import Vuex from 'vuex' // added
import { mount, createLocalVue } from '@vue/test-utils'

import Authenticate from '@/components/Authenticate.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Authenticate render error messages', () => {
  const wrapper = mount(Authenticate, {
   mocks: {
     $store: {
       state: {token: ""}
     }
   }
 })
 
 it('is Not Authenticated ', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })
})
