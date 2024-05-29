import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import FormularioPokemon from "../components/FormularioPokemon";

const WIDTH = Dimensions.get("window").width;
const numColumns = 2;

const isLightColor = (color) => {
  const lightColors = ["white", "yellow", "lightyellow", "lightgrey", "lightgray"];
  return lightColors.includes(color);
};

export default function PokemonAxios() {
  const [pokemon, setPokemon] = useState([]);
  const [namePokemon, setNamePokemon] = useState("");
  const [nPokemon, setNPokemon] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (namePokemon) {
      getPokemonByName(namePokemon);
    } else {
      getPokemon(nPokemon);
    }
  }, [nPokemon, namePokemon]);

  const getPokemon = async (nPokemon) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${nPokemon}`);
      const dataPokemon = response.data.results;
      const detailedPokemon = await Promise.all(
        dataPokemon.map(async (poke) => {
          const pokeDetails = await axios.get(poke.url);
          const pokeSpecies = await axios.get(pokeDetails.data.species.url);
          const typesInEspañol = await Promise.all(
            pokeDetails.data.types.map(async (typeInfo) => {
              const typeDetails = await axios.get(typeInfo.type.url);
              const spanishName = typeDetails.data.names.find(
                (name) => name.language.name === "es"
              ).name;
              return spanishName;
            })
          );
          return {
            ...poke,
            id: pokeDetails.data.id,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeDetails.data.id}.png`,
            color: pokeSpecies.data.color.name,
            types: typesInEspañol,
          };
        })
      );
      setPokemon(detailedPokemon);
      setLoading(false);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
      setLoading(false);
    }
  };

  const getPokemonByName = async (name) => {
    try {
      setLoading(true);
      const pokeDetails = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const pokeSpecies = await axios.get(pokeDetails.data.species.url);
      const typesInEspañol = await Promise.all(
        pokeDetails.data.types.map(async (typeInfo) => {
          const typeDetails = await axios.get(typeInfo.type.url);
          const spanishName = typeDetails.data.names.find(
            (name) => name.language.name === "es"
          ).name;
          return spanishName;
        })
      );
      const detailedPokemon = [{
        name: pokeDetails.data.name,
        id: pokeDetails.data.id,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeDetails.data.id}.png`,
        color: pokeSpecies.data.color.name,
        types: typesInEspañol,
      }];
      setPokemon(detailedPokemon);
      setLoading(false);
    } catch (error) {
      console.log("Hubo un error listando el pokémon", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const textColor = isLightColor(item.color) ? "black" : "white";
    return (
      <View style={[styles.card, { backgroundColor: item.color }]}>
        <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.number, { color: textColor }]}>
          #{item.id.toString().padStart(3, "0")}
        </Text>
        <Image style={styles.image} source={{ uri: item.imageUrl }} />
        <View style={styles.typesContainer}>
          {item.types.map((type) => (
            <Text key={type} style={[styles.type, { color: textColor, borderColor: textColor }]}>
              {type}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FormularioPokemon
        tituloFormulario="Pokedex"
        labelCantidad="Ingrese la cantidad de pokemon a cargar: "
        placeHolderCantidad="20"
        valorCantidad={nPokemon}
        setValorCantidad={setNPokemon}
        labelNombre="Ingrese el nombre del Pokémon:"
        placeHolderNombre="Nombre del Pokémon"
        valorNombre={namePokemon}
        setValorNombre={setNamePokemon}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          key={numColumns}
          data={pokemon}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
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
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
  },
  list: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    margin: 10,
    width: WIDTH / numColumns - 29,
    alignItems: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  number: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: "row",
  },
  type: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    color: "#310857",
    fontSize: 12,
    textTransform: "capitalize",
  },
  loading: {
    marginTop: 20,
  },
});
