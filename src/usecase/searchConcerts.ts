import concertsRaw from "../../data/concerts.json";

const concerts = concertsRaw as Concert[];

function searchConcerts(bandIds: number[]): Concert[] {
  return concerts.filter((concert) => bandIds.some((bandId) => concert.bandId === bandId));
}

export default searchConcerts;
