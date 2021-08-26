import { DrainTypes } from './DrainTypes.js'
import { Utils } from './Utils.js'

class InfoHelper {
  //constructor (component) {
  constructor (tokenHelper) {
    // component is the nuxt component
    this.ignore   = 'adopter_key,lon,lat,type, drain_id';
    this.editable = 'name';
    this.tokenHelper = tokenHelper;
    //this.adopter_key = tokenHelper.getKey();
  }

  log( msg ) {
    /* eslint-disable no-console */
    console.log('Unexpected issue with adoption!')
    /* eslint-enable no-console */
  }

  form(drainObj) {
    // type/auth  | orphan    | adoptee &&   | adoptee &&
    //                        | adopter_id = | adopter_id !=
    //                        |--------------|---------------
    // auth no    | form_info | form_info    | form_info
    // auth yes   | form_add  | form_edit    | form_info

    let form = '';
    //console.log(drainObj)
    //console.log('type: ' + drainObj.getType());
    switch(drainObj.getType()){
      case DrainTypes.yours:
      case DrainTypes.adoptee:
        //console.log('switch adoptee')
        // is yours drainObj.
        if (this.tokenHelper.isAuthenticated() && this.tokenHelper.getKey() === drainObj.getKey()) {
          //console.log('yours')
          form = this._form_edit(drainObj);
        }
        else {
          //console.log('not yours')
          form = this._form_info(drainObj);
        }
        break;
      case DrainTypes.orphan:
        if (this.tokenHelper.isAuthenticated()) {
          form = this._form_add(drainObj);
        } else {
          form = this._form_info(drainObj);
        }
        break;
      default:
        form = this._form_info(drainObj);
    }
    //console.log(form)
    return form;
  }

  _form_add(drainObj) {
    let form = '<info>';
    if (this.tokenHelper.isAuthenticated() ){
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
    form += '<hr/>';

    form += '<button id="adoptUpdateButton" data-id="' + drainObj.getId() + '">Save</button>';
    form += '<button id="orphanButton"      data-id="' + drainObj.getId() + '">Orphan</button>';

    //form += '<button id="orphanButton" data-id="' + drainObj.getId() + '">Orphan</button>';
     /*const handleClick = () => {
      console.log("Hello World");
    }*/
    //form += '<button id="orphanButton" data-id="' + drainObj.getId() + '">Orphan</button>';

    //form += '<button id="orphanButton" data-id="' + drainObj.getId() + '" onclick="function(){ console.log("Hello World"); }">Orphan</button>';

    form += '</info>';
    return form;
  }
  _getLabel(type) {
    let rc = 'Untyped';
    switch(type) {
      case DrainTypes.orphan:
        rc = 'Orphan';
        break;
      case DrainTypes.adoptee:
        rc = 'Adoptee';
        break;
      case DrainTypes.yours:
        rc = 'Adopted by You';
        break;
    }
    return rc;
  }
  _form_info(drainObj) {
    // this is default info window
    let form = '<info>';

    form += '<div>';
    form += '<h1>';

    // form += drainObj.getData()['type'].charAt(0).toUpperCase() + drainObj.getData()['type'].slice(1);
    form += this._getLabel(drainObj.getType());
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
  /*
  _form_remove(drainObj) {
    let form = '<info>';
    form += '<button id="orphanButton" data-id="' + drainObj.getId() + '">Orphan</button>';
    form += '</info>';
    return form;
  }
  */

  getButtonName() {
    // Objective: Add, update or remove adoptee
    // Strategy: * buttons are instatiated when user clicks on a drain
    //           * only one button is in DOM at a time
    //           *

    if (document.getElementById('orphanButton')) {
      return 'orphanButton';
    } else if (document.getElementById('adoptButton')) {
      return 'adoptButton';
    } else if (document.getElementById('adoptUpdateButton')) {
      return 'adoptUpdateButton'
    }
    return undefined;
  }

}
export { InfoHelper }
