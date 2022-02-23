// import { RequestTOU } from '@/components/mixins/tou/RequestTOU.js';
import { ResponseTOU } from '@/components/mixins/tou/ResponseTOU.js';

export default {
  data () {
    return {
      name: 'TOU',
      tou_markdown: []
    };
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
  
    getMarkdown(i=0) {
      if (i === 0) {
        return this.tou_markdown;
      }
      return this.tou_markdown[i];
    },
    
    formatParagraphs(response) {
      let p = 0;
      let para = '';
      const responseRest = new ResponseTOU(this);
      for (let i in responseRest.getData(response)) {
        let item = responseRest.getData(response)[i];
        if (item.form.p === 0) {
           // first item is metadata so skip
        } else {
          if (item.form.p !== p) {
            this.tou_markdown.push(para);
            para = '';
            p = item.form.p;
          }
          
          if (para.length > 0) {
            para += ' ';
          }
          // concat paragraph 
          para += item.form.w;
          p = item.form.p;
        }  
      }
    }
    
  }, // methods
}
