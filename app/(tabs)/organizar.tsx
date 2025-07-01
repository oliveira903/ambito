import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  isMarkdown?: boolean;
}

type AppMarkdownStyles = {
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

const markdownStyles: AppMarkdownStyles = {
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

const formatBotResponse = (rawText: string): { text: string; isMarkdown: boolean } => {
  if (!rawText) return { text: '', isMarkdown: false };

  const formattedText = rawText
    .replace(/"output":"/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/--/g, '\n---\n')
    .replace(/😊️/g, '😊')
    .replace(/💬️/g, '💬')
    .replace(/\*\*:\*/g, '**')
    .replace(/\$([^\s*]+)\*/g, '**$1**')
    .trim();

  const isMarkdown = /(#{1,6}|- \[[x ]?\]|\*\*|__|\*|_|\[.*\]\(.*\)|`{1,3}|---)/.test(formattedText);

  return { text: formattedText, isMarkdown };
};

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      const lastChar = text.slice(-1);
      const newText = /[.!?]/.test(lastChar) 
        ? text + ' ' 
        : text;
      setInputMessage(newText);
    } else {
      setInputMessage(text);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      text: inputMessage,
      sender: 'user',
      isMarkdown: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://n8n.4have.com.br/webhook/4012d657-de37-4800-8dab-4f09f786112a/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
            format: 'markdown',
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const rawResponse = data?.reply || data?.message || data?.response || JSON.stringify(data);
      const { text: formattedText, isMarkdown } = formatBotResponse(rawResponse);

      setMessages((prev) => [
        ...prev,
        {
          text: formattedText || 'Resposta recebida sem conteúdo',
          sender: 'bot',
          isMarkdown,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: error instanceof Error ? error.message : 'Erro desconhecido',
          sender: 'bot',
          isMarkdown: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <ThemedView
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      {item.isMarkdown ? (
        <Markdown style={markdownStyles}>{item.text}</Markdown>
      ) : (
        <ThemedText
          style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}
        >
          {item.text}
        </ThemedText>
      )}
    </ThemedView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Chat Inteligente</ThemedText>
          <ThemedText type="subtitle">Converse com nosso assistente</ThemedText>
        </ThemedView>
      </ParallaxScrollView>

      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={handleInputChange}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            editable={!loading}
            onSubmitEditing={sendMessage}
            multiline
            autoCapitalize="sentences"
            autoCorrect={true}
            keyboardType="default"
          />
          
          <Button
            title="Enviar"
            onPress={sendMessage}
            disabled={loading || !inputMessage.trim()}
            color="#007AFF"
          />
        </View>

        {loading && (
          <ActivityIndicator
            style={styles.loader}
            size="small"
            color="#007AFF"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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