import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Linking, Animated } from 'react-native';

function BadgerNewsArticleScreen({ route }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { title, img, fullArticleId } = route.params;

  useEffect(() => {
    fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw8/article?id=${fullArticleId}`, {
      headers: {
        "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
      }
    })
      .then(response => response.json())
      .then(data => {
        setArticle(data);
        setLoading(false);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true, 
        }).start();
      });
  }, [fullArticleId]);

  const handleLinkPress = () => {
    if (article?.url) {
      Linking.openURL(article.url);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <View>
        <Image
          source={{ uri: `https://raw.githubusercontent.com/CS571-F24/hw8-api-static-content/main/${img}` }}
          style={{ width: '100%', height: 150, resizeMode: 'cover' }}
        />
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{title}</Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Text>The content is loading...</Text>
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={{ fontSize: 16, color: 'gray', marginTop: 5 }}>
            {article.author} | {article.posted}
            </Text>
            <Pressable onPress={handleLinkPress}>
              <Text style={{ color: '#0066cc', marginTop: 10, fontSize: 16 }}>
                Read full article here
              </Text>
            </Pressable>
            <Text style={{ marginTop: 10 }}>{article.body}</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

export default BadgerNewsArticleScreen;
