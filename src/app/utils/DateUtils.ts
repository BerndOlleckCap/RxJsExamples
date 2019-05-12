export class DateUtils {

  static timeNowString(): string {
    const date = new Date();
    return date.getHours().toString().padStart(2, '0')
      .concat(':')
      .concat(date.getMinutes().toString().padStart(2, '0'))
      .concat(':')
      .concat(date.getSeconds().toString().padStart(2, '0'))
      .concat('.')
      .concat(date.getMilliseconds().toString().padStart(3, '0'));
  }
}
