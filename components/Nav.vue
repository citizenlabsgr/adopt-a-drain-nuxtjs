<template>
<div>
      <nav>

      <ul>
        <li>
          <nuxt-link class="" to="/">
            Adoptions
          </nuxt-link>
        </li>
        <li v-if="isAuthenticated">
          <u><MyAdoptees /></u>
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
          <nuxt-link to="/adopter">
          Account
          </nuxt-link>
        </li>
        <li v-else>
          <nuxt-link to="/adopter">
          SignUp
          </nuxt-link>
        </li>



      </ul>
    </nav>
</div>

</template>
<script>
// [.Nav]:
// [Start]:
// |/*|:
// [Adoptions]: /

// [Communities]: isModalVisible
// |not(authenticated)|: Communities, Signup
// |authenticated|: Communities, MyAdoptees

// [Signup]: /adopter
// [Signin]: isModalVisible
// |not(authenticated)|: Signin, [*]

// [MyAdoptees]: isModalVisible
// [SignOut]: isModalVisible
// [End]:

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
      title: "Sponsor",
      subtitle: "We can't do this alone."
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
