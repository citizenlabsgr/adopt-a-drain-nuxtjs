import { mount } from '@vue/test-utils'
import Sponsors from '@/components/Sponsors.vue'

describe('Sponsors', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Sponsors)
    expect(wrapper.vm).toBeTruthy()
  })
})
