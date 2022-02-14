<template>
<div>
      <nav>
      
      <ul>
        
        <li v-if="isAuthenticated">
          <u><MyAdoptees /></u>
        </li>
        <li v-else>
          <nuxt-link class="" to="/">
            Adoptions
          </nuxt-link>
        </li>
        <li>
          
            <u><Communities /></u>
          
        </li>
         <li v-if="!isAuthenticated">
          
            <u><SignIn /></u>
          
        </li>
        <li v-else>
        
            <u><SignOut /></u>

        </li>

        <li v-if="isAuthenticated">
          <nuxt-link to="/account">
          Account
          </nuxt-link>
        </li>
        <li v-else>
          <nuxt-link to="/account">
          SignUp
          </nuxt-link>
        </li>
      </ul>
    </nav>
</div>

</template>
<script>

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import MyAdoptees from '@/components/MyAdoptees'
import Communities from '@/components/Communities'
import SignIn from '@/components/SignIn'
import SignOut from '@/components/SignOut'
/* istanbul ignore next */ 
export default {
  mixins: [Expiration],
  components: {
    SignIn,
    SignOut,
    MyAdoptees,
    Communities
  },
  data () {
    return {
      
      title: 'Sponsors',
      subtitle: 'We can\'t do this alone.'
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 10px;
  font-variant: petite-caps;
}
</style>
