
export default {
  data () {
    return {
      name:'TouMixin',
      tou: []
    }
  },
  methods: {

    processTou(response) {
      let lastP = 0;
      let paragraph = '';

      // first rec of tou is always meta data
      for (let w in response.data.selection) {
        // console.log('w ', w);
        w = parseInt(w);
        let thisP = parseInt(response.data.selection[w].form.p);

        if (w > 0) {
          if (lastP === thisP) {
            paragraph += `${response.data.selection[w].form.w} `;
          } else {
            //console.log('push ');

            this.tou.push(paragraph);
            // start next paragraph
            paragraph = `${response.data.selection[w].form.w} `;
          }
        }
        lastP = thisP; // parseInt(response.data.selection[w].form.p);

      }
      // save last paragraph
      this.tou.push(paragraph);
    },
    async requestTou () {

      let id = 'tou.md';
      let owner = '0';
      const aadURL = `${process.env.AAD_API_URL}/document/${owner}/${id}`;

      const aadToken = process.env.AAD_API_TOKEN; // guest token
      const aadHeader = {
          "Accept":"application/json",
          'Authorization': `Bearer ${aadToken}`,
          'Content-Type': 'application/json'
      };

      return this.$axios({
          url: aadURL,
          method: 'get',
          headers: aadHeader});
    },

    getTou() {

        let ex = '';
        let ln = '';
        let lastWasStar = false;
        let stack = [];
        let renderedHtml ='';

        for (let i in this.tou){
          ln = this.tou[i];
          // console.log('getTou ln ', ln);
          if (stack.length > 0 && ln.trim().length !== 0 && !ln.startsWith('* ')) {
            renderedHtml += '<ul>';
            for(let li in stack){
              let x = stack.pop();
              renderedHtml += x;
            }
            renderedHtml += '</ul>';
            lastWasStar = false;
          }
          // console.log('ln ', ln);
          if (ln.startsWith('# ')) {
             renderedHtml += `<h1>${ln.replace('# ','')}</h1></br>`;
          }
          else if (ln.startsWith('## ')) {
            renderedHtml +=  `<h2>${ln.replace('## ','')}</h2></br>`;
          }
          else if (ln.startsWith('### ')) {
            renderedHtml +=  `<h3>${ln.replace('### ','')}</h3>`;
          }
          else if (ln.startsWith('#### ')) {
            renderedHtml +=  `<h4>${ln.replace('#### ','')}</h4>`;
          }
          else if (ln.startsWith('##### ')) {
            renderedHtml +=  `<h5>${ln.replace('##### ','')}</h5>`;
          }
          else if (ln.startsWith('###### ')) {
            renderedHtml +=  `<h6>${ln.replace('###### ','')}</h6>`;
          }
          else if (ln.startsWith('* ') || lastWasStar) {
            lastWasStar = true;
            if (ln.trim().length > 0) {
              stack.push(`<li>${ln.replace('*','')}</li>`);
            }
          } else {
            renderedHtml += `<p>${ln}</p><br/>`;
          }
        }
        return renderedHtml;
      }
  }
}
