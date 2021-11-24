import { getDistance } from "geolib";

import bandsRaw from "../../data/bands.json";
import concertsRaw from "../../data/concerts.json";
import venuesRaw from "../../data/venues.json";

class RepositoryInMemory implements Repository {
  bands: Band[];
  concerts: Concert[];
  venues: Venue[];

  constructor() {
    this.bands = bandsRaw as Band[];
    this.concerts = concertsRaw as Concert[];
    this.venues = venuesRaw as Venue[];
  }

  async getConcertsAroundGeopoint(geopoint: GeoPoint): Promise<Concert[]> {
    const venuesWithinRadius = this.venues.filter((venue) => {
      const distance = getDistance(
        { latitude: geopoint.latitude, longitude: geopoint.longitude },
        { latitude: venue.latitude, longitude: venue.longitude }
      );
      return distance < geopoint.radius * 1000;
    });

    return Promise.resolve(
      this.concerts.filter((concert) => venuesWithinRadius.some((venue) => venue.id === concert.venueId))
    );
  }

  async getConcertsByBands(bandIds: number[]): Promise<Concert[]> {
    return Promise.resolve(this.concerts.filter((concert) => bandIds.some((bandId) => concert.bandId === bandId)));
  }

  async getConcertsByBandsAndAroundGeopoint(bandIds: number[], geopoint: GeoPoint): Promise<Concert[]> {
    const venuesWithinRadius = this.venues.filter((venue) => {
      const distance = getDistance(
        { latitude: geopoint.latitude, longitude: geopoint.longitude },
        { latitude: venue.latitude, longitude: venue.longitude }
      );
      return distance < geopoint.radius * 1000;
    });
    const concertsFilteredByBands = this.concerts.filter((concert) =>
      bandIds.some((bandId) => concert.bandId === bandId)
    );

    return Promise.resolve(
      concertsFilteredByBands.filter((concert) => venuesWithinRadius.some((venue) => venue.id === concert.venueId))
    );
  }
}

export default RepositoryInMemory;
