interface Repository {
  getConcertsByBandsAndAroundGeopoint: (bandIds: number[], geopoint: GeoPoint) => Promise<Concert[]>;
  getConcertsByBands: (bandIds: number[]) => Promise<Concert[]>;
  getConcertsAroundGeopoint: (geopoint: GeoPoint) => Promise<Concert[]>;
}
