
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
      services: true
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
    getServiceSingleRows(service) {
      /*
      convert single list of items to a name value pair
      [
       {a:A},
       {b:B},
       {c:C},
       {d:D}
      ]
      to
      [
        {a:A, b:B},
        {c:C, d:D}
      ]
       */
      let rows = [];
      // assemble row
      let i = 0;
      let row = {}; // {row: 0};
      let k = 0;
      for (let item of this.getServiceList(service)) {
        // process items that start with item... skip other items
        // console.log('', JSON.stringify(item));
        if (item && item.name.startsWith('item')) {
          // Find the End (aka the beginging) of the group of items
          // the first item's name always ends with 0
          row = {};
          row['value'] = item.value ;
          rows.push(row);
        }
      }
      return rows;
    },
    getServiceRows(service) {
      // console.log('getServiceRows 1');
      /*
      convert single list of items to a name value pair
      [
       {a:A},
       {b:B},
       {c:C},
       {d:D}
      ]
      to
      [
        {a:A, b:B},
        {c:C, d:D}
      ]
       */
      let rows = [];
      // assemble row
      let i = 0;
      let row = {}; // {row: 0};
      let k = 0;
      // console.log('getServiceRows getServiceList ', this.getServiceList(service));
      for (let item of this.getServiceList(service)) {
        // process items that start with item... skip other items
        // console.log('', JSON.stringify(item));
        console.log('getServiceRows item', item);
        if (item && item.name.startsWith('item')) {
          // Find the End (aka the beginging) of the group of items
          // the first item's name always ends with 0

          switch (k) {   // name
            case 0:
              row = {};
              row['name'] = item.value ;
              k++;
              break;
            case 1:        // value
              row['value'] = item.value;
              k--;
              rows.push(JSON.parse(JSON.stringify(row)));
              break;
          }
        }
      }
      return rows;
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
