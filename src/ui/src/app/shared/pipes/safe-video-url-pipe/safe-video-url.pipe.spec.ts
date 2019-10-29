import { SafeVideoUrlPipe } from './safe-video-url.pipe';

describe('SafeVideoUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeVideoUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
