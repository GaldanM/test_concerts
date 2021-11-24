import searchConcerts from "../../src/usecase/searchConcerts";

describe("search concerts", () => {
  it.each([
    [[1], 5],
    [[2], 21],
    [[1, 2], 26],
    [[0], 0],
  ])("should find concerts with specific bands", (bandIds, expected) => {
    const concerts = searchConcerts(bandIds);

    expect(concerts).toHaveLength(expected);
  });
});
