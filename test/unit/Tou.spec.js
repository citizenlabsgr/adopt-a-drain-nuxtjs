
import { mount } from '@vue/test-utils'
import Tou from '@/components/Tou.vue'

describe('Tou', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Tou)
    expect(wrapper.vm).toBeTruthy()
  })
})
