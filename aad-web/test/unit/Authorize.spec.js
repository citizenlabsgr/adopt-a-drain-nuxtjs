import { shallowMount } from '@vue/test-utils'
import Authorize from '@/components/Authorize.vue'

describe('Authorize', () => {
  const wrapper = shallowMount(Authorize);
  it('is good displayname ', async () => {
    wrapper.setData({ form: {displayname: 'abc1', name: 'aa.com', password: 'aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.displayname).toBeFalsy()
  })
  it('is good name ', async () => {
    wrapper.setData({ form: {displayname: 'abc1', name: 'a@a.com', password: 'aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.name).toBeFalsy()
  })
  it('is good password ', async () => {
    wrapper.setData({ form: {displayname: 'abc1', name: 'a@a.com', password: 'aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.password).toBeFalsy()
  })
  it('is Disabled ', async () => {
    wrapper.setData({ form: {displayname: 'abc', name: 'aa.com', password: 'aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDisabled).toBeTruthy()
  })
  it('is not Disabled ', async () => {
    wrapper.setData({ form: {displayname: 'abcd', name: 'a@a.com', password: 'a1A!aaaa'} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDisabled).toBeFalsy()
  })

})
