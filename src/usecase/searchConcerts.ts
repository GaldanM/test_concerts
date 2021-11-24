import { getDistance } from "geolib";

import concertsRaw from "../../data/concerts.json";
import venuesRaw from "../../data/venues.json";
import WrongParametersError from "../errors/WrongParametersError";
import WrongGeopointParametersError from "../errors/WrongGeopointParametersError";

const concerts = concertsRaw as Concert[];
const venues = venuesRaw as Venue[];

interface SearchConcertOptions {
  bandIds?: number[];
  latitude?: number;
  longitude?: number;
  radius?: number;
}

function searchConcerts(options: SearchConcertOptions): Concert[] {
  checkOptions(options);

  if (
    typeof options.latitude !== "undefined" &&
    typeof options.longitude !== "undefined" &&
    typeof options.radius !== "undefined"
  ) {
    return searchConcertsAroundGeopoint(options.latitude, options.longitude, options.radius);
  }

  if (typeof options.bandIds !== "undefined") {
    return concerts.filter((concert) => options.bandIds?.some((bandId) => concert.bandId === bandId));
  }

  return [];
}

function checkOptions(options: SearchConcertOptions): void {
  const countGeopointOptions = ["latitude", "longitude", "radius"].reduce((count, param) => {
    if (Object.prototype.hasOwnProperty.call(options, param)) {
      return count + 1;
    }
    return count;
  }, 0);

  if (countGeopointOptions === 3) {
    checkGeoPointOptions(options);
  } else if (countGeopointOptions > 0) {
    throw new WrongParametersError();
  }

  const bandIdsParamExists = Object.prototype.hasOwnProperty.call(options, "bandIds");
  if (!bandIdsParamExists && countGeopointOptions === 0) {
    throw new WrongParametersError();
  }
}

function checkGeoPointOptions(options: SearchConcertOptions): void {
  if (options.latitude && (options.latitude < -90 || options.latitude > 90)) {
    throw new WrongGeopointParametersError("Latitude range is [-90, 90]");
  }

  if (options.longitude && (options.longitude < -180 || options.longitude > 180)) {
    throw new WrongGeopointParametersError("Longitude range is [-180, 180]");
  }

  if (options.radius && options.radius < 0) {
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
