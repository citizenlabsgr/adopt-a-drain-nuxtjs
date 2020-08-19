import { shallowMount } from '@vue/test-utils'
import Authenticate from '@/components/Authenticate.vue'

describe('Authenticate', () => {
  const wrapper = shallowMount(Authenticate);
  it('is good password', async () => {
    wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.name).toBeFalsy()
  })
  it('is good name good password ', async () => {
    wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.password).toBeFalsy()
  })
  it('is Disabled ', async () => {
    wrapper.setData({ aadform: {name: 'aa.com', password: 'aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDisabled).toBeTruthy()
  })
  it('is not Disabled ', async () => {
    wrapper.setData({ aadform: {name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDisabled).toBeFalsy()
  })
})
