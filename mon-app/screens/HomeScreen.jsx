import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, ScrollView,
  ActivityIndicator, StyleSheet
} from 'react-native';
import CategoryCard from '../components/CategoryCard';
import MealCard from '../components/MealCard';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCategories(data.categories);
      setSelectedCategory(data.categories[0].strCategory);
      fetchMealsByCategory(data.categories[0].strCategory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMealsByCategory = async (categoryName) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
      );
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const searchMeals = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      setSearchResults(data.meals || []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={{ marginTop: 10, color: '#888' }}>Chargement...</Text>
    </View>
  );
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;

  return (
    <View style={styles.container}>

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un repas..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchMeals(text);
        }}
        returnKeyType="search"
      />

      {searchQuery.trim() ? (
        // Résultats recherche
        <FlatList
          key="search"
          data={searchResults}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          renderItem={({ item }) => (
            <MealCard
              item={item}
              onPress={() => navigation.navigate('Recipe', { meal: item })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun résultat pour "{searchQuery}"</Text>
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Catégories avec ScrollView horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 4 }}
            style={{ marginTop: 8, maxHeight: 180, overflow: 'visible' }}
            
          >
            {categories.map((item) => (
              <CategoryCard
                key={item.idCategory}
                item={item}
                onPress={() => {
                  setSelectedCategory(item.strCategory);
                  fetchMealsByCategory(item.strCategory);
                }}
              />
            ))}
          </ScrollView>

          {/* Titre */}
          <Text style={styles.sectionTitle}>
            Plats de la catégorie : {selectedCategory}
          </Text>

          {/* Repas de la catégorie */}
          <FlatList
            key="meals"
            data={meals}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            renderItem={({ item }) => (
              <MealCard
                item={item}
                onPress={() => navigation.navigate('Recipe', { meal: item })}
              />
            )}
          />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    fontSize: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    marginTop: 20,
  },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
});