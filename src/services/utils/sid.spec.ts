import { getSid, initialize } from "./sid";

describe("getSid", () => {
  it("should return sid", () => {
    // arrange

    // act
    initialize();
    const actual = getSid();

    // assert
    expect(actual).toEqual(1);
  });

  it("should return max value and min value", () => {
    // arrange

    // act
    initialize(99999998);
    const actual: number[] = [];
    actual.push(getSid());
    actual.push(getSid());
    actual.push(getSid());
    actual.push(getSid());
    actual.push(getSid());

    // assert
    expect(actual).toEqual([99999998, 99999999, 1, 2, 3]);
  });
});

describe("initialize", () => {
  it("should initialize 0", () => {
    // arrange

    // act
    initialize();
    const actual = getSid();

    // assert
    expect(actual).toEqual(1);
  });

  it("should initialize 100000", () => {
    // arrange

    // act
    initialize(100000);
    const actual = getSid();

    // assert
    expect(actual).toEqual(100000);
  });

  it("should initialize 1 when argument 0", () => {
    // arrange

    // act
    initialize(0);
    const actual = getSid();

    // assert
    expect(actual).toEqual(1);
  });
});
