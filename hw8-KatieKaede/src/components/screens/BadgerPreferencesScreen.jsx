import React, { useEffect, useState } from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { usePreferences } from '../contexts/BadgerContext'; // Import the custom hook

function BadgerPreferencesScreen({ route, navigation }) {
  const [tags, setTags] = useState([]);
  const { preferences, togglePreference } = usePreferences(); // Access preferences from context

  useEffect(() => {
    // Fetch all articles to extract tags dynamically
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw8/articles", {
      headers: {
        "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
      }
    })
      .then(response => response.json())
      .then(data => {
        const allTags = new Set();
        data.forEach(article => {
          article.tags.forEach(tag => allTags.add(tag));
        });
        setTags(Array.from(allTags));
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text style={{ borderTopWidth: 50 , fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}>
        Set Your Preferences
      </Text>

      {tags.map((tag) => (
        <View key={tag} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ flex: 1, fontSize: 16 }}>{tag}</Text>
          <Switch
            onValueChange={() => togglePreference(tag)}
            value={preferences[tag] ?? true} 
          />
        </View>
      ))}
    </ScrollView>
  );
}

export default BadgerPreferencesScreen;
