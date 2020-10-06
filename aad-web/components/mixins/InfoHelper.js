import { DrainTypes } from './DrainTypes.js'
import { Utils } from './Utils.js'

class InfoHelper {
  constructor (component) {
    // component is the nuxt component
    this.component = component;
    this.types = new DrainTypes();

    this.ignore   = 'adopter_key,lon,lat,type, drain_id';
    this.editable = 'name';

  }

  log( msg ) {
     this.component.log(msg);
  }

  form(drainObj, is_authenticated, adopter_key) {
    // type/auth  | orphan    | adoptee &&   | adoptee &&
    //                        | adopter_id = | adopter_id !=
    //                        |--------------|---------------
    // auth no    | form_info | form_info    | form_info
    // auth yes   | form_add  | form_edit    | form_info
    /*
    if (drainObj.getType() === 'adoptee' ) {
      console.log('is_authenticated: ' + is_authenticated);
      console.log('adopter_key: ' + adopter_key);
      console.log('drainObj.getKey(): ' + drainObj.getKey())
      console.log('type: ' + drainObj.getType())
    }
    */
    let form = '';
    switch(drainObj.getType()){
      case this.types.adoptee:
        //console.log('switch adoptee')

        // is yours drainObj.
        if (is_authenticated && adopter_key === drainObj.getKey()) {
          //console.log('yours')
          form = this._form_edit(drainObj);
        }
        else {
          //console.log('not yours')
          form = this._form_info(drainObj);
        }

        break;
      case this.types.orphan:
        if (is_authenticated) {
          form = this._form_add(drainObj);
        } else {
          form = this._form_info(drainObj);
        }
        break;
      case this.types.yours:
          //console.log('yours')
          form = this._form_edit(drainObj);
      break
      default:
        form = this._form_info(drainObj);
    }
    //console.log(form)
    return form;
  }

  _form_add(drainObj) {
    let form = '<info>';
    if (this.component.adopter_token_helper.isAuthenticated()) {
      form += 'Name Me:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>';
      form += '<button id="adoptButton" data-id="' + drainObj.getId() + '">Adopt</button>';
    } else {
      form += this._form_info(drainObj);
    }
    form += '</info>';
    return form;
  }

  _form_edit(drainObj) {
    // this is default info window
    let form = '<info>';

    form += '<div>'
    form += '<h1>'
    form += 'Adopted by You';
    form += '</h1>'
    form += '</div>';
    form += '<hr/>';

    for (let item in drainObj.getData()) {
      if (!this.ignore.includes(item)) {
        if (this.editable.includes(item)) {
           //console.log('form fld: ' + item )
           form += '<div class="prompt" ><label>'+item+'</label></div>'
           form += '<input id="'+item+'input'+'" type="text" value="'+drainObj.getData()[item]+'">';
        } else {
            form += '<div class="prompt" ><label>'+item+'</label></div>'
            form += '<div class="label">'
            form += drainObj.getData()[item];
            form += '</div>'
        }
      }
    }
    // form = 'Name Me:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>'
    // form += '<button id="orphanButton" data-id="' + drainObj.drain_id + '">Orphan</button>'
    form += '<hr/>';
    //console.log(drainObj)
    //console.log(drainObj.getData() )
    //console.log('form_edit ' + drainObj.getId());
    //console.log('<button id="adoptUpdateButton" data-id="' + drainObj.getId() + '">Save</button>')
    form += '<button id="adoptUpdateButton" data-id="' + drainObj.getId() + '">Save</button>';

    form += '</info>';
    return form;
  }

  _form_info(drainObj) {
    // this is default info window
    let form = '<info>';

    form += '<div>';
    form += '<h1>';
    form += drainObj.getData()['type'].charAt(0).toUpperCase() + drainObj.getData()['type'].slice(1);
    form += '</h1>';
    form += '</div>';
    form += '<hr/>';

    for (let item in drainObj.getData()) {
      if (!this.ignore.includes(item)) {
        //form += '<div><span>'+item+':</span><span>' + drainObj.getData()[item] + '</span></div>';
        form += '<div class="prompt" ><label>'+item+'</label></div>'
        form += '<div class="label">'
        form += drainObj.getData()[item];
        form += '</div>'
      }
    }
    // form = 'Name Me:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>'
    // form += '<button id="orphanButton" data-id="' + drainObj.drain_id + '">Orphan</button>'
    form += '</info>';
    return form;
  }

