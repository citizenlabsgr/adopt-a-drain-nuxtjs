
import Vuex from 'vuex' // added
import { mount, createLocalVue } from '@vue/test-utils'

import SignIn from '@/components/SignIn.vue'
import { Constants } from '@/components/mixins/Constants.js'

const sign_in_empty = {
  page: {
    title: 'Sign In',
    subtitle: 'Because',
    feedback: ''
  },
  aadform: {
    username: '',
    password: ''
  },
  meta: {
    username :{
      prompt:"User Name",
      status:"",
      regexp: Constants.email()
    },
    password :{
      prompt:"Password",
      status:"",
      regexp: Constants.password(),
      warnings: [
        {"test_exp":Constants.lowercase(), "warning":"Lowercase","show":true},
        {"test_exp":Constants.uppercase(), "warning":"Uppercase","show":true},
        {"test_exp":Constants.digit(),"warning":"Numbers","show":true},
        {"test_exp":Constants.symbol(), "warning":"Symbols","show":true},
        {"test_exp":Constants.eight_char(), "warning":"Length greater than 8","show":true}
      ]
    }
  }
};
const sign_in_ok = {
  page: {
    title: 'Sign In',
    subtitle: 'Because',
    feedback: ''
  },
  aadform: {
    username: 'a@a.com',
    password: 'a1A!aaaa'
  },
  meta: {
    username :{
      prompt:"User Name",
      status:"",
      regexp: Constants.email()
    },
    password :{
      prompt:"Password",
      status:"",
      regexp: Constants.password(),
      warnings: [
        {"test_exp":Constants.lowercase(), "warning":"Lowercase","show":true},
        {"test_exp":Constants.uppercase(), "warning":"Uppercase","show":true},
        {"test_exp":Constants.digit(),"warning":"Numbers","show":true},
        {"test_exp":Constants.symbol(), "warning":"Symbols","show":true},
        {"test_exp":Constants.eight_char(), "warning":"Length greater than 8","show":true}
      ]
    }
  }
};

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
 /*
 it('SignIn is good User Name Ok', async () => {
   // await wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })

   await wrapper.setData({ signin: sign_in_ok });
   expect(wrapper.find("#error-name").text()).toBe("Ok")
   expect(wrapper.find("#error-password").text()).toBe("Ok")

 })
 */

 it('is Disabled ', async () => {
   await wrapper.setData({ signin: sign_in_empty });
   // await wrapper.setData({ aadform: {username: '', password: ''} })
   expect(wrapper.find("#signin").html()).toContain('disabled="disabled"')
 })

 /*
 it('is Enabled ', async () => {
   await wrapper.setData({ signin: sign_in_ok });

   // await wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   expect(wrapper.find("#signin").html()).toEqual(expect.not.stringContaining("disabled"));
 })
 */
 

 it('is Not SignIn ', async () => {
   await wrapper.setData({ signin: sign_in_ok });

   // await wrapper.setData({ aadform: {username: 'a@a.com', password: 'a1A!aaaa'} })
   // await wrapper.vm.$nextTick()
   expect(wrapper.vm.isAuthenticated).toBeFalsy()
 })



})