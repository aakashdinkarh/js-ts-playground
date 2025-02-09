import { copyToClipboard } from '@utils/clipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    (navigator.clipboard.writeText as jest.Mock).mockClear();
  });

  it('should copy string value to clipboard', async () => {
    const testString = 'Hello, World!';
    await copyToClipboard(testString);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testString);
  });

  it('should copy number value as string to clipboard', async () => {
    const testNumber = 42;
    await copyToClipboard(testNumber);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('42');
  });

  it('should copy boolean value as string to clipboard', async () => {
    const testBoolean = true;
    await copyToClipboard(testBoolean);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('true');
  });

  it('should copy object as formatted JSON string to clipboard', async () => {
    const testObject = { name: 'John', age: 30 };
    const expectedJSON = JSON.stringify(testObject, null, 2);
    await copyToClipboard(testObject);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedJSON);
  });

  it('should copy array as formatted JSON string to clipboard', async () => {
    const testArray = [1, 2, 3];
    const expectedJSON = JSON.stringify(testArray, null, 2);
    await copyToClipboard(testArray);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedJSON);
  });

  it('should handle null value', async () => {
    await copyToClipboard(null);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('null');
  });

  it('should handle undefined value', async () => {
    await copyToClipboard(undefined);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('undefined');
  });
}); 
