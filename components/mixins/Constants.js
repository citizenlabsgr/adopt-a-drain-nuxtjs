/*
A list Regular Expressions
Usage:
  Constants.displayname().test('John')
*/
class Constants {
  static display_name () {
    return /.{1,}$/;
  }
  static one_char () {
    return /.{1,}$/;
  }
  static email () {
    return /\S+@\S+\.\S+/;
  }
  static user_name () {
    // return /\S+@\S+\.\S+/;
    return /^[\S+]{1,64}@[\S+]{1,249}\.[\S+]{1,5}$/;
  }
  static password () {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  }
  // to test parts of a bigger string
  static lowercase () {
    return /[a-z]{1,}/;
  }
  static uppercase () {
    return /[A-Z]{1,}/;
  }
  static digit () {
    return /[0-9]{1,}/;
  }
  static symbol () {
    return /[!@#$%^&*]{1,}/ ;
  }
  static eight_char () {
    return /.{8,20}$/;
  }

}
export { Constants }
