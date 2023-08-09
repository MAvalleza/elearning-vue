import { Delta } from '@vueup/vue-quill';
import { FetchParams } from './params';

interface Content {
  moduleId: string;
  content: string | file | Delta;
  type: string;
}

interface FetchContentsParams extends FetchParams {
  module: string;
}

export {
  Content,
  FetchContentsParams,
}
