import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, FlatList, TextInput, Button, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { pdfAssets } from './../../constants/Cordeis';

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


// Ignorar logs
// LogBox.ignoreLogs(['Warning: ...']); 
// LogBox.ignoreAllLogs();

export default function Home() {
  const [data, setData] = useState<Cordel[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');
  
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
    axios.get('http://10.220.0.8:3000/api/recent')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
        console.error(error.response);
      });
  };




  return (
    <ScrollView style={styles.container}>
      <Image style={styles.logo} source={ require('@/assets/images/logo-titulo.png') } />

      <View style={styles.sobre}>
        <Text style={styles.texto}>
          Este é o aplicativo móvel da Cordelteca da UFRN, nosso objetivo é facilitar o acesso aos cordeis do acervo.
        </Text>
      </View>

      <Text style={styles.titulo}>Adicionados recentemente</Text>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.cor_id.toString()} 
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity 
              style={styles.itembox}
              onPress={() => openModal(item.cor_pdf)}
            >
              <Image source={{ uri: item.cor_img }} style={styles.image} />
            </TouchableOpacity>
          </View>)}
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

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffffa0',
  },
  itembox: {
    margin:7,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 5,
    fontSize: 18,
    borderRadius: 10,
  },
  image: {
    borderRadius: 5,
    width: 250,
    height: 380,
  },
  logo:{
    marginBottom:20,
    height:100,
    width:320,
    paddingTop:30
  }, 
  titulo:{
    marginLeft:10,
    marginTop:20,
    fontSize: 28,
    fontWeight: 'bold'
  },
  sobre:{
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    marginHorizontal:5,
  },
  texto:{
    fontWeight:500,
    fontSize:20,
    textAlign:'justify'
  }
});

