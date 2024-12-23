import { AppPage } from '@app-e2e/src/app.po';

describe('new App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should be blank', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toContain('Start with Ionic UI Components');
    });
});
