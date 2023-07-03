import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import router from './router';
import createMockServer from './mock-server';
import App from './App.vue';

// Pinia
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router);
});

// MirageJS Mock server
const mockServer = createMockServer();

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(mockServer);
app.use(vuetify);

app.mount('#app');
