class ResponseRest {

  // consistant interface with AAD API Web Services
  // dont be tempted to put process code here. put in calling component

  constructor (component,name) {
    // component is the nuxt component
    this.component = component;
    this.name = name;
    /*
    this.guestHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
    };
    */
    this.graph = false;
    if (component.graph) {
        this.graph = component.graph;
    }
    this.response = false;

  }

  getMethod(response) {
    return response.config.method;
  }

  getStatus(response) {
      let rc = false;
      if (response.status === 200) {
         rc = response.data.status;
      }
      return rc;
  }

  getData(response) {
    let rc = false;
    let d = response.data;
    if (response.status === 200) {
      rc = `(${response.data.status})`;

      switch (response.config.method) {
        case 'post':
          if (response.data.status === '200') {
            rc = response.data.insertion;
          }  else if (response.data.status === '409') {
            rc = {duplicate: 'Duplicate'};
          }
          break;
        case 'put':
            rc = response.data.updation;
            // throw new Error('Unhandled put response!');
            break;
        case 'get':
            rc = response.data.selection;

            // throw new Error('Unhandled get response!');
            break;
        case 'delete':
            rc = response.data.deletion;

            // throw new Error('Unhandled delete response!');
            break;

      }
    } else {
      rc = `(${response.status})`;
        // throw new Error('Failed Request!');
    }

    return rc;
  }
  setResponse(response) {
      this.response = response;
      return this;
  }
  // Start Here
  handler(response) {
    this.setResponse(response);
    // console.log('handler method ',response.config.method );
    let method = this.getMethod(response)// response.config.method;
    let status = '900';// this.getStatus(response);
    if (this.graph) {
        let d = this.getData(response);
        this.graph.addResponseService(method.toUpperCase(), this.name, this.graph.formatOutput(d));
    }

    switch(method) {
      case 'post':
          if (this.graph) {
            this.graph.add_PassFail(this.name, '400', '404', '409');
          }
          status = this.postHandler();
          break;
      case 'put':
          if (this.graph) {
            this.graph.add_PassFail(this.name, '400', '404');
          }
          status = this.putHandler();
          break;
      case 'get':
          if (this.graph) {
            this.graph.add_PassFail(this.name, '400', '404');
          }
          status = this.getHandler();
          break;
      case 'delete':
          if (this.graph) {
            this.graph.add_PassFail(this.name, '400', '404');
          }
          status = this.deleteHandler();
          break;
    }
    return status;
  }
  postHandler() {
    console.log('overload postHandler');
    return '900';
  }
  putHandler() {
    console.log('overload putHandler');
    return '900';
  }
  getHandler() {
    console.log('overload getHandler');
    return '900';
  }
  deleteHandler() {
    console.log('overload deleteHandler');
    return '900';
  }
  post (response) {
      // this.getResponseData(response);
      this.setResponse(response);

      let rc = false;
      let responseRest = new ResponseRest(this);
      let d = responseRest.getData(response);
      let s = responseRest.getStatus(response);

      if (this.graph) {
        this.graph.addResponseService('POST',
                                      this.name,
                                      this.graph.formatOutput(d));
        this.graph.add_PassFail(this.name, '400', '404', '409');
      }

      return this.postHandler();

  }
/*
  put (response) {
      if (this.graph) {
        this.graph.addResponseService('PUT', this.name, this.graph.formatOutput(response.data.updation.form));
        this.graph.addPassFail(this.name, '400', '404');
      }


  }
  delete (response) {
      if (this.graph) {
        this.graph.ddResponseService('DELETE', this.name, this.graph.formatOutput(response.data.deletion));
        this.graph.addPassFail(this.name, '400', '404');
      }


  }
  get (response) {
      if (this.graph) {
        this.graph.addResponseService('GET', this.name, this.graph.formatOutput(response.data.selection));
        this.graph.addPassFail(this.name, '400', '404');
      }


  }
  */
}

export { ResponseRest }
