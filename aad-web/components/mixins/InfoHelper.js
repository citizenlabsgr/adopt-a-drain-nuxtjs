import { DrainTypes } from './DrainTypes.js'
import { Utils } from './Utils.js'

class InfoHelper {
  constructor (component) {
    // component is the nuxt component
    this.component = component;
    //this.map = component.$refs.mapRef.$mapObject
    this.types = new DrainTypes();
  }

  log( msg ) {
     this.component.log(msg);
  }


  form(drainObj) {

    let form = '';
    switch(drainObj.getType()){
      case this.types.adoptee:
        form = this.form_info(drainObj);
        break;
      case this.types.orphan:
        form = this.form_info(drainObj);
        break;
      case this.types.yours:
        form = this.form_remove(drainObj);
        break;
      default:
        form = this.form_info(drainObj);

    }
    return form;
  }


  form_add(drainObj) {
    let form = '<info>';
    if (this.component.adopter_token_helper.isAuthenticated()) {
      form += 'Name Me:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>';
      form += '<button id="adoptButton" data-id="' + drainObj.getId() + '">Adopt</button>';
    } else {
      form += this.form_info(drainObj);
    }
    form += '</info>';
    return form;
  }

  form_info(drainObj) {
    // this is default info window
    let form = '<info>';
    // form += this.component.isAuthenticated

    for (let item in drainObj.getData()) {
      form += '<div><span>'+item+':</span><span>' + drainObj.getData()[item] + '</span></div>';
    }
    // form = 'Name Me:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>'
    // form += '<button id="orphanButton" data-id="' + drainObj.drain_id + '">Orphan</button>'
    form += '</info>';
    return form;
  }

  form_remove(drainObj) {
    let form = '<info>';
    form += '<button id="orphanButton" data-id="' + drainObj.getId() + '">Orphan</button>';
    form += '</info>';
    return form;
  }

  setup_buttons() {
    let button
    let markerId
    let inputValue

    if (document.getElementById('orphanButton')) {
      //this.component.log('setup_buttons 2')
      // Bind action for delete button
      button = document.getElementById('orphanButton');
      button.focus();
      markerId = button.getAttribute('data-id');
      button.onclick = function () {
          // Call deleteMarker function
          alert('not implemented...yet');
      };
    } else if (document.getElementById('adoptButton')) {
      // prep the adoption form
      //  get name of drain
      //  submit a copy of the drain object to the database
      // Bind action for set title button
      button = document.getElementById('adoptButton');
      markerId = button.getAttribute('data-id');
      const component = this.component;

      button.onclick = function () {
          // Get input value and call setMarkerTitle function
          inputValue = document.getElementById('nameinput').value;
          // make copy with the marker
          //let drainObj = component.settings.drains[markerId]
          let drainObj = component.drain_dict.get(markerId);
          // let _obj = new Utils().copyNoObjects(drainObj.getData());
          //let _obj = drainObj.getData();
          if (inputValue && inputValue.length > 0) {
             //_obj['name']=inputValue;
             drainObj.setName(inputValue);
          }
          // adopter keys
          //component.adopt_a_drain(_obj);
          component.adopt_a_drain(drainObj);

          component.info_window.close();
      };
      document.getElementById('nameinput').focus();
    } else {

    }
    //this.component.log('setup_buttons out')

    return this;
  }
}
/*
google.maps.event.addListener(infowindow, 'domready', function () {
        //console.log('hi')
        mapHelper.log('hi')
        let button, markerId, inputValue;

        // Switch scenarii depending on infowindow contents
        if (document.getElementById('deleteButton')) {

            // Bind action for delete button
            button = document.getElementById('deleteButton');
            button.focus();
            markerId = parseInt(button.getAttribute('data-id'));
            button.onclick = function () {

                // Call deleteMarker function
                deleteMarker(markerId);
            };


        } else {
          //alert('hi')

            // Bind action for set title button
            button = document.getElementById('inputButton')
            markerId = parseInt(button.getAttribute('data-id'))
            button.onclick = function () {
                // Get input value and call setMarkerTitle function
                inputValue = document.getElementById('nameinput').value
                // setMarkerTitle(markerId, inputValue);
            }

            document.getElementById('nameinput').focus()

        }
    });
    */
export { InfoHelper }
