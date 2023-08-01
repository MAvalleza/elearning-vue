import { Delta } from "@vueup/vue-quill";

interface Content {
  moduleId: string,
  content: string | file | Delta,
  type: string,
}