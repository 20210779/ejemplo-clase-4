import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import FormularioCat from '../components/FormularioCat';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

export default function CatAxios() {
  const [cat, setCat] = useState([]);
  const [nCat, setNCat] = useState(25); // La API comenzará mostrando 25 gatos
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCat(nCat);
  }, [nCat]);

  const getCat = async (limit) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.thecatapi.com/v1/breeds?limit=${limit}`);
      setCat(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Hubo un error listando los gatos", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text>Clave Gátones: <Text style={styles.number}>{item.id}</Text></Text>
        {item.reference_image_id ? (
          <Image
            style={styles.image}
            source={{ uri: `https://cdn2.thecatapi.com/images/${item.reference_image_id}.jpg` }}
          />
        ) : (
          <Text>No image available</Text>
        )}
        <Text style={styles.title}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FormularioCat
        tituloFormulario='Listado de Gatos'
        labelInput='Ingrese la cantidad de gatos a cargar: '
        placeHolderInput='20'
        valor={nCat}
        setValor={setNCat}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={cat}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  list: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 5,
    width: WIDTH / numColumns - 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  image: {
    width: 80,
    height: 80,
  },
  number: {
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
});
