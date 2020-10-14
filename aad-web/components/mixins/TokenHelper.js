/*
get the payload from a jwt
current keys:
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
    this.payload = {};
    if (token && token.split('.').length === 3) {
      this.payload = JSON.parse(atob(token.split('.')[1]))
    }
  }

  getCurrentTime() {
    return new Date().getTime()/1000;
  }
  getDisplayName () {
    if (!this.token) {return undefined;}
    return this.payload.jti;
  }
  getExpiration () {
    if (!this.token) {return undefined;}
    return this.payload.exp;
  }

  getRole () {
    if (!this.token) {return undefined;}
    return this.payload.role;
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
    if (!this.token) {return undefined;}
    return this.payload.jti;
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
