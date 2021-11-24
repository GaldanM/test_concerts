class UnknownVenueError implements Error {
  message: string;
  name: string;

  constructor(venueId: number) {
    this.name = "UnknownVenueError";
    this.message = `Venue with ID "${venueId} cannot be found."`;
  }
}
