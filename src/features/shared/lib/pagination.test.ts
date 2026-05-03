import { describe, expect, it } from "vitest";

import { getVisiblePages } from "./pagination";

describe("getVisiblePages", () => {
  it("shows all pages when total pages are five or less", () => {
    expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows ellipsis when there are many pages", () => {
    expect(getVisiblePages(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
  });

  it("does not show invalid page numbers near the start", () => {
    expect(getVisiblePages(1, 10)).toEqual([1, 2, "ellipsis", 10]);
  });
});
