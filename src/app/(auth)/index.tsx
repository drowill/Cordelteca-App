import React, { useEffect, useState } from 'react';
import { View, LogBox, Text, StyleSheet, FlatList, TextInput, Button, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

interface Cordel {
  cor_id: number;
  cor_titulo: string;
  cor_autor: string;  
  cor_local: string;
  cor_data: string;
  cor_capa: string;
  cor_img: string;
  cor_pdf: string;
}

type PdfAssets = {
  [key: string]: number; 
};

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function Home() {
  const [data, setData] = useState<Cordel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');
  
  const pdfAssets: PdfAssets = {
    '0001': require('./../cordeis/0001.pdf'),
    '0021': require('./../cordeis/0021.pdf'),
    '0168': require('./../cordeis/0168.pdf'),
    '0362': require('./../cordeis/0362.pdf'),
    '0375': require('./../cordeis/0375.pdf'),
    '0408': require('./../cordeis/0408.pdf'),
    '0417': require('./../cordeis/0417.pdf'),
    '0429': require('./../cordeis/0429.pdf'),
    '0431': require('./../cordeis/0431.pdf'),
    '0435': require('./../cordeis/0435.pdf'),
    '0461': require('./../cordeis/0461.pdf'),
    '0489': require('./../cordeis/0489.pdf'),
    '0490': require('./../cordeis/0490.pdf'),
    '0522': require('./../cordeis/0522.pdf'),
  };

  const openModal = async (pdfFileName: string) => {
    const pdfAsset = Asset.fromModule(pdfAssets[pdfFileName]);
    await pdfAsset.downloadAsync();
    setSelectedUrl(pdfAsset.uri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUrl('');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://10.220.0.8:3000/api/cordeis')
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
        <Text style={styles.titulo}>Cordelteca App</Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisa..."
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <Button title="Pesquisa" onPress={handleSearch} />

      <FlatList
        data={data}
        keyExtractor={(item) => item.cor_id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.itembox}>
            <Image source={{ uri: item.cor_img }} style={styles.image} />
            <Text style={styles.item} >Titulo: {item.cor_titulo}</Text> 
            <Text style={styles.item} >Autor: {item.cor_autor}</Text>
            <Text style={styles.item} >Artista da capa: {item.cor_capa}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => openModal(item.cor_pdf)}
              >
                <Text style={styles.buttonText}>Abrir PDF</Text>
              </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1 }}>
          <WebView 
            originWhitelist={['*']} 
            source={{ uri: selectedUrl }} 
          />
          <Button title="Fechar" onPress={closeModal} />
        </View>
      </Modal>

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
    borderRadius: 10,
  },
  item: {
    margin:2,
    fontSize: 18,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
    width: '90%',
    borderRadius: 6,
    color: 'white'
  },
  image: {
    width: "100%",
    height: 380,
    marginRight: 10,
  },
  button: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titulo:{
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 10,
    marginTop: 30,
  }
});

