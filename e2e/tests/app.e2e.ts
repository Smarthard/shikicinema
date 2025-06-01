/* eslint-disable no-restricted-imports */

import { getBrowserState, setupBrowserHooks } from './utils';

describe('App test', () => {
    setupBrowserHooks();
    it('is running', async () => {
        const { page } = getBrowserState();
        const element = await page.locator('ion-app').wait();

        expect(element).not.toBeNull();
    });
});
