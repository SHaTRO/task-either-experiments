
import * as main from '.';

describe('Initial tests', () => {
  it('NAME', () => {
    expect(main.appName()).toEqual('task-either-experiments');
  });
  it('DESCRIPTION', () => {
    expect(main.appDescription()).toEqual('fp-ts/TaskEither Exhibits');
  });
  it('VERSION', () => {
    expect(main.appVersion()).toEqual('1.0.0');
  });
});
