import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, TextInput, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { styles } from '../styles/ChatScreenStyles';
import { formatBotResponse } from '../utils/formatBotResponse';
import { markdownStyles } from '../utils/markdownStyles';
import { formatBotResponse } from '../../utils/formatBotResponse';
import { markdownStyles } from '../../utils/markdownStyles';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  isMarkdown?: boolean;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      const lastChar = text.slice(-1);
      const newText = /[.!?]/.test(lastChar) ? text + ' ' : text;
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

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

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
      console.error('Erro:', error);
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
            source={require('../../assets/images/partial-react-logo.png')}
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
          />
          
          <Button
            title="Enviar"
            onPress={sendMessage}
            disabled={loading || !inputMessage.trim()}
            color="#007AFF"
          />
        </View>

        {loading && <ActivityIndicator style={styles.loader} color="#007AFF" />}
      </View>
    </View>
  );
}
