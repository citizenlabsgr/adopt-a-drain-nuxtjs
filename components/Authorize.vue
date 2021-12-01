<template>
  <div class="band">
    xxx
    <div>isAuthenticated: {{isAuthenticated}}</div>
    <!-- Step 1 Sign Up -->
    <div v-if="!isAuthenticated" class="outer-div">
      <SignUp @add-adopter="addAdopter" />
    </div>
    <!-- Step 2 Sign Out-->
    <div v-else class="outer-div" >
    
    </div>
  </div>
</template>
<script>

import Expiration from '@/components/mixins/ExpirationMixin.js'

import SignUp from '@/components/SignUp.vue'

/* istanbul ignore next */ 
export default {
  mixins: [Expiration],
  components: {
    SignUp

  },

  beforeDestroy () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // task: avoid memory leak while polling signin expiration
    //this.log('beforeDestroy 1')
    clearInterval(this.interval_monitor_expiration)
    this.interval_monitor_expiration=null
    //this.log('beforeDestroy')
  },
  created () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // Task: start the polling function
    //this.log('created 1')
    this.pollExpiration()
    //this.log('created')
  },
  methods: {
    //log (msg) {
    //  /* eslint-disable no-console */
    //  console.log(msg)
    //  /* eslint-enable no-console */
    //}
    addAdopter(adoptee) { 
      // pass new adopter up to authorize/index 
      this.$emit('add-adopter', adoptee)
    }
  } // end of methods
}
</script>

<style scoped>
.band {
  width: 100%;
  height: 400px;
  /*background-color: #cccccc;*/
}

</style>