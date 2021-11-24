import { getDistance } from "geolib";

import concertsRaw from "../../data/concerts.json";
import venuesRaw from "../../data/venues.json";
import WrongParametersError from "../errors/WrongParametersError";
import WrongGeopointParametersError from "../errors/WrongGeopointParametersError";

const concerts = concertsRaw as Concert[];
const venues = venuesRaw as Venue[];

interface SearchConcertByBandOptions {
  bandIds: number[];
}

interface SearchConcertAroundGeopointOptions {
  latitude: number;
  longitude: number;
  radius: number;
}

function searchConcerts(
  searchByBandOptions: SearchConcertByBandOptions | null,
  searchAroundGeopointOptions: SearchConcertAroundGeopointOptions | null
): Concert[] {
  if (!searchByBandOptions && !searchAroundGeopointOptions) {
    throw new WrongParametersError();
  }

  if (searchAroundGeopointOptions) {
    checkGeoPointOptions(searchAroundGeopointOptions);
    return searchConcertsAroundGeopoint(
      searchAroundGeopointOptions.latitude,
      searchAroundGeopointOptions.longitude,
      searchAroundGeopointOptions.radius
    );
  }

  if (searchByBandOptions) {
    return concerts.filter((concert) => searchByBandOptions.bandIds.some((bandId) => concert.bandId === bandId));
  }

  return [];
}

function checkGeoPointOptions(options: SearchConcertAroundGeopointOptions): void {
  if (options.latitude < -90 || options.latitude > 90) {
    throw new WrongGeopointParametersError("Latitude range is [-90, 90]");
  }

  if (options.longitude < -180 || options.longitude > 180) {
    throw new WrongGeopointParametersError("Longitude range is [-180, 180]");
  }

  if (options.radius < 0) {
    throw new WrongGeopointParametersError("Radius must be positive");
  }
}

function searchConcertsAroundGeopoint(latitude: number, longitude: number, radius: number): Concert[] {
  const venuesWithingRadius = venues.filter((venue) => {
    const distance = getDistance({ latitude, longitude }, { latitude: venue.latitude, longitude: venue.longitude });
    return distance < radius * 1000;
  });

  return concerts.filter((concert) => venuesWithingRadius.some((venue) => venue.id === concert.venueId));
}

export default searchConcerts;
