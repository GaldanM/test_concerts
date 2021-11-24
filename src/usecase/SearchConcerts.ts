import WrongParametersError from "../errors/WrongParametersError";
import WrongGeopointParametersError from "../errors/WrongGeopointParametersError";

export interface SearchByBandOptions {
  bandIds: number[];
}
export interface SearchAroundGeopointOptions {
  latitude: number;
  longitude: number;
  radius: number;
}

class SearchConcerts {
  private readonly repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  async execute(
    searchByBandOptions: SearchByBandOptions | null,
    searchAroundGeopointOptions: SearchAroundGeopointOptions | null
  ): Promise<Concert[]> {
    if (!searchByBandOptions && !searchAroundGeopointOptions) {
      throw new WrongParametersError();
    }

    if (searchByBandOptions && searchAroundGeopointOptions) {
      checkGeoPointOptions(searchAroundGeopointOptions);
      return this.repository.getConcertsByBandsAndAroundGeopoint(
        searchByBandOptions.bandIds,
        searchAroundGeopointOptions
      );
    }

    if (searchByBandOptions) {
      return this.repository.getConcertsByBands(searchByBandOptions.bandIds);
    }

    if (searchAroundGeopointOptions) {
      checkGeoPointOptions(searchAroundGeopointOptions);
      return this.repository.getConcertsAroundGeopoint(searchAroundGeopointOptions);
    }

    return [];
  }
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

export default SearchConcerts;
