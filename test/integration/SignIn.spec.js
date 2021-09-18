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
  await wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
  expect(wrapper.find("#error-name").text()).toEqual("Ok")
  expect(wrapper.find("#error-password").text()).toBe("Ok")

 })
 /*
 it('SignIn is good User Name Ok', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-name").text()).toEqual("Ok")
 })
 
 it('SignIn is good Password Ok', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-password").text()).toBe("Ok")

 })
*/
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
 

 it('is Not SignInd ', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })



})
