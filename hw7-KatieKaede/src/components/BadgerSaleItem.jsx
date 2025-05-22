import { Text, View, Image, Button } from "react-native";

export default function BadgerSaleItem(props) {
    const { item } = props;
    const image = item.imgSrc;
    console.log(image)
;
    return (
        <View key = {item.name} style={{ alignItems: 'center'}}>
            <Text>{item.name}</Text>
            <Image 
                style={{ 
                    width: 100, 
                    height: 100 
                        }} 
                source={{ 
                    uri: item.imgSrc 
                }}
            />
            <Text>${item.price.toFixed(2)} each</Text>
            <Text>You can order up to {item.upperLimit} units!</Text>
        </View>
    );
}
