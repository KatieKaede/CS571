import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import BadgerNewsItemCard from '../navigation/BadgerNewsItemCard';
import { usePreferences } from '../contexts/BadgerContext';

function BadgerNewsScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const { preferences } = usePreferences();

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw8/articles", { 
      headers: {
        "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
      }
    })
      .then(response => response.json())
      .then(data => {
        // Filter articles based on preferences
        const filteredArticles = data.filter(article => 
          article.tags.every(tag => preferences[tag] !== false)
        );
        setArticles(filteredArticles);
      });
  }, [preferences]);

  const filteredArticles = articles.filter((article) => {
    return article.tags.every(tag => preferences[tag] !== false);
  });

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {filteredArticles.length === 0 ? (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>
          No articles match your preferences.
        </Text>
      ) : (
        <View>
          {filteredArticles.map((article) => (
            <Pressable
              key={article.id}
              onPress={() => navigation.push("BadgerNewsArticleScreen", {
                title: article.title,
                img: article.img,
                fullArticleId: article.fullArticleId,
              })}
            >
              <BadgerNewsItemCard article={article} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default BadgerNewsScreen;
