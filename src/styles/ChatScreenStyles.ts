import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  titleContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    marginVertical: 8,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFF',
  },
  botMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#CCC',
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#FFF',
    maxHeight: 120,
  },
  loader: {
    marginVertical: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