  _form_remove(drainObj) {
    let form = '<info>';
    form += '<button id="orphanButton" data-id="' + drainObj.getId() + '">Orphan</button>';
    form += '</info>';
    return form;
  }

  setup_buttons() {
    let button
    let drainId
    let inputValue

    if (document.getElementById('orphanButton')) {
      button = document.getElementById('orphanButton');
      button.focus();
      drainId = button.getAttribute('data-id');
      button.onclick = function () {
          // Call deleteMarker function
          alert('not implemented...yet');
      };
      return this;
    } else if (document.getElementById('adoptButton')) {
      button = document.getElementById('adoptButton');
    } else if (document.getElementById('adoptUpdateButton')) {
      button = document.getElementById('adoptUpdateButton')
      //console.log(button);
    }
    if (!button){
      //console.log('NO BUTTON FOUND');
      return;
    }
    // prep the adoption form
    //  get name of drain
    //  submit a copy of the drain object to the database
    // Bind action for set title button
    //console.log('found add button');
    // get id
    //console.log(button);
    drainId = button.getAttribute('data-id');
    const component = this.component;
    const flds = this.editable.split(',');
    button.onclick = function () {
        let form = {};
        for (let fld in flds) {
           form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
        }
        // Get input value and call setMarkerTitle function
        // make copy with the marker
        let drainObj = component.drain_dict.get(drainId);
        drainObj.merge(form);
        // adopter keys
        component.adopt_a_drain(drainObj);
        component.info_window.close();
    };
    //document.getElementById('nameinput').focus();
    //console.log('add b flds[0]: ' + flds[0]);

    document.getElementById(flds[0]+'input').focus();
  }
}
  /*
  setup_buttons() {
    let button
    let drainId
    let inputValue

    if (document.getElementById('orphanButton')) {

    } else if (document.getElementById('adoptButton')) {

    }

    if (document.getElementById('orphanButton')) {
      //this.component.log('setup_buttons 2')
      // Bind action for delete button
      button = document.getElementById('orphanButton');
      button.focus();
      drainId = button.getAttribute('data-id');
      button.onclick = function () {
          // Call deleteMarker function
          alert('not implemented...yet');
      };
    } else if (document.getElementById('adoptButton') ) {
      // prep the adoption form
      //  get name of drain
      //  submit a copy of the drain object to the database
      // Bind action for set title button
      //console.log('found add button');
      // get id
      button = document.getElementById('adoptButton');
      drainId = button.getAttribute('data-id');
      //console.log('drainId: ' + drainId);
      const component = this.component;
      const flds = this.editable.split(',');
      button.onclick = function () {
          let form = {};
          for (let fld in flds) {
             //console.log('fld: ' + flds[fld]);
             form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
          }
          // Get input value and call setMarkerTitle function
          // make copy with the marker
          let drainObj = component.drain_dict.get(drainId);
          drainObj.merge(form);
          // console.log(drainObj.data);
          // adopter keys
          component.adopt_a_drain(drainObj);
          component.info_window.close();
      };
      //document.getElementById('nameinput').focus();
      //console.log('add b flds[0]: ' + flds[0]);

      document.getElementById(flds[0]+'input').focus();
    } else if (document.getElementById('adoptUpdateButton')) {

      //console.log('found add button');
      // get id
      button = document.getElementById('adoptUpdateButton');
      drainId = button.getAttribute('data-id');
      //console.log('drainId: ' + drainId);
      const component = this.component;
      const flds = this.editable.split(',');
      button.onclick = function () {
          let form = {};
          for (let fld in flds) {
             //console.log('fld: ' + flds[fld]);
             form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
          }
          // Get input value and call setMarkerTitle function
          // make copy with the marker
          let drainObj = component.drain_dict.get(drainId);
          drainObj.merge(form);
          // console.log(drainObj.data);
          // adopter keys
          component.adopt_a_drain(drainObj);
          component.info_window.close();
      };
      //document.getElementById('nameinput').focus();
      //console.log(document.body.getElementsByTagName("*"));
      //console.log(document.querySelectorAll("input[type=text]"));
      //console.log('update b flds[0]: ' + flds[0]);

      document.getElementById(flds[0]+'input').focus();
    }
    //this.component.log('setup_buttons out')

    return this;
  }
  */

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
