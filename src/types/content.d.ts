import { Delta } from '@vueup/vue-quill';
import { FetchParams } from './params';

type Content = {
  moduleId: string;
  content: string | file | Delta;
  type: string;
  isPublished: boolean;
}

interface FetchContentsParams extends FetchParams {
  module: string;
}

interface ContentUpdateParams {
  type?: Content['type'];
  content?: Content['content'];
  isPublished?: Content['isPublished'];
}

export {
  Content,
  FetchContentsParams,
  ContentUpdateParams,
}
