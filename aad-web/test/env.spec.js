import { mount } from '@vue/test-utils'
// import Logo from '@/components/Logo.vue'
// fire up dotenv but only in dev
if (process.env.NODE_ENV !== 'production') {
  process.env.DEPLOY_ENV=''
  require('dotenv').config()
}
describe('Environment Vars', () => {

  test('Environment Variables', () => {
    expect(process.env.DW_USER).not.toBeUndefined();
    expect(process.env.DW_AUTH_TOKEN).not.toBeUndefined();
    expect(process.env.DW_DRAIN_URL).not.toBeUndefined();
    expect(process.env.GOOGLE_MAPS_API_KEY).not.toBeUndefined();

  })
})
