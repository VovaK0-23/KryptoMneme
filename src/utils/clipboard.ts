export const clipboardCopy = (text: string) => {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy text:', error);
        showCopyPrompt(text);
      });
  } else {
    showCopyPrompt(text);
  }
};

const showCopyPrompt = (text: string) => {
  prompt('Press Ctrl/Cmd+C to copy the text:', text);
};
