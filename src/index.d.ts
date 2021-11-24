interface Band {
  id: number;
  name: string;
}

interface Concert {
  bandId: number;
  venueId: number;
  date: number;
}

interface Venue {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface ConcertEvent {
  band: string;
  location: string;
  date: number;
  latitude: number;
  longitude: number;
}
