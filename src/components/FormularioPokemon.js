import { View, Text, TextInput, StyleSheet } from 'react-native';

const FormularioPokemon = ({ tituloFormulario, labelCantidad, placeHolderCantidad, valorCantidad, setValorCantidad, labelNombre, placeHolderNombre, valorNombre, setValorNombre }) => {
    return (
        <View>
            <Text style={styles.header}>{tituloFormulario}</Text>
            <View>
                <Text style={styles.descripcion}>{labelCantidad}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeHolderCantidad}
                    onChangeText={text => setValorCantidad(parseInt(text) || 0)}
                    value={valorCantidad.toString()}
                />
                <Text style={styles.descripcion}>{labelNombre}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeHolderNombre}
                    onChangeText={text => setValorNombre(text)}
                    value={valorNombre}
                />
            </View>
        </View>
    );
}

export default FormularioPokemon;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '70%',
        backgroundColor: '#dfd7d7',
        height: 50,
        paddingStart: 20,
        fontWeight: '900',
        borderRadius: 5,
        margin: 5,
        marginStart: 45,
        fontSize: 18,
    },
    descripcion: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'justify',
        marginTop: 10,
    },
});
