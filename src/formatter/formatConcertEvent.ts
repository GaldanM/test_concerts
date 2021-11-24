import venuesRaw from "../../data/venues.json";
import bandsRaw from "../../data/bands.json";

const bands = bandsRaw as Band[];
const venues = venuesRaw as Venue[];

function formatConcertEvent(concert: Concert): ConcertEvent {
  const matchingBand = bands.find((band) => band.id === concert.bandId);
  if (!matchingBand) {
    throw new UnknownBandError(concert.bandId);
  }

  const matchingVenue = venues.find((venue) => venue.id === concert.venueId);
  if (!matchingVenue) {
    throw new UnknownVenueError(concert.venueId);
  }

  return {
    band: matchingBand.name,
    location: matchingVenue.name,
    date: concert.date,
    latitude: matchingVenue.latitude,
    longitude: matchingVenue.longitude,
  };
}

export default formatConcertEvent;
