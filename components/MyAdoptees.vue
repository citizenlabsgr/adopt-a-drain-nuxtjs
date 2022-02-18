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
          <li v-for="item in my_adoptee_list"><a @click="onClickGoPoint(item.form.lon,item.form.lat)"><h3>{{item.form.name}}</h3> <i>{{item.created.substring(0,10)}}</i></a></li>
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
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js'
import AdopteeMixin from '@/components/mixins/adoptee/AdopteeMixin.js'
import GraphMixin from '@/components/mixins/graph/GraphMixin.js'
import { ResponseAdoptees } from '@/components/mixins/adoptee/ResponseAdoptees.js'
import { RequestAdoptees } from '@/components/mixins/adoptee/RequestAdoptees.js'

// Modals
import ModalMyAdoptees from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration,GraphMixin,GoogleMapMixin,AdopteeMixin,ModalMyAdoptees],

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

  mounted () {

      this.addMount(this.name);

      this.$nextTick(function () {
        if (this.isAuthenticated) {
            this.loadMyAdopteeList();
        }
      }); // nextTick
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

    loadMyAdopteeList() {
        if (!this.isAuthenticated) {return;}
        this.my_adoptee_list.length = 0;
        // token is a user token
        // owner is key value
        // to persist the list add my_adoptee_list to your component's data section
        const owner = this.payload.key;
        const requestRest = new RequestAdoptees(this);

        requestRest.Get(owner)
            .then((response) => {
              const responseRest = new ResponseAdoptees(this);

              switch(responseRest.handler(response)) {
                case '200':
                  for (let i in responseRest.getData(response)) {
                      let cpy = JSON.parse(JSON.stringify(responseRest.getData(response)[i]));

                      this.my_adoptee_list.push(cpy);
                  }
                  break;
                default:

                  console.log(`status ${handledStatus}`);

              }
              this.showGraph();
            })
            .catch((err) => {
              this.addError(err);
              console.err('load My adoptees err ', err);
              this.showGraph();
            });
    },
  } // methods
}
</script>

<style scoped>

</style>
