import type { Course } from '@/types/course';
import type { Module } from '@/types/module';
import { defineStore } from 'pinia';

type CurrentLesson = {
  course: Course;
  module: Module;
}

export const useStudent = defineStore('student', {
  state: () => ({
    currentLesson: <CurrentLesson>{}
  }),
  actions: {
    setCurrentLesson(lesson: CurrentLesson) {
      this.currentLesson = lesson;
    }
  }
});