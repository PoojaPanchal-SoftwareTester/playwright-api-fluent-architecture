import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import{config} from '../api-Test.config'

export type ApiFixtures = {
  api: RequestHandler;
  config: typeof config
};
export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
   
    const logger = new APILogger();
    const requestHandler = new RequestHandler(request, config.baseURL, logger);
    await use(requestHandler);
  },
  config: async({}, use) =>{
  await use(config)
}
});


