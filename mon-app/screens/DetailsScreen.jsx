
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  ActivityIndicator, StyleSheet
} from 'react-native';
import MealCard from '../components/MealCard';

export default function DetailsScreen({ route, navigation }) {
  const { category, mealsData } = route.params;
  const [meals, setMeals] = useState(mealsData || []);
  const [loading, setLoading] = useState(!mealsData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mealsData) {
      fetchMeals();
    }
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`
      );
      const data = await response.json();
      setMeals(data.meals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={{ marginTop: 10, color: '#888' }}>Chargement...</Text>
    </View>
  );
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category.strCategory}</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
        renderItem={({ item }) => (
          <MealCard
            item={item}
            onPress={() => navigation.navigate('Recipe', { meal: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun repas trouvé</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});