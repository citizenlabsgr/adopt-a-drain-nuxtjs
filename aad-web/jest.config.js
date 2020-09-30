module.exports = {
  //globalSetup: "<rootDir>/jest.setup.js", // this line is the only change here
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    //'^/store/(.*)': '<rootDir>/store/$1',
  },
  moduleFileExtensions: [
    'js',
    'vue',
    'json'
  ],
  resolver: null,
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue'
  ]
}
