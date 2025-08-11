import sinon from 'sinon';
import { expect } from 'chai';;
import { submissionsService } from '#src/services/submissionsService.js';
import { AxiosInstance } from '#node_modules/axios/index.js';
import config from '#config.js';

describe("submissionsService:", () => {
    let axiosInstanceStub: AxiosInstance;
    let axiosMiddlewareStub: {axiosInstance: AxiosInstance; use?: sinon.SinonStub};
    let originalBaseUrl: string;    

    beforeEach(() => {
        
    // Reset the stub before each test
    axiosInstanceStub = {
        defaults: {
            baseURL: '',
            headers: {
                common: {} as Record<string, string>,
            },
        },
    } as unknown as AxiosInstance;

    axiosMiddlewareStub = {
        axiosInstance: axiosInstanceStub,
        use: sinon.stub(),
    };

    originalBaseUrl = config.api.baseUrl;
    config.api.baseUrl = "FAKE"
    });

    afterEach(() => { 
    // Restore the stubs after each test
    config.api.baseUrl = originalBaseUrl;
    sinon.restore();
    });

    it("should configure axios instance", () => {
        const result = (submissionsService as any)['configureAxiosInstance'](axiosMiddlewareStub);
        expect(result.axiosInstance.defaults.baseURL).to.equal("FAKE");
  })
})
