import { getDistance } from "geolib";

import WrongParametersError from "../errors/WrongParametersError";
import WrongGeopointParametersError from "../errors/WrongGeopointParametersError";

import concertsRaw from "../../data/concerts.json";
import venuesRaw from "../../data/venues.json";

const concerts = concertsRaw as Concert[];
const venues = venuesRaw as Venue[];

interface SearchByBandOptions {
  bandIds: number[];
}

interface SearchAroundGeopointOptions {
  latitude: number;
  longitude: number;
  radius: number;
}

function searchConcerts(
  searchByBandOptions: SearchByBandOptions | null,
  searchAroundGeopointOptions: SearchAroundGeopointOptions | null
): Concert[] {
  if (!searchByBandOptions && !searchAroundGeopointOptions) {
    throw new WrongParametersError();
  }

  let matchingConcerts: Concert[] = concerts;

  if (searchByBandOptions) {
    matchingConcerts = concerts.filter((concert) =>
      searchByBandOptions.bandIds.some((bandId) => concert.bandId === bandId)
    );
  }

  if (searchAroundGeopointOptions) {
    checkGeoPointOptions(searchAroundGeopointOptions);
    return filterConcertsAroundGeopoint(matchingConcerts, searchAroundGeopointOptions);
  }

  return matchingConcerts;
}

function checkGeoPointOptions(options: SearchAroundGeopointOptions): void {
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

function filterConcertsAroundGeopoint(concertsToFilter: Concert[], geopoint: SearchAroundGeopointOptions): Concert[] {
  const venuesWithinRadius = venues.filter((venue) => {
    const distance = getDistance(
      { latitude: geopoint.latitude, longitude: geopoint.longitude },
      { latitude: venue.latitude, longitude: venue.longitude }
    );
    return distance < geopoint.radius * 1000;
  });

  return concertsToFilter.filter((concert) => venuesWithinRadius.some((venue) => venue.id === concert.venueId));
}

export default searchConcerts;
