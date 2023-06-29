import { defineStore } from 'pinia';
import isBoolean from 'lodash-es/isBoolean';

export const useUI = defineStore('ui', {
  state: () => ({
    loading: false,
    snackbar: { color: '', message: '' },
    isSnackbarVisible: false,
  }),
  actions: {
    // Set loading state to boolean value
    setLoading(val) {
      if (!isBoolean(val)) {
        return;
      }

      this.loading = val;
    },
    // Show snack bar message
    showSnackbar({ color, message }) {
      this.snackbar = { color, message };
      this.isSnackbarVisible = true;
    },
  },
});
