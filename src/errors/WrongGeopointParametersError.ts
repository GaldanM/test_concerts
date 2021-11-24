export default class WrongGeopointParametersError implements Error {
  message: string;
  name: string;

  constructor(message: string) {
    this.name = "WrongGeopointParametersError";
    this.message = message;
  }
}
