import {DateUtils} from './DateUtils';

export class Utils {
  static log(...args) {
    console.log(DateUtils.timeNowString(), ...args);
  }
}
