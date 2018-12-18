import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixins from './mixins'
import filters from './filters'
import directives from './directives'
import 'whatwg-fetch'
import 'normalize.css'

Object.keys(mixins).forEach(key=>{
  Vue.mixin(key, mixins[key]);
});
Object.keys(filters).forEach(key=>{
  Vue.filter(key, filters[key]);
});
Object.keys(directives).forEach(key=>{
  Vue.directive(key, directives[key]);
});

Vue.config.productionTip = false;

new Vue({
  <% if (vuei18n) { %>
  i18n,
  <% } %>
  router,
  store,
  render: h => h(App),
}).$mount('#app');
