import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView,
  ActivityIndicator, StyleSheet, TouchableOpacity, Linking
} from 'react-native';

export default function RecipeScreen({ route }) {
  const { meal } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const data = await response.json();
      setRecipe(data.meals[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={{ marginTop: 10, color: '#888' }}>Chargement...</Text>
    </View>
  );
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;

  return (
    <ScrollView style={styles.container}>

     
      <TouchableOpacity
        activeOpacity={recipe.strYoutube ? 0.8 : 1}
        onPress={() => recipe.strYoutube && Linking.openURL(recipe.strYoutube)}
      >
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.image}
          resizeMode="cover"
        />
        {recipe.strYoutube && (
          <View style={styles.playOverlay}>
            <View style={styles.youtubeBtn}>
              <View style={styles.playArrow} />
            </View>
            <Text style={styles.youtubeText}>Watch on YouTube</Text>
          </View>
        )}
      </TouchableOpacity>

      
      <Text style={styles.title}>{recipe.strMeal}</Text>

      {/* Ingrédients */}
      <Text style={styles.sectionTitle}>Ingrédients</Text>
      {getIngredients(recipe).map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Text style={styles.ingredient}>• {item.ingredient}</Text>
          <Text style={styles.measure}>{item.measure}</Text>
        </View>
      ))}

      
      <Text style={styles.sectionTitle}>Instructions</Text>
      {recipe.strInstructions
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
        .map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))
      }

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 250 },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 250,
  },
  youtubeBtn: {
    width: 68, height: 48,
    backgroundColor: '#FF0000',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  playArrow: {
    width: 0, height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 18, borderRightWidth: 0,
    borderBottomWidth: 11, borderTopWidth: 11,
    borderLeftColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: 4,
  },
  youtubeText: { color: '#fff', marginTop: 8, fontWeight: '800', fontSize: 14 },
  title: { fontSize: 22, fontWeight: 'bold', padding: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', padding: 16, paddingBottom: 8, color: '#FF6B6B' },
  ingredientRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 6,
    borderBottomWidth: 0.5, borderBottomColor: '#eee',
  },
  ingredient: { fontSize: 14 },
  measure: { fontSize: 14, color: '#888' },
  stepRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    paddingBottom: 8,
  },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
});