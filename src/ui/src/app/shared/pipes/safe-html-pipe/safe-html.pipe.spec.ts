import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlAndStylePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
