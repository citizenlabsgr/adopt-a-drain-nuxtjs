import { mount } from '@vue/test-utils'
// import Logo from '@/components/Logo.vue'
// fire up dotenv but only in dev
// TODO: add AAD_URL to adopt-a-drain/.env
// TODO: add AAD_TOKEN to adopt-a-drain/.env
// DONE: add DW_USER to adopt-a-drain/.env
// DONE: add DW_AUTH_TOKEN to adopt-a-drain/.env
// DONE: add DW_DRAIN_URL to adopt-a-drain/.env
// DONE: add GOOGLE_MAPS_API_KEY to adopt-a-drain/.env

if (process.env.NODE_ENV !== 'production') {
  process.env.DEPLOY_ENV=''
  require('dotenv').config()
}
describe('Environment Vars', () => {

  test('Environment Variables', () => {
    expect(process.env.AAD_API_URL).not.toBeUndefined();
    expect(process.env.AAD_API_TOKEN).not.toBeUndefined();
    expect(process.env.DW_USER).not.toBeUndefined();
    expect(process.env.DW_AUTH_TOKEN).not.toBeUndefined();
    expect(process.env.DW_DRAIN_URL).not.toBeUndefined();
    expect(process.env.GOOGLE_MAPS_API_KEY).not.toBeUndefined();

  })
})
