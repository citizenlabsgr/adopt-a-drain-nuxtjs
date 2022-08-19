<template>
  <div>
    <Header />
    <Nav />
    <nuxt />
    <Footer />
  </div>
</template>

<script>

import Header from '@/components/Header'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// import Vue from 'vue'
// import CommunityListMixin from '@/components/mixins/CommunityListMixin.js'
// Vue.mixin(CommunityListMixin);

export default {
  components: {
    Header,
    Nav,
    Footer
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.button {
  font-size: 20px;
}
.container {
  /*min-height: 10vh;*/
  min-height: 300px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: center;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 30px;
  color: #35495e;
  letter-spacing: 1px;
    padding-bottom: 15px;

}
.subtitle {
  font-weight: 300;
  font-size: 21px;
  color: #526488;
  word-spacing: 5px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
}
.description {
  font-weight: 300;
  font-size: 18px;
  color: #333333;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.list_title {
  font-weight: 300;
  font-size: 25px;
  color: #333333;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.feedback {
  font-weight: 300;
  font-size: 18px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.error {
  font-weight: 200 ;
  font-size: 12px;
  color: #FF0000;
  padding-bottom: 5px;
}
.links {
  padding-top: 15px;
  font-weight: 200 ;
}
.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.outer-div {
  width: 100%;
  text-align: center;
  /*background-color: #0666a3*/
}

.inner-div {
  display: inline-block;
  margin: 0 auto;
  padding: 3px;
  /*background-color: #8ebf42*/
}
.prompt {
  text-align:left;
  font-variant: petite-caps;
  padding:5px;
}
.label {
  text-align:left;
  font-variant: petite-caps;

}
.input_ok {
  color: #339933;
  text-align: left;
  font-variant: petite-caps;
  font-size: 12px;
  padding:5px;
  width: 200px;
}
.input_error {
  color: #990033;
  text-align: left;
  font-variant: petite-caps;
  font-size: 12px;
  padding-left:5px;
  width: 200px;
}
.list-item {
  list-style-type:none;
  margin:0;
  padding:0;
}
.list-item-bullet {
  list-style-type:disc;
  margin:0;
  padding:0px;
  margin-left: 35px;
}
.list_title {

}
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 50%;
  border: 1px solid #ddd;
  margin-left: auto;
  margin-right: auto;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}


div.empty {
  border-style: groove;
  margin: auto;
  width: 50%;
  border: 0.5px solid #dddddd;
  padding: 10px;

}
div.solid {
  border-style: groove;
  margin: auto;
  width: 50%;
  border: 0.5px solid #dfdfdf;
  padding: 10px;
  background-color: #eeeeee;
}
div.text {
  text-align: left;

}
</style>
