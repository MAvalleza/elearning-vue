import type { Delta } from "@vueup/vue-quill";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

// Converts Quill Delta format to HTML
export const convertToHTML =(delta: Delta) => {
  const deltaOps = delta.ops;
  const cfg = {};

  const converter = new QuillDeltaToHtmlConverter(deltaOps, cfg);

  return converter.convert();
};
