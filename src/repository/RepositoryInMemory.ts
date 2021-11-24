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

    const concertsFilteredByVenues = this.concerts.filter((concert) =>
      venuesWithinRadius.some((venue) => venue.id === concert.venueId)
    );

    const sortedConcerts = sortConcertsByDateDescending(concertsFilteredByVenues);

    return Promise.resolve(sortedConcerts);
  }

  async getConcertsByBands(bandIds: number[]): Promise<Concert[]> {
    const concertsFilteredByBands = this.concerts.filter((concert) =>
      bandIds.some((bandId) => concert.bandId === bandId)
    );

    const sortedConcerts = sortConcertsByDateDescending(concertsFilteredByBands);

    return Promise.resolve(sortedConcerts);
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

    const concertsFilteredByVenues = concertsFilteredByBands.filter((concert) =>
      venuesWithinRadius.some((venue) => venue.id === concert.venueId)
    );

    const sortedConcerts = sortConcertsByDateDescending(concertsFilteredByVenues);

    return Promise.resolve(sortedConcerts);
  }
}

function sortConcertsByDateDescending(concerts: Concert[]): Concert[] {
  return concerts.sort((concertA, concertB) => concertB.date - concertA.date);
}

export default RepositoryInMemory;
