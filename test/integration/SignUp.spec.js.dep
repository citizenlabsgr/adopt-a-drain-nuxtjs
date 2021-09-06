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
 it('SignUp is good Display Name Ok', async () => {
   wrapper.setData({ aadform: {displayname: 'a',name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-displayname").text()).toEqual("Ok")
 })
 it('SignUp is good User Name Ok', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-name").text()).toEqual("Ok")
 })
 it('SignUp is good Password Ok', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#error-password").text()).toBe("Ok")

 })
 it('is Disabled ', async () => {
   wrapper.setData({ aadform: {name: '', password: ''} })
   await wrapper.vm.$nextTick()
   expect(wrapper.find("#signup").html()).toContain('disabled="disabled"')
 })
 it('is Enabled ', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.find("#signup").html()).toEqual(expect.not.stringContaining("disabled"));
 })
 /*
 it('is Not SignUp ', async () => {
   wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
   await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })
 */
})
