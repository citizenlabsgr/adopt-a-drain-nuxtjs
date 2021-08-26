
import { TokenHelper } from '../../Components/mixins/TokenHelper.js';
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

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    //Drain.mockClear();
    //mockDrain.mockClear();

  });

  it('Guest Token ', () => {
    //const mock_token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuLUxhYnMiLCJzdWIiOiJPcmlnaW4iLCJuYW1lIjoiQWRvcHQtYS1EcmFpbiIsInJvbGUiOiJndWVzdF9hYWQifQ.ML4Tmgv0jjwUzcqlxT3-Qcuk_vJpcgoXkni9IbdS4Wo';
    //const mock_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuTGFicyIsInN1YiI6Ik9yaWdpbiIsIm5hbWUiOiJBZG9wdC1hLURyYWluIiwicm9sZSI6Imd1ZXN0X2FhZCJ9.-qtPBLq_t76BTdV0PuGiJOiWLyx_K2dbAoW3b59EHuM';
    const mock_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuTGFicyIsInN1YiI6Ik9yaWdpbiIsIm5hbWUiOiJBZG9wdC1hLURyYWluIiwicm9sZSI6Imd1ZXN0X2FhZCJ9.-qtPBLq_t76BTdV0PuGiJOiWLyx_K2dbAoW3b59EHuM';
    const tH = new TokenHelper(mock_token);
    expect(tH.isExpired()).toEqual(false);
    expect(tH.isAuthenticated()).toEqual(false);
    expect(tH.getRole()).toEqual('guest_aad');
    expect(tH.getIssuer()).toEqual('CitizenLabs');
    expect(tH.getSubject()).toEqual('Origin');

    expect(tH.getName()).not.toBeDefined();
    expect(tH.getDisplayName()).not.toBeDefined();
    expect(tH.getExpiration()).not.toBeDefined();
    expect(tH.getKey()).not.toBeDefined();

  });
  it('Adopter Token ', () => {
    const mock_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuTGFicyIsInN1YiI6IkFkb3B0LUEtRHJhaW4iLCJqdGkiOiJqQGNpdGl6ZW5sYWJzLm9yZyIsImtleSI6ImI2Y2E4MzNkLTQyMDUtNDYzYi1hZTQ2LTRmNjRmZGZlMWM3ZSIsInJvbGUiOiJlZGl0b3JfYWFkIiwiZXhwIjoxNjAyMzI5NjE0fQ.LNla6KUQY-dx8_NVOq_CD5vH2C1tfiuZBFuDH7nf1Q4';
    const tH = new TokenHelper(mock_token);
    expect(tH.isExpired()).toEqual(true);
    expect(tH.isAuthenticated()).toEqual(false);

    expect(tH.getRole()).toEqual('editor_aad');
    expect(tH.getIssuer()).toEqual('CitizenLabs');
    expect(tH.getSubject()).toEqual('Adopt-A-Drain');

    expect(tH.getName()).toEqual('j@citizenlabs.org');
    //expect(tH.getDisplayName()).toEqual('');
    expect(tH.getExpiration()).toEqual(1602329614);
    expect(tH.getKey()).toEqual('b6ca833d-4205-463b-ae46-4f64fdfe1c7e');

  });
});
