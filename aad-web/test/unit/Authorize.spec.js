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
  it("Authorize good Display Name Ok", async () => {
    wrapper.setData({
     aadform: {
       displayname: 'a', name: 'c@c.com',password: 'a1A!aaaa'}
    })

    expect(wrapper.find("#error-displayname").text()).toEqual("Ok")

  })
  it("Authorize good User Name Ok", async () => {
    wrapper.setData({
     aadform: {
       displayname: 'a',name: 'c@c.com',password: 'a1A!aaaa'}
    })

    expect(wrapper.find("#error-name").text()).toEqual("Ok")

  })
  it("Authorize good Password Ok", async () => {
    wrapper.setData({
     aadform: {
       displayname: 'a',name: 'c@c.com',password: 'a1A!aaaa'}
    })

    expect(wrapper.find("#error-password").text()).toBe("Ok")

  })
  it('is Disabled ', async () => {
    wrapper.setData({ aadform: {displayname: 'a', name: '', password: ''} })
    await wrapper.vm.$nextTick()
    expect(wrapper.find("#signup").html()).toContain('disabled="disabled"')
  })
  it('is Enabled ', async () => {
    wrapper.setData({ aadform: {displayname: 'a', name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.find("#signup").html()).toEqual(expect.not.stringContaining("disabled"));
  })
  it('is Not Authenticated ', async () => {
    wrapper.setData({ aadform: {displayname: 'a', name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isAuthenticated).toBeFalsy()
  })
})
