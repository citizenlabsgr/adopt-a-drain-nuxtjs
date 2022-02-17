class RequestRest {
  
  // consistant interface with AAD API Web Services
  // dont be tempted to put process code here. put in calling component
  
  constructor (component,name) {
    // component is the nuxt component
    this.component = component;
    this.name = name;
    this.guestHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
    };
    this.userHeader = false;
    if (this.component.current_token) {
      this.userHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.component.current_token}`,
        'Content-Type': 'application/json'
      };
    }
    
    this.graph = false;
    if (component.graph) {
        this.graph = component.graph;
    }  

  }
  
  async post (URL, HEADER, DATA) {
    // console.log('post 1');
    // console.log('post URL     ', URL );
    // console.log('post HEADER ', HEADER );
    // console.log('post DATA    ', DATA );
    // console.log('post 2');

    if(this.graph) {
        this.graph.addRequestService('POST',this.name);
    }
    // console.log('post 3');

    const url = URL;
    const header = HEADER;
    const data = DATA;
    // console.log('post out');

    return await this.component.$axios({
      url: url,
      method: 'post',
      headers: header,
      data: data });
  }

  async put (URL, HEADER, DATA) {
    const url = URL;
    const header = HEADER;
    const data = DATA;
    return await this.component.$axios({
      url: aadURL,
      method: 'put',
      headers: header,
      data: data });
    
  }
  async delete (URL, HEADER) {
    const url = URL;
    const header = HEADER;
    return await this.component.$axios({
      url: URL,
      method: 'delete',
      headers: header});
  
  }
  async get (URL, HEADER) {
    if(this.graph) {
        this.graph.addRequestService('GET',this.name);
    }
    const url = URL;
    const header = HEADER;

    return await this.component.$axios({
      url: URL,
      method: 'get',
      headers: header});
  
  }
  /*
  async aadAdopteeGetMBR (aadURL, aadHeader, aadBody) {
    // aadURL    string
    // aadHeader object
    // aadBody   object

    // aadBody is MBR, {"north":<N.N>,"south":<N.N>,"west":<N.N>,"east":<N.N> }
    // aadHeader has Authorization
    // inject MBR into aadHeader

    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody});
    return response
  }

  ///////////////
  // Adopter
  /////////
  // async aadAdopterPost (aadURL, aadHeader, aadBody) {

  async aadAdopterPost (form) {
    if (this.graph) {

    }
    const url = process.env.AAD_API_URL + '/signup';
    const headers = this.guestHeader;
    const data = form;

    // New Adopter aka user 
    return await this.component.$axios({
      url: url,
      method: 'post',
      headers: headers,
      data: data });
  }

  async aadAdopterGet (aadURL, aadHeader) {
    // existing user
    // /adopter/owner/id

    const response = await this.component.$axios({
      url: aadURL,
      method: 'get',
      headers: aadHeader});
    return response
  }

  async aadAdopterPut (aadURL, aadHeader, aadBody) {
    // existing user

    const response = await this.component.$axios({
      url: aadURL,
      method: 'put',
      headers: aadHeader,
      data: aadBody });
    return response
  }

  async aadSignin (aadURL, aadHeader, aadBody) {
    // aadURL    string
    // aadHeader object
    // aadBody   object

    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody });
    return response
  }
  */
}

export { RequestRest }