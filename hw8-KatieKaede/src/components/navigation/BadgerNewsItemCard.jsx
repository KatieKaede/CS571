import React from 'react';
import { Pressable, View, Text, Image } from 'react-native';

function BadgerNewsItemCard({ article }) {
    const imageUrl = `https://raw.githubusercontent.com/CS571-F24/hw8-api-static-content/main/${article.img}`;

    const navigateToArticle = () => {
    navigation.push('BadgerNewsArticleScreen', {
      title: article.title,
      img: article.img,
      fullArticleId: article.fullArticleId, 
    });
  }; 

    return (
        <View style={{ padding: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom:10, fontSize:20 }}>{article.title}</Text>
            <Image 
                source={{ uri: imageUrl }} 
                style={{ width: '100%', height: 150, resizeMode: 'cover' }} 
            />
        </View>
    );
}

export default BadgerNewsItemCard;