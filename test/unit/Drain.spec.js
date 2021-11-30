
import { Drain } from '../../components/mixins/Drain.js';

describe('Testing mocking classes', () => {

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    //Drain.mockClear();
    //mockDrain.mockClear();

  });

  it('Drain getters ', () => {
    const drain_json = {
      type: 'orphan',
      lat: 42.01,
      lon: -83.02,
      drain_id: 'GR_00000000',
      name: 'name me'
    };
    // const example_json = {};
    const drain = new Drain().setData(drain_json);

    expect(JSON.stringify(drain.getData())).toEqual(JSON.stringify(drain_json));
    expect(drain.getId()).toEqual('GR_00000000');
    //expect(drain.getKey()).toEqual('f610ad41-f1fb-41a1-a67f-9747f337bb9f');
    // console.log('drain.getKey() ', drain.getKey());
    
    expect(drain.getKey()).toEqual(false);

    expect(drain.getLat()).toEqual(42.01);
    expect(drain.getLon()).toEqual(-83.02);

    expect(drain.getName()).toEqual('name me');

    //expect(drain.getType()).toEqual('Adopt-A-Drain');
    expect(drain.getMarker()).toEqual(null);
    expect(drain.getMarkerListener()).toEqual(null);

    //listeners and markers are not yet tested
  });
});
