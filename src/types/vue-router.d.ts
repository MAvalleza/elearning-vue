import { type RouteMeta, type RouteLocationNormalizedLoaded, type RouteParams } from 'vue-router';

interface CustomRouteMeta extends RouteMeta {
  from?: string | null
}

interface CustomParams extends RouteParams {
  subjectId?: string,
  courseId?: string,
  moduleId?: string,
}

interface RouteWithCustomProperties extends RouteLocationNormalizedLoaded {
  meta?: CustomRouteMeta,
  params?: CustomParams
}

export { RouteWithCustomProperties };