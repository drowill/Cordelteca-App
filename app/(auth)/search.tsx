import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, FlatList, TextInput, Button, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  

export default function Search() {

    const [data, setData] = useState<Cordel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState('');
    const [isSearching, setIsSearching] = useState(false)
  

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

    const handleSearch = () => {
        setIsSearching(true);
        axios.get(`http://10.220.0.8:3000/api/search?term=${searchTerm}`)
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.text}>Encontre seu cordel</Text>
            <View style={styles.header}>
                <TextInput
                style={styles.input}
                placeholder="Pesquisa"
                value={searchTerm}
                onChangeText={text => setSearchTerm(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleSearch}><Ionicons name="search" size={24} /></TouchableOpacity>
            </View>

            {isSearching && data.length > 0 && (
            <FlatList
                data={data}
                keyExtractor={(item) => item.cor_id.toString()} 
                renderItem={({ item }) => (
                    <View style={styles.list}>
                        <TouchableOpacity 
                            style={styles.itembox}
                            onPress={() => openModal(item.cor_pdf)}
                        >
                            <Image source={{ uri: item.cor_img }} style={styles.image} />
                            {/* <Text style={styles.buttonText}>Abrir PDF</Text> */}
                        </TouchableOpacity>
                    </View>
                )}
            />)}

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fecbdc',
      },
      itembox: {
        margin:7,
        backgroundColor: '#FFFFFF',
        padding: 5,
        width:"82%",
        alignItems:"center",
        fontSize: 18,
        borderRadius: 10,
      },
      input: {
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 8,
        width: '80%',
        borderRadius: 6,
        backgroundColor: "#bcbcbc"
      },
      image: {
        width: 250,
        borderRadius: 5,
        height: 380,
      },
      button: {
        marginLeft:5,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
      },
      header:{
        margin: 10,
        flexDirection: "row",
        justifyContent:"center",
      },
      text:{
        marginTop: 20,
        fontWeight:"bold",
        fontSize:40,
        textAlign:'left'
      },
      list:{
        alignItems:"center"
      }
      
});