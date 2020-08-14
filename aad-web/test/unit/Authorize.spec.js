import { shallowMount } from '@vue/test-utils'
import Authorize from '@/components/Authorize.vue'
const factory = (values = {}) => {
  return shallowMount(Authorize, {
    data () {
      return {
        page: {
          title: 'Sign Up',
          subtitle: 'Because.'
        },
        form: {
          displayname: '',
          name: '',
          password: ''
        }
      }
    }
  })
}

describe('Authorize', () => {
  it('renders a signup title', () => {
      const wrapper = factory()
      expect(wrapper.find('.title').text()).toEqual("Sign Up")
    })
})
