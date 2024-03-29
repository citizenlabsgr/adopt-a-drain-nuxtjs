// import { Response TOU } from '@/components/mixins/tou/Response TOU.js';
// import { RequestTOU } from './RequestTOU';
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "TOU",
      touService: "tou",
      defaultService: "touDefault",
      service: {
        tou: {
          response: [],
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
          output: [],
        },
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
              "form": {"id": 'tou.document.id', "name":"00000.00000", "value":"#"},
              "owner": "api_admin",
              "pk": "doc_id#tou.document.md",
              "sk": "name#00000.00000",
              "tk": "value##",
              "updated": "2022-06-14T10:28:58.30262"
            }
          ],
          output: [
            {
              "active": true,
              "created": "2022-06-14T10:28:58.30262",
              "form": {"id":"tou.id", "name":"00000", "value":"#"},
              "owner": "api_admin",
              "pk": "doc_id#tou.md",
              "sk": "name#00000",
              "tk": "value##",
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
              "form": {"i": '00000', "p": 0, "w": "tou.document.md", "doc_id": "tou.document.md"},
              "owner": "api_admin",
              "pk": "doc_id#tou.document.md",
              "sk": "i#00000",
              "tk": "w#tou.document.md",
              "updated": "2022-06-14T10:28:58.30262"
            }
          ],
          output: [
          ],
          default: [

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
    getTouList() {
      return this.getServiceList(this.touService);
    },
    addTouDatum(datum) {
      this.addServiceDatum(this.touService, datum);
    },
    async touGetRequest(owner, id) { // replaces loadAdopter
      console.log('touGetRequest 1');

      const url = `${process.env.AAD_API_URL}/document/${owner}/${id}`;
      const headers = this.aadHeaderGuest;
      // console.log('touGetRequest url ',url );
      try {
        return await this.$axios({
          url: url,
          method: 'get',
          headers: headers
        });
      } catch(err) {
        console.error(`touGetRequest error: ${err}`);
        const DEFAULT = require('./defaults.json')
        return DEFAULT;
        // return this.service.touParagraphGet.defaults;
      }

      // const DEFAULT = require('./defaults.json');
      // return DEFAULT.GET;
    },


    touGetHandler (response) {
      // documents are stored as one word per row
      // this handler reassembles words into paragraphs {id, paragraph}
      // the calling component handles the display of the document
      // console.log('touGetHandler 1');
      // console.log('touGetHandler 1 response ', response);

      if (!this.services) {
        throw Error('Services mixin has not been imported!');
      }
      // console.log('touGetHandler 2');

      let handler = new ResponseHelper(response);

      // Stop if service calls when not successful

      let statusCode = handler.status();

      if (statusCode !== '200') {
        this.statusCode = statusCode;
        console.warn(`statusCode ${this.statusCode} check database for TOU document!`);
        return;
      }
      // console.log('touGetHandler 3');

      // let d = handler.getData(response);
      let d = handler.data();
      // let lastP = 0;
      // let w = ''; // d[i]['form']['w'];
      // let lastParagraph = name.split('.')[0];
      // let lastWord = name.split('.')[1];
      // console.log('touGetHandler 3', );
      let id = d[0].pk.split('#')[1];
      let lastName = d[0].sk.split('.')[0]; //  name#00000.00000 --> name#00000
      let paragraph = '';
      // combine words into paragraphs
      for (let item of d) {
        // console.log('A', JSON.stringify(item));
        if (item.sk.startsWith(lastName)) {
          // console.log('A1');
          // console.log('item.sk ', item.tk.replace('value#',''));

          if (paragraph.length > 0) {
            paragraph += ' ';
          }
          // console.log('A2');
          paragraph += item.tk.replace('value#','');
          // console.log('A3');
        } else {
          // console.log('B');
          // let id = item.pk.split('#')[1];
          // console.log('paragraph ', {"id": id, "name": lastName, "value": paragraph});
          this.addTouDatum({"id": id, "name": lastName, "value": paragraph});
          lastName = item.sk.split('.')[0]; //  name#00000.00000 --> name#00000
          paragraph = '';
          paragraph += item.tk.replace('value#', '');
        }
      }
      console.log('out 1');
      console.log('out 1',id);
      console.log('out 1', lastName);
      console.log('out 1', paragraph);



      console.log('eparagraph ', {"id": id, "name": lastName, "value": paragraph});
      console.log('out 2');
      this.addTouDatum({"id": id, "name": lastName, "value": paragraph});

      console.log('touGetHandler 4');

      // finish off the last paragraph
      console.log('paragraph ', paragraph);

      console.log('touGetHandler out');

    }

  }
}
