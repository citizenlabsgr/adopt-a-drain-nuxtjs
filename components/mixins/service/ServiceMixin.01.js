
/*
this functions operate in conjunction with the compoents data.services
setService(<serviceName>) before calling
expect data to contain
service: {
  <serviceName>: {
    <service>: {
      mapping: {
        <to>: <from>,
        ...
      },
      response: [
        {
          <fieldName>: <fieldValue>,
          ...
        }
      ],
      output: [
        {
          <fieldName>: <fieldValue>,
          ...
        }
      ]
    }
  }
}
*/

export default {
  data () {
    return {
      name: "Services",
      services: true,
      currentService: ""
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
    setService(service) {
      this.currentService = service;
    },
    getServiceList(service) {
      if (!this.service){
        throw new Error('Services have not been defined in data');
      }
      if (!this.service[service]) {
        throw new Error(`Undefined Service ${service}`);
      }
      if (!this.service[service].output) {
        throw new Error(`A. Undefined Service Output for ${service}`);
      }
      return this.service[service].output;
    },

    resetServiceList(service) {
      this.service[service].output.length = 0;
    },

    getServiceMapping(service) {
      // service is found in the services mixin
      // console.log('mapping 1');
      // comfigure the this.defaultService
      if (!this.service){
        throw new Error('Services have not been defined in data');
      }
      if (!this.service[service]) {
        throw new Error(`Undefined Service ${service}`);
      }
      if (!this.service[service].mapping) {
        throw new Error(`Undefined Service Mapping for  ${service}`);
      }
      // default
      return this.service[service].mapping;
    },

    addServiceDatum(service, datum ) {
      // service is found in the services mixin
      // assume Output is an array
      if (!this.service){
        throw new Error('Services have not been defined in data');
      }
      if (!this.service[service]) {
        throw new Error(`Undefined Service ${service}`);
      }
      if (!this.service[service].output) {
        throw new Error(`C. Undefined Service Output for  ${service}`);
      }

      this.service[service].output.push(datum);
    }
  }
}
