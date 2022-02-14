<template>
  <div>
    <!--button type="button" class="btn" @click="showModal()">
      SignIn
    </button -->
    <a @click="showModal()">My Adoptees</a>
    <ModalMyAdoptees
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>My Adoptees</template>
      <template v-slot:sub-title>Because, because</template>
      <template v-slot:body>
        <ul>
          <!--li v-for="item in getMyAdopteeList(current_token, payload.key)"><a @click="onClickGoPoint(item.form.lon,item.form.lat)">{{item.form.name}}</a></li-->
          <li v-for="item in my_adoptee_list"><a @click="onClickGoPoint(item.lon,item.lat)">{{item.name}}</a></li>
        </ul>

      </template>
      <template v-slot:footer>
        My Adoptees
      </template>
    </ModalMyAdoptees>

  </div>
</template>
<script>

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
// import AdptHandler from '@/components/mixins/AdopteeMixin.js'
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js'
import AdopteeMixin from '@/components/mixins/adoptee/AdopteeMixin.js'

// Modals
import ModalMyAdoptees from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  // mixins: [Expiration, AdptHandler, GoogleMapMixin],
  mixins: [Expiration, GoogleMapMixin,AdopteeMixin],

  components: {
    ModalMyAdoptees,
  },
  data () {
    return {
      name: "MyAdoptees",
      isModalVisible:false,
      my_adoptee_list: []
    }
  },
  /*
  beforeDestroy () {
    this.$nuxt.$off('refresh-my-adoptees-list');
  },
  created () {
    //this.$nuxt.$on('refresh-my-adoptees-list', () => {
      //console.log('MyAdoptees refresh-my-adoptees-list');
      // this.loadMyAdopteeList(this.current_token, this.payload.key)

    //});
  },
  */
  mounted () {
    
    // this.$nextTick(function () {
      console.log(`
        (*)
         |
      [mounted MyAdoptees]
         |`);
       this.loadMyAdopteeList(this.current_token, this.payload.key);
    //}

  },
  methods: {
    onClickGoPoint(lon, lat) {
      this.$nuxt.$emit('click-go-point',lon, lat);
    },
    
    showModal() {
      this.isModalVisible=true;
      this.loadMyAdopteeList(this.current_token, this.payload.key);
    },
    
    closeModal() {
      // set all dialog to closed/false
      this.isModalVisible = false;
    },
    

    
    loadMyAdopteeList(token, owner) {
        // token is a user token
        // owner is key value
        // to persist the list add my_adoptee_list to your component's data section
        console.log('MyAdoptees.vue loadMyAdopteeList fixme ');
        /*
        console.log(`
             (owner)
                |
             [loadMyAdpt]
                |
             (aadUrl, aadHeader, aadData)
                |
             [My Adoptee Request]
                .
                .
                .
        `);
        const aadAuthentecated = this.isAuthenticated;
        // const aadData = JSON.parse(JSON.stringify(centerBox));
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    
        this.aadAdopteeGetMy(owner)     
            .then((response) => {
              this.aadAdopteeGetMyHandler(response);

            })
            .catch((err) => {
                // eslint-disable no-console
                console.error('Unexpected issue with adoptee list!', err);
                // eslint-enable no-console
            });
            */
    },
  }
}
</script>

<style scoped>

</style>
