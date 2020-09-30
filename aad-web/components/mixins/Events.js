class Event {
  constructor(component) {
    // this.vue = new Vue();
    this.vue = component;

  }

  fire(event, data = null, action) {
    this.vue.$emit(event, data, action)
  }

  listen(event, callback) {
    this.vue.$on(event, callback)
  }
}

export { Event }
