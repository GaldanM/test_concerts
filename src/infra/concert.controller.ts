import type { Request, Response } from "express";

import formatConcertEvent from "../formatter/formatConcertEvent";

import SearchConcerts from "../usecase/SearchConcerts";

import RepositoryInMemory from "../repository/RepositoryInMemory";

import type { ParsedQs } from "qs";
import type { SearchAroundGeopointOptions, SearchByBandOptions } from "../usecase/SearchConcerts";

const repositoryInMemory = new RepositoryInMemory();

async function concertController(req: Request, res: Response): Promise<void> {
  const searchByBand = Object.prototype.hasOwnProperty.call(req.query, "bandIds");
  const searchAroundGeopoint = ["latitude", "longitude", "radius"].every((param) =>
    Object.prototype.hasOwnProperty.call(req.query, param)
  );

  if (!searchByBand && !searchAroundGeopoint) {
    res.status(409);
    res.send("You must at least provide `bandIds` OR `latitude`/`longitude`/`radius`");
    return;
  }

  const searchOptions: {
    byBand: SearchByBandOptions | null;
    aroundGeopoint: SearchAroundGeopointOptions | null;
  } = {
    byBand: null,
    aroundGeopoint: null,
  };

  if (searchByBand) {
    if (typeof req.query.bandIds === "string") {
      searchOptions.byBand = { bandIds: req.query.bandIds.split(",").map((bandId: string) => parseInt(bandId, 10)) };
    } else if (Array.isArray(req.query.bandIds)) {
      searchOptions.byBand = {
        bandIds: req.query.bandIds.map((bandId: ParsedQs | string) => parseInt(bandId as string, 10)),
      };
    }
  }

  if (searchAroundGeopoint) {
    searchOptions.aroundGeopoint = {
      latitude: parseFloat(req.query.latitude as string),
      longitude: parseFloat(req.query.longitude as string),
      radius: parseInt(req.query.radius as string, 10),
    };
  }

  const useCase = new SearchConcerts(repositoryInMemory);
  const concerts = await useCase.execute(searchOptions.byBand, searchOptions.aroundGeopoint);

  res.json(concerts.map(formatConcertEvent));
}

export default concertController;
