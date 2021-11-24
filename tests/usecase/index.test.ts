import RepositoryInMemory from "../../src/repository/RepositoryInMemory";
import SearchConcerts from "../../src/usecase/SearchConcerts";

import WrongParametersError from "../../src/errors/WrongParametersError";
import WrongGeopointParametersError from "../../src/errors/WrongGeopointParametersError";

describe("search concerts", () => {
  it.each([
    [[1], 5],
    [[2], 21],
    [[1, 2], 26],
    [[0], 0],
  ])("should find concerts with specific bands", async (bandIds, expected) => {
    const useCase = new SearchConcerts(new RepositoryInMemory());
    const concerts = await useCase.execute({ bandIds }, null);

    expect(concerts).toHaveLength(expected);
  });
  it.each([
    [{ latitude: 43.63967479999999, longitude: -79.3535794, radius: 1 }, 58],
    [{ latitude: 43.63967479999999, longitude: -79.3535794, radius: 2 }, 150],
    [{ latitude: 43.63967479999999, longitude: -79.3535794, radius: 0 }, 0],
    [{ latitude: 0, longitude: 0, radius: 1 }, 0],
  ])("should find concerts around a geopoint", async (aroundOptions, expected) => {
    const useCase = new SearchConcerts(new RepositoryInMemory());
    const concerts = await useCase.execute(null, aroundOptions);

    expect(concerts).toHaveLength(expected);
  });
  it("should send an error when missing parameters", async () => {
    const useCase = new SearchConcerts(new RepositoryInMemory());

    await expect(useCase.execute(null, null)).rejects.toBeInstanceOf(WrongParametersError);
  });
  it.each([
    { latitude: 100, longitude: 0, radius: 1 },
    { latitude: 0, longitude: 200, radius: 1 },
    { latitude: 0, longitude: 0, radius: -1 },
  ])("should send an error on wrong parameters", async (aroundOptions) => {
    const useCase = new SearchConcerts(new RepositoryInMemory());

    await expect(useCase.execute(null, aroundOptions)).rejects.toBeInstanceOf(WrongGeopointParametersError);
  });
  it("should find concerts with specific bands AND around a geopoint", async () => {
    const useCase = new SearchConcerts(new RepositoryInMemory());
    const concerts = await useCase.execute(
      { bandIds: [1, 2] },
      { latitude: 43.63967479999999, longitude: -79.3535794, radius: 1 }
    );

    expect(concerts).toHaveLength(2);
  });
});
