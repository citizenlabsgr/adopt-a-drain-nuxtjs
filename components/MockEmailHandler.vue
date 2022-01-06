<template>
  <div class="test">
   
  </div>
  
</template>

<script>
import Expiration from '@/components/mixins/ExpirationMixin.js'

import EmailHandler from '@/components/mixins/EmailHandler.js'

export default {
  name: "MockEmailHandler",
  mixins: [Expiration,EmailHandler],
  data () {
    return {
      stub: 'hey'
    }
  },
  methods: {
    getStub() {
      return this.stub;
    }
  }  
};
</script>

