export const formatBotResponse = (rawText: string): { text: string; isMarkdown: boolean } => {
  if (!rawText) return { text: '', isMarkdown: false };

  const formattedText = rawText
    .replace(/"output":"/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .trim();

  const isMarkdown = /(\*\*|__|`|#|\- )/.test(formattedText);
  return { text: formattedText, isMarkdown };
};