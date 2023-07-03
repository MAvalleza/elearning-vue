import { useAuth as authStore } from '@/stores/auth';

const ACTIVITY_EVENTS = [
  'mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'
];

// This code was derived from https://thisinterestsme.com/javascript-detect-user-activity/

/**
 * @param {Boolean} shouldWatch - flag if we want to track the activity, usually `true` when we are in authenticated routes
 */
export default function activityWatcher() {
  // The number of seconds that have passed since last activity
  let currentIdleTime = 0;

  // 20 minutes. 60 x 20 = 1200 seconds.
  const MAX_IDLE_TIME = (60 * 20);

  // Increment idle time
  const idleIntervalId = setInterval(async () => {
    currentIdleTime++;

    if (currentIdleTime > MAX_IDLE_TIME){
      await authStore().logoutUser();

      clearInterval(idleIntervalId);

      ACTIVITY_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, onActivity);
      });
    }
  }, 1000);

  // The function that will be called whenever a user is active
  function onActivity(){
    //reset the currentIdleTime to 0
    currentIdleTime = 0;
  }
  
  // Listen to the events and register them as activities
  ACTIVITY_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, onActivity, true);
  });
}

