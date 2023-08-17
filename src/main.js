import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import createMockServer from './mock-server';
import App from './App.vue';

const app = createApp(App);

// Pinia
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router);
});

app.use(pinia);

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as labsComponents from 'vuetify/lib/labs/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
});

app.use(vuetify);

app.use(router);

// MirageJS Mock server

const mockServer = createMockServer({
  persistence: import.meta.env.VITE_MIRAGE_PERSISTENCE === 'true' ? true : false
});


if (import.meta.env.VITE_APP_ENV === 'test') {
  app.use(mockServer);
}

app.mount('#app');
