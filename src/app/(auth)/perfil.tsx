import { View, Text, StyleSheet, Image, LogBox } from "react-native";
import Button from "@/components/Button";
import { useAuth, useUser } from "@clerk/clerk-expo";

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();


export default function Perfil(){
    const { user } = useUser()
    const { signOut } = useAuth()

    return(   
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: user?.imageUrl }} />
            <Text style={styles.text}>Ola, {user?.fullName}</Text>
            <Button icon="exit" title="Sair" onPress={ () => signOut() }/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000'
    },
    image:{
        width: 92,
        height: 92,
        borderRadius: 100
    }
});
