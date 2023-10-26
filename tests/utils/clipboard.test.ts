import { clipboardCopy } from '@/utils/clipboard';

describe('clipboardCopy', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('copies text to clipboard if supported', async () => {
    const originalClipboard = navigator.clipboard;
    const mockedWriteText = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).clipboard = {
      writeText: mockedWriteText,
    };

    mockedWriteText.mockResolvedValue('Resolved value');

    const text = 'Hello, world!';
    clipboardCopy(text);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).clipboard = originalClipboard;
  });

  it('shows a prompt if clipboard API is not supported', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(window, 'prompt').mockImplementation(() => null);

    clipboardCopy('Hello, world!');

    expect(window.prompt).toHaveBeenCalledWith(
      'Press Ctrl/Cmd+C to copy the text:',
      'Hello, world!'
    );
  });
});
