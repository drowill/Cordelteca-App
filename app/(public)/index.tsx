import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, LogBox } from "react-native";
import  Button  from "@/components/Button";
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { red } from "react-native-reanimated/lib/typescript/Colors";
// import logo from "./../../assets/images/logo.png";

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();


WebBrowser.maybeCompleteAuthSession()

export default function SingIn(){
    const [isLoading, setIsLoading] = useState(false)
    const googleOAuth = useOAuth({ strategy: "oauth_google" })
    
    async function onGoogleSignIn(){
        try {
            setIsLoading(true)

            const redirectUrl = Linking.createURL("(auth)") // ou "/"

            const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl })

            if(oAuthFlow.authSessionResult?.type === "success"){
                if(oAuthFlow.setActive){
                    await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
                }
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() =>{
        WebBrowser.warmUpAsync()

        return() => {
            WebBrowser.coolDownAsync()
        }
    }, [])
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={ require('@/assets/images/logo-titulo.png') } />
            <Text style={styles.title}>Entrar na cordelteca</Text>
            <View style={styles.sobre}>
                <Text style={styles.aviso}>AVISO:</Text>
                <Text style={styles.texto}>
                    Ao criar uma conta em nosso aplicativo, você concorda em não usar os trabalhos autorais dos escritores para meios comerciais, etc.
                </Text>
            </View>
            <Button 
                icon="logo-google" 
                title="Entrar com Google" 
                onPress={onGoogleSignIn}
                isLoading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        gap: 12
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    logo: {
        height:100,
        width:320
    },
    sobre:{
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        marginHorizontal:5,
        borderColor: 'red'
    },
    texto:{
        fontWeight:500,
        fontSize:20,
        textAlign:'justify'
    },
    aviso:{
        fontWeight: 'bold',
        fontSize:28,
        color: 'red'
    }
})