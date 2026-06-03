import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { APILogger } from './logger';

export class RequestHandler {

    private request: APIRequestContext;
    private baseUrl: String = "";
    private defaultBaseUrl: String = "";
    private apiPath: String = "";
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {}
    private logger: APILogger;

    constructor(request: APIRequestContext, baseUrl: String, logger: APILogger) {
        this.request = request;
        this.defaultBaseUrl = baseUrl;
        this.logger = logger;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }
    path(path: string) {
        this.apiPath = path;
        return this;
    }
    params(params: object) {
        this.queryParams = params;
        return this;
    }
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }
    body(body: object) {
        this.apiBody = body;
        return this;
    }
    async getRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('GET', url, this.apiHeaders);
        const response = await this.request.get(url, {
            headers: this.apiHeaders

        });
        this.reset();
        const actualStatus = response.status();
        const responseBody = await response.json();
        this.logger.logResponse(actualStatus, responseBody);
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest);


        return responseBody;

    }

    async postRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        this.reset();
        const actualStatus = response.status();
        const responseBody = await response.json();
        this.logger.logResponse(actualStatus, responseBody);
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest);

        return responseBody;
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody);
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        this.reset();
        const actualStatus = response.status();

        const responseBody = await response.json();

        this.logger.logResponse(actualStatus, responseBody);
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest);

        return responseBody;

    }
    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('DELETE', url, this.apiHeaders);
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });
        this.reset();
        const actualStatus = response.status();
        this.logger.logResponse(actualStatus, null);
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest);


    }
    private getUrl() {
        // console.log(`Base URL: ${this.defaultBaseUrl}, API Path: ${this.apiPath}, Query Params: ${JSON.stringify(this.queryParams)}`);
        const url = new URL(`${this.defaultBaseUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, String(value));
        }
        // console.log(url.toString());
        return url.toString();
    }

    //custom error handling to include recent logs for easier debugging
    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code ${expectedStatus} but got ${actualStatus}\nRecent Logs:\n${logs}`);
            (Error as any).captureStackTrace(error, callingMethod);

            throw error;
        }
    }

    // Reset method to clear all request data after each request
    private reset() {
        this.baseUrl = "";
        this.apiPath = "";
        this.queryParams = {};
        this.apiHeaders = {};
        this.apiBody = {};
    }


}