import { mount } from '@vue/test-utils'
import Stats from '@/components/Stats.vue'

describe('Stats', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Stats)
    expect(wrapper.vm).toBeTruthy()
  })
})
