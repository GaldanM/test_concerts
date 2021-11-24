class UnknownBandError implements Error {
  message: string;
  name: string;

  constructor(bandId: number) {
    this.name = "UnknownBandError";
    this.message = `Band with ID "${bandId} cannot be found."`;
  }
}
