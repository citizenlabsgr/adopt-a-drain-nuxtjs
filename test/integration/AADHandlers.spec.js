
import { AADHandlers } from '../../components/mixins/AADHandlers.js';
// import Axios from 'axios';
// const axios = new Axios();

const axios = require('axios');

describe('AADHandlers', () => {

  beforeEach(() => {

  });

  it('AADHandler Adoptees ', async () => {
    
    // untestable! 
    // axios isnt working in this context
    /*
    const token = 'Bearer ' + process.env.AAD_API_TOKEN;
    const aadUrl = process.env.AAD_API_URL + '/adoptees';
    const headers = {
      'Content-Type': 'application/json',
      'authorization': token,
      'rollback': true
    };    
    
    const headers = {
        authorization: token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'http://localhost',
        'access-control-request-method': 'POST',
        rollback: true
    }; 
    
    const headers = {
        authorization: token,
        rollback: true,
    }; 
    
    const aadBody =  {
        "west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0
    };
    try {
      await axios.post(aadUrl, aadBody, { headers })
    } catch (err) {
      console.log('err', err);
      console.log('headers', headers);
    }  
    */
  });

});
