<template>
  <div>
    <a @click="showModal()">{{getTitle()}}</a>
    <ModalMyAdoptees
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>{{getTitle()}}</template>
      <template v-slot:sub-title>{{getSubtitle()}}</template>
      <template v-slot:body>
        <ul>
          <li v-for="item in getMyAdopteeList()">
            <a @click="onClickGoPoint(item.form.lon,item.form.lat)">
              <h3>{{item.form.name}}</h3> 
              <i>{{item.created.substring(0,10)}}</i>
            </a>
          </li>
        </ul>

      </template>
      <template v-slot:footer>
        {{page.title}}
      </template>
    </ModalMyAdoptees>

  </div>
</template>
<script>
// [.MyAdoptees]:
// |not(isModalVisible)|: [*],[*]
// |"(isModalVisible)"|: [*], Config 
// |"currentUser"|: AppState, Load

// [Config]: 
// |(page)|: Config, Load

// import config from '@/components/config/my_adoptees.json';

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js'
import AdopteeMixin from '@/components/mixins/adoptee/AdopteeMixin.js'
// import GraphMixin from '@/components/mixins/graph/GraphMixin.js'
import { ResponseAdoptees } from '@/components/mixins/adoptee/ResponseAdoptees.js'
// import { RequestAdoptees } from '@/components/mixins/adoptee/RequestAdoptees.js'

// Modals
import ModalMyAdoptees from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration,GoogleMapMixin,AdopteeMixin,ModalMyAdoptees],

  components: {
    ModalMyAdoptees,
  },
  data () {
    return {
      name: "MyAdoptees",
      page: {
        title: "My Adoptees",
        subtitle: "My storm drains"
      },
      isModalVisible:false,
      myAdopteeList: [
        {
          "pk":"drain_id#cgr_2736",
          "sk":"const#ADOPTEE",
          "tk":"guid#92c9c50c-d339-44d6-9706-c0c10b731d0d",
          "form":{"lat":42.9639737043,
                  "lon":-85.66837114350001,
                  "name":"a",
                  "type":"orphan",
                  "drain_id":"CGR_2736"},
          "owner":"f084c2f8-a4b0-4c61-9a4a-28c4a8327dd0",
          "active":true,
          "created":"2022-06-19T11:55:08.395594",
          "updated":"2022-06-19T11:55:08.395594"
        }
      ]
    }
  },

  mounted () {
    // console.log('mounted');
      // [Load]:
      // |"((page), (myAdopteeList))"|:

      // this.addMount(this.name);

      this.$nextTick(function () {

        if (this.isAuthenticated) {
          this.loadAdopteeList();
        }
      }); // nextTick
  },
  methods: {
    // [Show]: isModalVisible
    // |not(isModalVisible)|: Show, [*]

    // [*Show]: isModalVisible
    // [[Start]]:
   
    getTitle() {
      // console.log('getTitle');
      // [[Title]]: 
      return this.page.title;
    },

    getSubtitle() {
      // console.log('getSubtitle');

      // [[Subtitle]]:

      return this.page.subtitle;
    },
    
    getMyAdopteeList() {
        // console.log('getMyAdopteeList',this.myAdopteeList);

      // [[Adoptees]]: myAdopteeList      
      return this.myAdopteeList;
    },
    // [[End]]:
    
    onClickGoPoint(lon, lat) {
      // this.addEmit('click-go-point');
      this.$nuxt.$emit('click-go-point',lon, lat);
    },

    showModal() {
      this.isModalVisible=true;
      this.loadAdopteeList(this.current_token, this.payload.key);
    },

    closeModal() {
      // set all dialog to closed/false
      this.isModalVisible = false;
    },

    loadAdopteeList() {
          // console.log('loadAdopteeList');

        // [*Load]:
        // [[Start]]:
        if (!this.isAuthenticated) {return;}
        // ||isModalVisible||: [*], AdopteeGetOwnerRequest
        // ||currentUser||: AppState, AdopteeGetOwnerRequest

        // [[AdopteeGetOwnerRequest]]:
        // ||(get service.adopteeGetOwnerRequest.response)||:
        
        this.myAdopteeList.length = 0;

        // clear myAdopteeList
        
        // while (this.getMyAdopteeList().length > 0) { this.getMyAdopteeList().pop(); }
        
        // while (this.myAdopteeList.length) { this.myAdopteeList.pop(); }
        // token is a user token
        // owner is key value
        // to persist the list add myAdopteeList to your component's data section
        const owner = this.payload.key;
        this.adopteeGetOwnerRequest(owner)
          .then((response) => {
            // console.log('adopteeGetOwnerRequest');
            // [[AdopteeGetOwnerHandler]]:
            // ||myAdopteeList||:  
            this.adopteeGetOwnerHandler(response)
          })
        .catch((err) => {
              console.error('load My adoptees err ', err);
            });
        
        // [[End]]:    
    },
    
    adopteeGetOwnerHandler(response) {
      // console.log('adopteeGetOwnerHandler');
      const responseHandler = new ResponseAdoptees()
    
      const status = responseHandler.getStatus(response);
      switch(status) {
        case '200':
          for (let i in responseHandler.getData(response)) {
            let cpy = JSON.parse(JSON.stringify(responseHandler.getData(response)[i]));
            this.myAdopteeList.push(cpy);
            // console.log('cpy', cpy);
          }
          break;
        case '404':
          
          break;
  
        default:
          console.log('adopteeGetOwnerHandler ', response);
          console.error(`adopteeGetOwnerHandler unhandled status ${status}`);

      } 
    }
  } // methods
}
// [End]:

</script>

<style scoped>

</style>
