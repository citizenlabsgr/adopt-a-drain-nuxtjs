
import { TokenHelper } from '../../components/mixins/TokenHelper.js';
/*
const drain_json = {
  type: 'orphan',
  lat: 42.01,
  lon: -83.02,
  drain_id: 'GR_00000000',
  name: 'name me'
}
*/

describe('Token', () => {
  const my_pw = 'my-secret-password-at-least-32-char-long';
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    //Drain.mockClear();
    //mockDrain.mockClear();

  });

  it('Guest Token ', () => {
    const mock_claims = {
      "aud": "citizenlabs-api",
      "iss": "citizenlabs",
      "sub": "adopt-a-drain-api",
      "user": "guest",
      "key": "0",
      "scope": "api_guest"
    }

    const mock_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImFkb3B0LWEtZHJhaW4tYXBpIiwidXNlciI6Imd1ZXN0Iiwia2V5IjoiMCIsInNjb3BlIjoiYXBpX2d1ZXN0In0.A6RrA7u2QdCZEqBGPeFNhr1rT1npwIsq_UC5tAwsD-o';
    const tH = new TokenHelper(mock_token);
    // getCurrentTime
    expect(tH.getDisplayName()).toEqual(mock_claims.user);
    // getExpiration
    expect(tH.getExpiration()).not.toBeDefined();
    // getRole
    expect(tH.getRole()).toEqual(mock_claims.scope);
    // getScope
    expect(tH.getScope()).toEqual(mock_claims.scope);
    // getSubject
    expect(tH.getSubject()).toEqual(mock_claims.sub);
    // getIssuer
    expect(tH.getIssuer()).toEqual(mock_claims.iss);
    // getToken
    // getKey
    expect(tH.getKey()).toEqual(mock_claims.key);
    // getName deprecated use getDisplayName
    expect(tH.getName()).toEqual(mock_claims.user);
    // isAuthenticated
    expect(tH.isAuthenticated()).toEqual(false);
    // isExpired
    expect(tH.isExpired()).toEqual(false);
    
  });

  it('Adopter Token ', () => {
    const mock_claims = {
      "aud": "citizenlabs-api",
      "iss": "citizenlabs",
      "sub": "adopt-a-drain-api",
      "user": "j@citizenlabs.org",
      "key": "b6ca833d-4205-463b-ae46-4f64fdfe1c7e",
      "scope": "editor_aad",
      "exp": 1602329614
    }

    const mock_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImFkb3B0LWEtZHJhaW4tYXBpIiwidXNlciI6ImpAY2l0aXplbmxhYnMub3JnIiwia2V5IjoiYjZjYTgzM2QtNDIwNS00NjNiLWFlNDYtNGY2NGZkZmUxYzdlIiwic2NvcGUiOiJlZGl0b3JfYWFkIiwiZXhwIjoxNjAyMzI5NjE0fQ.G9UHodq6T2eCAHWlhC0Ly5wZtnXjZYIfWk1UE02qWhA';
    const tH = new TokenHelper(mock_token);

    expect(tH.getDisplayName()).toEqual(mock_claims.user);
    expect(tH.getExpiration()).toEqual(mock_claims.exp);
    expect(tH.getScope()).toEqual(mock_claims.scope);
    expect(tH.getSubject()).toEqual(mock_claims.sub);
    expect(tH.getIssuer()).toEqual(mock_claims.iss);
    expect(tH.getKey()).toEqual(mock_claims.key);
    expect(tH.getName()).toEqual(mock_claims.user);
    expect(tH.isAuthenticated()).toEqual(false);
    expect(tH.isExpired()).toEqual(true);

  });
});
