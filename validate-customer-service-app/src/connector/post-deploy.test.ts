import { assertError } from '../utils/assert.utils';
import * as postDeploy from './post-deploy';
import * as actions from './actions';

jest.mock('../validators/helpers.validators', () => ({
  getValidateMessages: jest.fn(() => []),
}));

jest.mock('../validators/env.validators', () => []);


jest.mock('../utils/assert.utils', () => ({
  assertError: jest.fn(),
  assertString: jest.fn(),
}));


jest
  .spyOn(actions, 'createType')
  .mockReturnValue(Promise.resolve());

jest
  .spyOn(actions, 'createOrderCreateExtension')
  .mockReturnValue(Promise.resolve());

describe('run functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call postDeploy and handle errors gracefully', async () => {
    const mockError = new Error('Test error');
    const mockErrorMessage = `Post-deploy failed: ${mockError.message}`;

    jest
      .spyOn(actions, 'createType')
      .mockRejectedValueOnce(mockError);

    jest
      .spyOn(actions, 'createOrderCreateExtension')
      .mockRejectedValueOnce(mockError);

    const writeSpy = jest.spyOn(process.stderr, 'write');

    await postDeploy.run();

    expect(assertError).toHaveBeenCalledWith(mockError);
    expect(writeSpy).toHaveBeenCalledWith(mockErrorMessage);
  });

  it('should not throw an error when postDeploy succeeds', async () => {
    const mockError = new Error('Test error');
    jest
      .spyOn(postDeploy, 'run')
      .mockImplementationOnce(() => Promise.resolve());
    const writeSpy = jest.spyOn(process.stderr, 'write');
    await postDeploy.run();
    jest
      .spyOn(actions, 'createType')
      .mockRejectedValueOnce(mockError);

    jest
      .spyOn(actions, 'createOrderCreateExtension')
      .mockRejectedValueOnce(mockError);

    expect(assertError).not.toHaveBeenCalled();
    expect(writeSpy).not.toHaveBeenCalled();
  });
});
