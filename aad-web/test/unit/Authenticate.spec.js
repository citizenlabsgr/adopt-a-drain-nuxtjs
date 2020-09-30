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
 it('Authenticate is good User Name Ok', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-name").text()).toEqual("Ok")
 })
 it('Authenticate is good Password Ok', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-password").text()).toBe("Ok")

 })
 it('is Disabled ', async () => {
   wrapper.setData({ aadform: {name: '', password: ''} })
   await wrapper.vm.$nextTick()
   expect(wrapper.find("#signin").html()).toContain('disabled="disabled"')
 })
 it('is Enabled ', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.find("#signin").html()).toEqual(expect.not.stringContaining("disabled"));
 })
 it('is Not Authenticated ', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })
})
