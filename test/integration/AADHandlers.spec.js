
import { AADHandlers } from '../../components/mixins/AADHandlers.js';
// import Axios from 'axios';
// const axios = new Axios();

const axios = require('axios');

describe('AADHandlers', () => {

  beforeEach(() => {

  });

  it('AADHandler Adoptee ', async () => {
    
    // untestable! 
    // axios isnt working in this context
    /*
    const test_data = {
      "owners":{
        "duckduckgoose":{
           "username":"get@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#oneget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"Oneget","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#twoget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#2", 
         "form": {"name":"Two", "drain_id":"Twoget","type":"TestDrain","lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#threeget", 
        "sk":"const#ADOPTEE", 
        "tk":"guid#3", 
        "form": {"name":"Three", "drain_id":"Threeget","type":"TestDrain","lat":1.0, "lon":1.0}, 
        "owner":"duckduckgoose"
       } 
      ]
    };
    // [Use Guest Token]
    const token = `Bearer ${process.env.AAD_API_TOKEN}`;
    const aadUrl = `${process.env.AAD_API_URL}/adoptee`;
    // console.log('token', token);
    // console.log('aadUrl ', aadUrl);
   
 
    const aadHeader = {
      "authorization": token,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Origin": "http://localhost",
      "access-control-request-method": "POST",
      "owner": "0",
      "debug": false,
      "rollback": true,
      "test": JSON.stringify(test_data)
    }; 
    
    const aadBody =  {"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0};
    
    try {
      // await axios.post(aadUrl, data, { headers })
      const response = await axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadBody });
    } catch (err) {

      console.log('err', err);
      // console.log('headers', headers);
      // console.log('mbr',mbr)
    }  
    */
  });

});
