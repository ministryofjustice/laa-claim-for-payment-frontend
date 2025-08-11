import sinon from "sinon";
import { expect } from "chai";
import { submissionsService } from "#src/services/submissionsService.js";
import { AxiosInstance } from "#node_modules/axios/index.js";
import config from "#config.js";

describe("configureAxios:", () => {
  let baseUrlStub: string;
  let axiosGetStub: sinon.SinonStub;
  let axiosInstanceStub: AxiosInstance;
  let axiosMiddlewareStub: {
    axiosInstance: AxiosInstance;
    use?: sinon.SinonStub;
  };
  let configStub: sinon.SinonStub;

  beforeEach(() => {
    // Reset the stubs before each test
    baseUrlStub = "fake.api";

    configStub = sinon.stub(config, "api").value({
      baseUrl: baseUrlStub,
    });

    axiosGetStub = sinon.stub().resolves({ data: [] });

    axiosInstanceStub = {
      defaults: {
        baseURL: "",
        headers: {
          common: {} as Record<string, string>,
        },
        get: axiosGetStub,
      },
    } as unknown as AxiosInstance;

    axiosMiddlewareStub = {
      axiosInstance: axiosInstanceStub,
      use: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should configure axios instance in flow", async () => {
    // Act - call the submissions service with stubbed config
    await submissionsService.getSubmissions(axiosMiddlewareStub as any);

    // Assert - the config stub has been inserted into the axios instance
    expect(axiosInstanceStub.defaults.headers.common["Content-Type"]).to.equal("application/json");
    expect(axiosInstanceStub.defaults.baseURL).to.equal(baseUrlStub);
  });

  // NOTE - the below test is FYI. The above method is 'better' but the below is a 'hacky' method which is good for reference hence inclusion.
  it("should configure axios instance direct call", () => {
    // Act - call the configure axios method directly
    // JS override of the private modifier to allow
    const result = (submissionsService as any)["configureAxiosInstance"](axiosMiddlewareStub);

    // Assert - the axios instance is configured as expected
    expect(result.axiosInstance.defaults.baseURL).to.equal("fake.api");
    expect(axiosInstanceStub.defaults.headers.common["Content-Type"]).to.equal("application/json");
  });
});
