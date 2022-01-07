export default {
  data () {
    return {
       stub: "stub"
    }
  },

  methods: {
      getFrom() {
          return process.env.EMAIL_SOURCE || false;
      },
      
      getTo() {
         // return this.payload().user;
         // return this.username() || false;
         if (!process.env.EMAIL_TOKEN) {
            return false;
         }
         if (!process.env.EMAIL_SOURCE) {
            return false;
         }
         if (!this.payload) {
            return false;
         }
         return this.payload().user;
      },
      
      sendEmail(token, from, to, subject, message) {
          console.log(`
             |
          (token, from, to, subject, message)
             |
          [SendEmail]
 
          `);

          if (!token || !from || !to || !subject || !message) {
            console.log(`
               |
            (token:${token}, from:${from}, to:${to}, subject:${subject}, message:${message})
               |
            (throw error)
               |   
               =
            `);
          } else {
            console.log(`
               |
            (token, from, to, subject, message)
               |
            [SendEmail]
               |
            [call email service]
               .
               .
               .    
            (response)
               |

          `);
            console.log(`sent adoption email from ${from} to ${to} message ${message}`);
          }

      },
      sendAdoptionEmail() {
          console.log(`
          [sendAdoptionEmail]
             |
           (token, from, to, adoption_message)
             |
          [sendEmail]
             .
             .
             .
          []      
          `);
      },
      sendNewAccountEmail() {

      },
      sendPasswordReminder() {

      }
      
  }  
}
