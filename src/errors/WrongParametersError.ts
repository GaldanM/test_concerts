export default class WrongParametersError implements Error {
  message: string;
  name: string;

  constructor() {
    this.name = "WrongParametersError";
    this.message = "You must at least provide `bandIds` AND/OR `latitude`/`longitude`/`radius`";
  }
}
