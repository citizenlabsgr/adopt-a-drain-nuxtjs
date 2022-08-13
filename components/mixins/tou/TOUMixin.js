// import { Response TOU } from '@/components/mixins/tou/Response TOU.js';
// import { RequestTOU } from './RequestTOU';
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "TOU",
      defaultService: "touDefault",
      service: {
        touDefault: {
          mapping: {
            "pk": "pk",
            "sk": "sk",
            "tk": "tk",
            "form": "form",
            "owner": "owner",
            "active": "active",
            "created": "created",
            "updated": "updated"
          },
          response: [
            {
              "active": true,
              "created": "2022-06-14T10:28:58.30262",
              "form": {"i": '00000', "p": 0, "w": "tou.md", "doc_id": "tou.md"},
              "owner": "api_admin",
              "pk": "doc_id#tou.md",
              "sk": "i#00000",
              "tk": "w#tou.md",
              "updated": "2022-06-14T10:28:58.30262"
            }
          ],
          output: [
            {
              "active": true,
              "created": "2022-06-14T10:28:58.30262",
              "form": {"i": '00000', "p": 0, "w": "tou.md", "doc_id": "tou.md"},
              "owner": "api_admin",
              "pk": "doc_id#tou.md",
              "sk": "i#00000",
              "tk": "w#tou.md",
              "updated": "2022-06-14T10:28:58.30262"
            }
          ]
        },
        touParagraphGet: {
          status: 900,
          response: [
            {
              "active": true,
              "created": "2022-06-14T10:28:58.30262",
              "form": {"i": '00000', "p": 0, "w": "tou.md", "doc_id": "tou.md"},
              "owner": "api_admin",
              "pk": "doc_id#tou.md",
              "sk": "i#00000",
              "tk": "w#tou.md",
              "updated": "2022-06-14T10:28:58.30262"
            }
          ],
          output: [
          ],
          default: [
            {
              "active": true,
              "created": "2022-06-14T10:28:58.30262",
              "form": {"i": '00000', "p": 0, "w": "tou.md", "doc_id": "tou.md"},
              "owner": "api_admin",
              "pk": "doc_id#tou.md",
              "sk": "i#00000",
              "tk": "w#tou.md",
              "updated": "2022-06-14T10:28:58.30262"
            }
          ],
        }
      }
    }
  },
  computed: {
    aadHeaderGuest () {
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
    },
    aadHeaderUser() {
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.current_token}`,
        'Content-Type': 'application/json'
      }
    }
  },
  methods: {
    /*
    setService(service) {
      this.defaultService = service;
    },
    getMapping(service) {
      // service is found in the services mixin

      // console.log('mapping 1');
      // comfigure the this.defaultService

      if (this.service) {
        if (this.service[service]){
          if (this.service[service].mapping) {
            return this.service[service].mapping;
          }
        }
      }
      // default
      // console.log('default mapping');
      return this.service[this.defaultService].mapping;
    },

    getOutput(service=null) {
      // service is found in the services mixin

      // final list of data

      if (this.service) {
        if (this.service[service]){
          if (this.service[service].output) {
            return this.service[service].output;
          }
        }
      }
      // default
      return this.service[this.defaultService].output;
    },

    addOutput(service, datum ) {
      // service is found in the services mixin
      // assume Output is an array

      if (this.service) {
        if (this.service[service]){
          if (this.service[service].output) {
            return this.service[service].output;
          }
        }
      }

      this.service[this.defaultService].output.push(datum);

    },
    */
    async touGetRequest(owner, id) { // replaces loadAdopter
      // console.log('touGetRequest 1');
      const url = `${process.env.AAD_API_URL}/document/${owner}/${id}`;
      const headers = this.aadHeaderGuest;
      try {
        return await this.$axios({
          url: url,
          method: 'get',
          headers: headers
        });
      } catch(err) {
        return this.service.touParagraphGet.defaults;
      }
    },
    touParagraphGetHandler (response) {
      // documents are stored as one word per row
      // this handler reassembles words into paragraphs {id, paragraph}
      // the calling component handles the display of the document
      // console.log('touGetHandler 1');
      if (!this.services) {
        throw Error('Services mixin has not been imported!');
      }
      let handler = new ResponseHelper(response);

      // Stop if service calls when not successful

      let statusCode = handler.status();

      if (statusCode !== '200') {
        this.statusCode = statusCode;
        return;
      }

      // let d = handler.getData(response);
      let d = handler.data();
      let lastP = 0;
      let w = ''; // d[i]['form']['w'];

      // combine words into paragraphs

      for (let i in d) {
        if (lastP != d[i]['form']['p']) {
            // console.log('para',{"id":lastP, "paragraph": w} );
            // this.service['touParagraphGet'].output.push({"id":lastP, "paragraph": w});
            this.addServiceDatum('touParagraphGet',{"id":lastP, "paragraph": w});
            w = d[i]['form']['w'];
        } else {
          if (w.length > 0){
            w += ' ';
          }
          w += d[i]['form']['w'];
        }
        lastP = d[i]['form']['p'];
      }

      // finish off the last paragraph

      if (w.length > 0) {
        this.addServiceDatum('touParagraphGet',{"id":lastP, "paragraph": w});

        // this.service['touParagraphGet'].output.push({"id":lastP, "paragraph": w});
        w=null;
      }

    }
  }
}
