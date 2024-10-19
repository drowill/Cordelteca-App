import { useEffect, useState } from "react";
import { Text, View, StyleSheet, LogBox } from "react-native";
import  Button  from "@/components/Button";
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

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
            <Text style={styles.title}>Entrar na cordelteca</Text>
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
        padding: 32,
        gap: 12
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    }
})