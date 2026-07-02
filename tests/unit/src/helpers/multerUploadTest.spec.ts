import { expect } from "chai";
import { isAllowedEvidenceMimeType } from "#src/helpers/multerUpload.js";

describe("multerUpload", () => {
  it("allows PDF files", () => {
    expect(isAllowedEvidenceMimeType("application/pdf")).to.equal(true);
  });

  it("allows TIFF files", () => {
    expect(isAllowedEvidenceMimeType("image/tiff")).to.equal(true);
  });

  it("allows RTF files", () => {
    expect(isAllowedEvidenceMimeType("application/rtf")).to.equal(true);
    expect(isAllowedEvidenceMimeType("text/rtf")).to.equal(true);
  });

  it("rejects unsupported files", () => {
    expect(isAllowedEvidenceMimeType("image/png")).to.equal(false);
    expect(isAllowedEvidenceMimeType("application/vnd.openxmlformats-officedocument.wordprocessingml.document")).to.equal(false);
  });
});