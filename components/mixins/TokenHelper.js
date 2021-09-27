/*
get the payload from a jwt
current keys:
  aud: "citizenlabs-api"
  iss: "citizenlabs"
  sub: "client-api"
  user: "guest"
  scope: "api_guest"
  key: "0"
{
 "aud": "citizenlabs-api"
  "iss": "citizenlabs"
  "sub": "client-api"
  "user": "guest"
  "scope": "api_guest"
  "key": "0"
}

previous keys:
  iss
  sub
  jti
  key
  role
  exp

*/
class TokenHelper {

  constructor (token) {
    //console.log('TokenHelper constructor: (' + token + ')');
    this.token = token
    this.payload = {}; // aka token payload, or the middle part of a JWT
    if (token && token.split('.').length === 3) {
      this.payload = JSON.parse(atob(token.split('.')[1]))
    }
  }

  getCurrentTime() {
    return new Date().getTime()/1000;
  }
  
  getDisplayName () {
    if (!this.token) {return undefined;}
    return this.payload.user;
  }

  getExpiration () { // broken
    if (!this.token) {return undefined;}
    return this.payload.exp;
  }

  getRole () { // aka getScope ... deprecated
    // if (!this.token) {return undefined;}
    // return this.payload.scope;
    return this.getScope();
  }
  
  getScope () { // aka getRole
    if (!this.token) {return undefined;}
    return this.payload.scope;
  }

  getSubject () {
    if (!this.token) {return undefined;}
    return this.payload.sub;
  }

  getIssuer () {
    if (!this.token) {return undefined;}
    return this.payload.iss;
  }

  getToken () {
    if (!this.token) {return undefined;}
    return this.token;
  }

  getKey () {
    if (!this.token) {return undefined;}
    return this.payload.key;
  }

  getName () {
    //console.log('getName')
    // if (!this.token) {return undefined;}
    // return this.payload.jti;
    return this.getDisplayName();
  }

  isAuthenticated () {
    
    // is not token
    if (!this.token) {
      return false;
    }

    return this.payload.exp > this.getCurrentTime();
  }

  isExpired () {
    if(this.getExpiration()){return true;}
    return this.getExpiration() < this.getCurrentTime();
  }

}
export { TokenHelper }
