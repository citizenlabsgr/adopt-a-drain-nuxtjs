import Vuex from 'vuex' // added
import { mount, createLocalVue } from '@vue/test-utils'

import SignUp from '@/components/SignUp.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SignUp render error messages', () => {
  const wrapper = mount(SignUp, {
   mocks: {
     $store: {
       state: {token: ""}
     }
   }
 })
 it('SignUp data Displayname, Username, Password', async () => {
  await wrapper.setData({ aadform: {displayname: 'a',username: 'a@a.com', password: 'a1A!aaaa'} })
  expect(wrapper.find("#error-displayname").text()).toEqual("Ok")
  expect(wrapper.find("#error-name").text()).toEqual("Ok")
  expect(wrapper.find("#error-password").text()).toBe("Ok")
})

 it('is Disabled ', async () => {
   wrapper.setData({ aadform: {username: '', password: ''} })
   await wrapper.vm.$nextTick()
   expect(wrapper.find("#signup").html()).toContain('disabled="disabled"')
 })

 it('is Enabled ', async () => {
   wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.find("#signup").html()).toEqual(expect.not.stringContaining("disabled"));
 })

 
 it('is Not SignUp ', async () => {
   wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })
 /*
 axios is not available for testing and this test fails
 it('SignUp ok', async () => {
  wrapper.setData({ aadform: {displayname: 'a',username: 'a@a.com', password: 'a1A!aaaa'} })
  
  await wrapper.vm.$nextTick()
  await wrapper.vm.onSubmit()

 })
 */
})
