import type { Request, Response } from "express";

import formatConcertEvent from "../formatter/formatConcertEvent";

import searchConcerts from "../usecase/searchConcerts";

import type { SearchAroundGeopointOptions, SearchByBandOptions } from "../usecase/searchConcerts";

function concertController(req: Request, res: Response): void {
  const searchByBand = Object.prototype.hasOwnProperty.call(req.body, "bandIds");
  const searchAroundGeopoint = ["latitude", "longitude", "radius"].every((param) =>
    Object.prototype.hasOwnProperty.call(req.body, param)
  );

  if (!searchByBand && !searchAroundGeopoint) {
    res.status(409);
    res.send("You must at least provide `bandIds` OR `latitude`/`longitude`/`radius`");
  }

  const searchOptions: { byBand: SearchByBandOptions | null; aroundGeopoint: SearchAroundGeopointOptions | null } = {
    byBand: null,
    aroundGeopoint: null,
  };

  if (searchByBand) {
    searchOptions.byBand = { bandIds: req.body.bandIds };
  }

  if (searchAroundGeopoint) {
    searchOptions.aroundGeopoint = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      radius: req.body.radius,
    };
  }

  const concerts = searchConcerts(searchOptions.byBand, searchOptions.aroundGeopoint);
  res.json(concerts.map(formatConcertEvent));
}

export default concertController;
