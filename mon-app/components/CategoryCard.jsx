import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: item.strCategoryThumb }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>{item.strCategory}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 8,
    elevation: 3,
    overflow: 'hidden',
    width: 100,       
    height: 120,      
    alignSelf: 'flex-start',
      justifyContent: 'flex-start',
  },
  image: {
    width: 100,      
    height: 80, 
    borderRadius: 10,      
  },
  title: {
    fontSize: 11,    
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
  },
});