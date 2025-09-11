/**
 * @description Tests for the pagination view model
 */

import { expect } from "chai";
import { Pagination } from "#src/viewmodels/components/pagination.js";

describe("constructor()", () => {
  const href = "/foo";

  it("creates a pagination model when no results", () => {
    const viewModel = new Pagination(0, 20, 1, href);

    expect(viewModel.items).to.have.length(0);

    expect(viewModel.results.count).to.equal(0);
    expect(viewModel.results.from).to.equal(0);
    expect(viewModel.results.to).to.equal(0);
    expect(viewModel.results.text).to.equal("results");

    expect(viewModel.previous).to.equal(undefined);

    expect(viewModel.next).to.equal(undefined);
  });

  it("creates a pagination model when one result", () => {
    const viewModel = new Pagination(1, 20, 1, href);

    expect(viewModel.items).to.have.length(0);

    expect(viewModel.results.count).to.equal(1);
    expect(viewModel.results.from).to.equal(1);
    expect(viewModel.results.to).to.equal(1);
    expect(viewModel.results.text).to.equal("result");

    expect(viewModel.previous).to.equal(undefined);

    expect(viewModel.next).to.equal(undefined);
  });

  it("creates a pagination model when list fits on one page", () => {
    const viewModel = new Pagination(20, 20, 1, href);

    expect(viewModel.items).to.have.length(0);

    expect(viewModel.results.count).to.equal(20);
    expect(viewModel.results.from).to.equal(1);
    expect(viewModel.results.to).to.equal(20);
    expect(viewModel.results.text).to.equal("results");

    expect(viewModel.previous).to.equal(undefined);

    expect(viewModel.next).to.equal(undefined);
  });

  it("creates a pagination model when list fits on two pages and on first page", () => {
    const viewModel = new Pagination(21, 20, 1, href);

    expect(viewModel.items).to.have.length(2);

    expect(viewModel.items[0].text).to.equal("1");
    expect(viewModel.items[0].href).to.equal("/foo?page=1");
    expect(viewModel.items[0].selected).to.equal(true);
    expect(viewModel.items[0].type).to.equal(undefined);

    expect(viewModel.items[1].text).to.equal("2");
    expect(viewModel.items[1].href).to.equal("/foo?page=2");
    expect(viewModel.items[1].selected).to.equal(false);
    expect(viewModel.items[1].type).to.equal(undefined);

    expect(viewModel.results.count).to.equal(21);
    expect(viewModel.results.from).to.equal(1);
    expect(viewModel.results.to).to.equal(20);
    expect(viewModel.results.text).to.equal("results");

    expect(viewModel.previous).to.equal(undefined);

    expect(viewModel.next?.text).to.equal("Next");
    expect(viewModel.next?.href).to.equal("/foo?page=2");
  });

  it("creates a pagination model when list fits on two pages and on second page", () => {
    const viewModel = new Pagination(21, 20, 2, href);

    expect(viewModel.items).to.have.length(2);

    expect(viewModel.items[0].text).to.equal("1");
    expect(viewModel.items[0].href).to.equal("/foo?page=1");
    expect(viewModel.items[0].selected).to.equal(false);
    expect(viewModel.items[0].type).to.equal(undefined);

    expect(viewModel.items[1].text).to.equal("2");
    expect(viewModel.items[1].href).to.equal("/foo?page=2");
    expect(viewModel.items[1].selected).to.equal(true);
    expect(viewModel.items[1].type).to.equal(undefined);

    expect(viewModel.results.count).to.equal(21);
    expect(viewModel.results.from).to.equal(21);
    expect(viewModel.results.to).to.equal(21);
    expect(viewModel.results.text).to.equal("results");

    expect(viewModel.previous?.text).to.equal("Previous");
    expect(viewModel.previous?.href).to.equal("/foo?page=1");

    expect(viewModel.next).to.equal(undefined);
  });

  it("creates a pagination model when list fits on 5 pages and on second page", () => {
    const viewModel = new Pagination(95, 20, 2, href);

    expect(viewModel.items).to.have.length(5);

    expect(viewModel.items[0].text).to.equal("1");
    expect(viewModel.items[0].href).to.equal("/foo?page=1");
    expect(viewModel.items[0].selected).to.equal(false);
    expect(viewModel.items[0].type).to.equal(undefined);

    expect(viewModel.items[1].text).to.equal("2");
    expect(viewModel.items[1].href).to.equal("/foo?page=2");
    expect(viewModel.items[1].selected).to.equal(true);
    expect(viewModel.items[1].type).to.equal(undefined);

    expect(viewModel.items[2].text).to.equal("3");
    expect(viewModel.items[2].href).to.equal("/foo?page=3");
    expect(viewModel.items[2].selected).to.equal(false);
    expect(viewModel.items[2].type).to.equal(undefined);

    expect(viewModel.items[3].text).to.equal(undefined);
    expect(viewModel.items[3].href).to.equal(undefined);
    expect(viewModel.items[3].selected).to.equal(undefined);
    expect(viewModel.items[3].type).to.equal("dots");

    expect(viewModel.items[4].text).to.equal("5");
    expect(viewModel.items[4].href).to.equal("/foo?page=5");
    expect(viewModel.items[4].selected).to.equal(false);
    expect(viewModel.items[4].type).to.equal(undefined);

    expect(viewModel.results.count).to.equal(95);
    expect(viewModel.results.from).to.equal(21);
    expect(viewModel.results.to).to.equal(40);
    expect(viewModel.results.text).to.equal("results");

    expect(viewModel.previous?.text).to.equal("Previous");
    expect(viewModel.previous?.href).to.equal("/foo?page=1");

    expect(viewModel.next?.text).to.equal("Next");
    expect(viewModel.next?.href).to.equal("/foo?page=3");
  });

  it("creates a pagination model when list fits on 9 pages and on fifth page", () => {
    const viewModel = new Pagination(180, 20, 5, href);

    expect(viewModel.items).to.have.length(7);

    expect(viewModel.items[0].text).to.equal("1");
    expect(viewModel.items[0].href).to.equal("/foo?page=1");
    expect(viewModel.items[0].selected).to.equal(false);
    expect(viewModel.items[0].type).to.equal(undefined);

    expect(viewModel.items[1].text).to.equal(undefined);
    expect(viewModel.items[1].href).to.equal(undefined);
    expect(viewModel.items[1].selected).to.equal(undefined);
    expect(viewModel.items[1].type).to.equal("dots");

    expect(viewModel.items[2].text).to.equal("4");
    expect(viewModel.items[2].href).to.equal("/foo?page=4");
    expect(viewModel.items[2].selected).to.equal(false);
    expect(viewModel.items[2].type).to.equal(undefined);

    expect(viewModel.items[3].text).to.equal("5");
    expect(viewModel.items[3].href).to.equal("/foo?page=5");
    expect(viewModel.items[3].selected).to.equal(true);
    expect(viewModel.items[3].type).to.equal(undefined);

    expect(viewModel.items[4].text).to.equal("6");
    expect(viewModel.items[4].href).to.equal("/foo?page=6");
    expect(viewModel.items[4].selected).to.equal(false);
    expect(viewModel.items[4].type).to.equal(undefined);

    expect(viewModel.items[5].text).to.equal(undefined);
    expect(viewModel.items[5].href).to.equal(undefined);
    expect(viewModel.items[5].selected).to.equal(undefined);
    expect(viewModel.items[5].type).to.equal("dots");

    expect(viewModel.items[6].text).to.equal("9");
    expect(viewModel.items[6].href).to.equal("/foo?page=9");
    expect(viewModel.items[6].selected).to.equal(false);
    expect(viewModel.items[6].type).to.equal(undefined);

    expect(viewModel.results.count).to.equal(180);
    expect(viewModel.results.from).to.equal(81);
    expect(viewModel.results.to).to.equal(100);
    expect(viewModel.results.text).to.equal("results");

    expect(viewModel.previous?.text).to.equal("Previous");
    expect(viewModel.previous?.href).to.equal("/foo?page=4");

    expect(viewModel.next?.text).to.equal("Next");
    expect(viewModel.next?.href).to.equal("/foo?page=6");
  });

  it("creates a pagination model when current page exceeds total number of pages", () => {
    const viewModel = new Pagination(56, 20, 4, href);

    expect(viewModel.items).to.have.length(3);

    expect(viewModel.items[0].text).to.equal("1");
    expect(viewModel.items[0].href).to.equal("/foo?page=1");
    expect(viewModel.items[0].selected).to.equal(false);
    expect(viewModel.items[0].type).to.equal(undefined);

    expect(viewModel.items[1].text).to.equal("2");
    expect(viewModel.items[1].href).to.equal("/foo?page=2");
    expect(viewModel.items[1].selected).to.equal(false);
    expect(viewModel.items[1].type).to.equal(undefined);

    expect(viewModel.items[2].text).to.equal("3");
    expect(viewModel.items[2].href).to.equal("/foo?page=3");
    expect(viewModel.items[2].selected).to.equal(true);
    expect(viewModel.items[2].type).to.equal(undefined);
  });
});
