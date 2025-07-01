import { TextStyle, ViewStyle } from 'react-native';

export type AppMarkdownStyles = {
  body: TextStyle;
  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;
  paragraph: TextStyle;
  link: TextStyle;
  list_item: ViewStyle;
  bullet_list: ViewStyle;
  ordered_list: ViewStyle;
  code_inline: TextStyle;
  code_block: ViewStyle & TextStyle;
  blockquote: ViewStyle & TextStyle;
};

export const markdownStyles: AppMarkdownStyles = {
  body: {
    color: '#000',
    fontSize: 16,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#000',
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
    color: '#000',
  },
  paragraph: {
    marginVertical: 4,
    color: '#000',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  list_item: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  bullet_list: {
    marginVertical: 4,
    paddingLeft: 20,
  },
  ordered_list: {
    marginVertical: 4,
    paddingLeft: 20,
  },
  code_inline: {
    backgroundColor: '#f5f5f5',
    fontFamily: 'Courier',
    padding: 2,
    borderRadius: 3,
  },
  code_block: {
    backgroundColor: '#f5f5f5',
    fontFamily: 'Courier',
    padding: 10,
    borderRadius: 5,
    marginVertical: 6,
  },
  blockquote: {
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
    paddingLeft: 10,
    marginVertical: 6,
  },
};
