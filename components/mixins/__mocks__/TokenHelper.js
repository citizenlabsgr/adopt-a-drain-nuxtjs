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
/*
class TokenHelper {
  constructor (token) {
    console.log('Tokenhelper constr');
  }

  value (_key) {
    if (this.payload[_key]) {
      return this.payload[_key]
    }
    return undefined
  }

  isAuthenticated() {
    return false;
  }
  getKey() {
    return 'f610ad41-f1fb-41a1-a67f-9747f337bb9f';
  }
  getName() {
    return 'johndoe@citizenlabs.org';
  }
  getToken() {
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuTGFicyIsInN1YiI6IkFkb3B0LUEtRHJhaW4iLCJqdGkiOiJqb2huZG9lQGNpdGl6ZW5sYWJzLm9yZyIsImtleSI6ImY2MTBhZDQxLWYxZmItNDFhMS1hNjdmLTk3NDdmMzM3YmI5ZiIsInJvbGUiOiJlZGl0b3JfYWFkIiwiZXhwIjoxNjAwODY4MzA1fQ.t3SmCykRzKoX0sOtZ4BvzHU196HR_30Zs3P5RtSUum4';
  }

}
export default { TokenHelper }
*/
/*
jest.mock('../../Components/mixins/TokenHelper', () => {
  return jest.fn().mockImplementation(() => {
    return {
      isAuthenticated: false,
      getKey: 'f610ad41-f1fb-41a1-a67f-9747f337bb9f',
      getName: 'johndoe@citizenlabs.org',
      getToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuTGFicyIsInN1YiI6IkFkb3B0LUEtRHJhaW4iLCJqdGkiOiJqb2huZG9lQGNpdGl6ZW5sYWJzLm9yZyIsImtleSI6ImY2MTBhZDQxLWYxZmItNDFhMS1hNjdmLTk3NDdmMzM3YmI5ZiIsInJvbGUiOiJlZGl0b3JfYWFkIiwiZXhwIjoxNjAwODY4MzA1fQ.t3SmCykRzKoX0sOtZ4BvzHU196HR_30Zs3P5RtSUum4'
    };
  });
});
*/
