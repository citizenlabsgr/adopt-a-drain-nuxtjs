// import { Response TOU } from '@/components/mixins/tou/Response TOU.js';
// import { RequestTOU } from './RequestTOU';
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "TOU",
      service: {
        tou: {
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
          depmapping: {
            "form": {"i": "00000", "p": 0, "w": "tou.md", "doc_id": "tou.md"}
          },
          output: {
            "touList": [
              {
                "id": "",
                "paragraph": ""
              }
            ]
          }
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
    }
  },
  methods: {
    getTouMapping() {
      return this.service.tou.mapping;
    },
    getTouList() {
      return this.service.tou.output.touList;
    },
    resetTouList() {
      this.service.tou.output.touList.length = 0;  
    },
    addTouDatum(datum) {
      // console.log('datum ', datum);
      this.service.tou.output.touList.push(datum);
    },
    setTouStatus(statusCode) {
      this.service.tou.statusCode = statusCode;
    },
    getTouStatus() {
      return this.service.tou.statusCode;
    },
    /*
    async touGetRequest (owner, id) {
      return new RequestTOU(this).Get(owner,id)
    },
    */
    async touGetRequest(owner, id) { // replaces loadAdopter  
      // console.log('touGetRequest 1');
      const url = `${process.env.AAD_API_URL}/document/${owner}/${id}`;
      const headers = this.aadHeaderGuest;    
      // console.log('url ', url);
      // console.log('headers ', headers);  
      return await this.$axios({
        url: url,
        method: 'get',
        headers: headers});
    },
    
    touGetHandler (response) {
      // documents are stored as one word per row
      // this handler reassembles words into paragraphs {id, paragraph}
      // the calling component handles the display of the document

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
            this.addTouDatum({"id":lastP, "paragraph": w});
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
        this.addTouDatum({"id":lastP, "paragraph": w});
        w=null;
      }

    }
  }
}