import { observable, action, toJS } from 'mobx';

/**
 * 타이머 컨트롤을 위한 스토어
 */
export default class CountdownStore {
  @observable time;
  @observable seconds;
  @observable timer = 0;

  @action
  secondsToTime = secs => {
    // let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = minutes + ':' + seconds;
    if (minutes === 0 && seconds === 0) obj = '';

    return obj;
  };

  @action
  setTime = time => {
    this.time = time;
  };

  @action
  startTimer = () => {
    if (this.timer == 0 && this.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  };

  @action
  countDown = () => {
    let seconds = this.seconds - 1;
    this.time = this.secondsToTime(seconds);
    this.seconds = seconds;

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  };
}
