import { DrainTypes } from './DrainTypes.js'
import { Utils } from './Utils.js'

class InfoHelper {
  //constructor (component) {
  constructor (tokenHelper) {

    // component is the nuxt component
    //this.component = component;
    this.types = new DrainTypes();
    this.ignore   = 'adopter_key,lon,lat,type, drain_id';
    this.editable = 'name';

    this.is_authenticated = tokenHelper.isAuthenticated();
    //console.log('infohelper 2 ' + this.is_authenticated);
    this.adopter_key = tokenHelper.getKey();
    //console.log('infohelper out');

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
    /*
    if (drainObj.getType() === 'adoptee' ) {
      console.log('isAuthenticated: ' + isAuthenticated);
      console.log('adopter_key: ' + adopter_key);
      console.log('drainObj.getKey(): ' + drainObj.getKey())
      console.log('type: ' + drainObj.getType())
    }
    */
    let form = '';
    //console.log(drainObj)
    //console.log('type: ' + drainObj.getType());
    switch(drainObj.getType()){
      case this.types.yours:
      case this.types.adoptee:
        //console.log('switch adoptee')
        // is yours drainObj.
        //console.log('this.is_authenticated: ' + this.is_authenticated);

        //console.log('this.adopter_key: ' + this.adopter_key);
        //console.log('drainObj.getKey(): ' + drainObj.getKey());
        if (this.is_authenticated && this.adopter_key === drainObj.getKey()) {
          //console.log('yours')
          form = this._form_edit(drainObj);
        }
        else {
          //console.log('not yours')
          form = this._form_info(drainObj);
        }
        break;
      case this.types.orphan:
        if (this.is_authenticated) {
          form = this._form_add(drainObj);
        } else {
          form = this._form_info(drainObj);
        }
        break;
      //case this.types.yours:
      //    //console.log('yours')
      //    form = this._form_edit(drainObj);
      //break
      default:
        form = this._form_info(drainObj);
    }
    //console.log(form)
    return form;
  }

  _form_add(drainObj) {
    let form = '<info>';
    if (this.is_authenticated ){

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
    form += 'Adopted by You x';
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
  _getLabel(type) {
    let rc = 'Untyped';
    switch(type) {
      case this.types.orphan:
        rc = 'Orphan';
        break;
      case this.types.adoptee:
        rc = 'Adoptee';
        break;
      case this.types.yours:
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

  _form_remove(drainObj) {
    let form = '<info>';
    form += '<button id="orphanButton" data-id="' + drainObj.getId() + '">Orphan</button>';
    form += '</info>';
    return form;
  }

  getButtonName() {
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
