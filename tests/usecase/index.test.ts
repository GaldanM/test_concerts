import searchConcerts from "../../src/usecase/searchConcerts";
import WrongParametersError from "../../src/errors/WrongParametersError";
import WrongGeopointParametersError from "../../src/errors/WrongGeopointParametersError";

describe("search concerts", () => {
  it.each([
    [[1], 5],
    [[2], 21],
    [[1, 2], 26],
    [[0], 0],
  ])("should find concerts with specific bands", (bandIds, expected) => {
    const concerts = searchConcerts({ bandIds }, null);

    expect(concerts).toHaveLength(expected);
  });
  it.each([
    [{ latitude: 43.63967479999999, longitude: -79.3535794, radius: 1 }, 58],
    [{ latitude: 43.63967479999999, longitude: -79.3535794, radius: 2 }, 150],
    [{ latitude: 43.63967479999999, longitude: -79.3535794, radius: 0 }, 0],
    [{ latitude: 0, longitude: 0, radius: 1 }, 0],
  ])("should find concerts around a geopoint", (aroundOptions, expected) => {
    const concerts = searchConcerts(null, aroundOptions);

    expect(concerts).toHaveLength(expected);
  });
  it("should send an error when missing parameters", () => {
    expect(() => searchConcerts(null, null)).toThrow(WrongParametersError);
  });
  it.each([
    { latitude: 100, longitude: 0, radius: 1 },
    { latitude: 0, longitude: 200, radius: 1 },
    { latitude: 0, longitude: 0, radius: -1 },
  ])("should send an error on wrong parameters", (aroundOptions) => {
    expect(() => searchConcerts(null, aroundOptions)).toThrow(WrongGeopointParametersError);
  });
});
