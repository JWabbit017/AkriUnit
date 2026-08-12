export class src {
  static a() {
    return "hi";
  }

  static isEmpty(arr) {
    if (!(arr instanceof Array)) {
      throw new TypeError("Argument #1 (arr) should be of type Array, " + typeof arr + " found.");
    }

    return arr.length === 0;
  }
}