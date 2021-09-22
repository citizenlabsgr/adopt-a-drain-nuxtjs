import Vuex from 'vuex' // added
import { mount, createLocalVue } from '@vue/test-utils'

import SignIn from '@/components/SignIn.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SignIn render error messages', () => {
  const wrapper = mount(SignIn, {
   mocks: {
     $store: {
       state: {token: ""}
     }
   }
 })
 
 it('SignIn is good User Name Ok', async () => {
   await wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-name").text()).toBe("Ok")
   expect(wrapper.find("#error-password").text()).toBe("Ok")

 })

 it('is Disabled ', async () => {
   await wrapper.setData({ aadform: {username: '', password: ''} })
   expect(wrapper.find("#signin").html()).toContain('disabled="disabled"')
 })

 it('is Enabled ', async () => {
   await wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#signin").html()).toEqual(expect.not.stringContaining("disabled"));
 })
 

 it('is Not SignIn ', async () => {
   await wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   // await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })



})
