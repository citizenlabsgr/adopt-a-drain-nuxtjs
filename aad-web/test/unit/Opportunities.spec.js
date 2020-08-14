import { mount } from '@vue/test-utils'
import Opportunities from '@/components/Opportunities.vue'

describe('Opportunities', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Opportunities)
    expect(wrapper.vm).toBeTruthy()
  })
})
