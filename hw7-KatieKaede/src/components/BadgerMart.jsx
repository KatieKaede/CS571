import { Text, View, Alert, Button } from "react-native";
import React, { useEffect, useState } from "react";
import CS571 from '@cs571/mobile-client';
import BadgerSaleItem from "./BadgerSaleItem";

export default function BadgerMart(props) {
    const badgerId = "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3";
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw7/items", {
                headers: {
                    "X-CS571-ID": badgerId
                }
            });
            const data = await response.json();
            console.log("Fetched Data:", data);
            setItems(data.items || data);
        };
        fetchItems();
    }, []);

    const nextItem = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setQuantity(0);
        }
    };

    const previousItem = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setQuantity(0);
        }
    };

    const addQuantity = () => {
        if (quantity < items[currentIndex].upperLimit) {
            setQuantity(quantity + 1);
            setTotalItems(totalItems + 1);
            setTotalCost(totalCost + items[currentIndex].price);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
            setTotalItems(totalItems - 1);
            setTotalCost(totalCost - items[currentIndex].price);
        }
    };

    const placeOrder = () => {
        Alert.alert(
            "Order confirmed!",
            `Your order contains ${totalItems} items and would have cost ${totalCost.toFixed(2)}!`
        );

        setTotalItems(0);
        setTotalCost(0);
        setQuantity(0);
        setCurrentIndex(0);
    };

    return (
        <View>
            <Text style={{ fontSize: 28 }}>Welcome to Badger Mart!</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button 
                    title="Previous" 
                    onPress={previousItem} 
                    disabled={currentIndex === 0}
                />
                <Button 
                    title="Next" 
                    onPress={nextItem} 
                    disabled={currentIndex === items.length - 1}
                />
            </View>

            {items.length > 0 && (
                <BadgerSaleItem
                    item={items[currentIndex]}
                />
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    title="-"
                    onPress={decreaseQuantity}
                    disabled={quantity === 0}
                />
                <Text>{quantity}</Text>
                <Button
                    title="+"
                    onPress={addQuantity}
                    disabled={quantity === items[currentIndex]?.upperLimit}
                />
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text>You have {totalItems} item(s) costing ${totalCost.toFixed(2)} in your cart!</Text>
            </View>

            <Button
                title="Place Order"
                onPress={placeOrder}
                disabled={totalItems === 0}
            />

        </View>
    );
}
