import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Image } from 'react-native';
import axios from 'axios';

interface Admin {
  adm_id: number;
  adm_nome: string;
  adm_user: string;  
  adm_senha: string;
  adm_imagem_url: string;
}

const App = () => {
  const [data, setData] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://10.220.0.8:3000/api/admins')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
        console.error(error.response);
      });
  };

  const handleSearch = () => {
    axios.get(`http://10.220.0.8:3000/api/search?term=${searchTerm}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={data}
        keyExtractor={(item) => item.adm_id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.itembox}>
            <Image source={{ uri: item.adm_imagem_url }} style={styles.image} />
            <Text style={styles.item} >{item.adm_nome}</Text> 
            <Text style={styles.item} >{item.adm_user}</Text>
            <Text style={styles.item} >{item.adm_senha}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFCE30',
  },
  itembox: {
    flex: 1,
    margin:10,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 10,
    fontSize: 18,
  },
  item: {
    margin:2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
    width: '80%',
  },
  image: {
    width: 250,
    height: 250,
    marginRight: 10,
  },
});

export default App;
