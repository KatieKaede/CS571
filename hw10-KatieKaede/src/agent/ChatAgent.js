const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "Y7OCI4HG7EU6OPDTCZBXTH4RYKXNI6WS";

    let availableItems = [];
    let cart = {};

    const handleInitialize = async () => {
        const response = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw10/items", {
            headers: {
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
            },
        });
        const items = await response.json();
        availableItems = items;

        return "Welcome to BadgerMart Voice! :) Type your question, or ask for help if you're lost!"
    }

    const handleReceive = async (prompt) => {
        const response = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN,
            }
        })
        const data = await response.json();
        console.log(data);
        
        if (data.intents.length > 0) {
            switch(data.intents[0].name) {
                case "get_help": return getHelp();
                case "get_items": return getItems();
                case "get_price":
                    if (data.entities["specific_item:specific_item"] && data.entities["specific_item:specific_item"][0].value) {
                        return getPrice(data.entities["specific_item:specific_item"][0].value);
                    } else {
                        return "The item is not in stock.";
                    }
                case "add_item": 
                    if (data.entities["specific_item:specific_item"] && data.entities["specific_item:specific_item"][0].value) {
                        return addItem(data.entities);
                    } else {
                        return "The item is not in stock.";
                    }
                case "remove_item":
                    if (data.entities["specific_item:specific_item"] && data.entities["specific_item:specific_item"][0].value) {
                        return removeItem(data.entities);
                    } else {
                        return "The item is not in stock.";
                    }
                case "view_cart":
                    return viewCart();
                case "checkout":
                    return checkout();
            }
        }
        return "Sorry I didn't get that. Type 'help' to see what you can do!"
    }

    const getHelp = async() => {
        return "In BadgerMart Voice, you can get the list of items, the price of an item, add or remove an item from your cart, and checkout!"
    }

    const getItems = async() => {
        const names = availableItems.map(item => item.name);
        if (names.length > 1) {
            const lastItem = names.pop();
            return `We have ${names.join("s, ")}s and ${lastItem}s for sale!`;
        } else {
            return `We have ${names[0]}.`;
        }   
    }

    const getPrice = async (itemName) => {
    
        const matchingItem = availableItems.find(
            (item) => item.name.toLowerCase() === itemName.toLowerCase()
        );
    
        if (matchingItem) {
            return `${matchingItem.name}s cost $${matchingItem.price.toFixed(2)} each.`;
        } else {
            return "The item is not in stock";
        }
    };

    const addItem = (entities) => {
        const itemName = entities["specific_item:specific_item"][0].value;
        let quantity = (entities["wit$number:number"]?.[0]?.value);
        quantity = quantity === undefined || quantity === null ? 1 :parseFloat(quantity)
        quantity = Math.floor(quantity);

        if (!itemName) {
            return "The item is not in stock"
        }

        if (quantity <= 0 ) {
            return "Please enter a positive number"
        }

        const matchingItem = availableItems.find(
            (item) => item.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!matchingItem) {
            return "The item is not in stock"
        }

        cart[itemName] = (cart[itemName] || 0) + Math.floor(quantity);
        return `Sure, adding ${quantity} ${itemName}(s) to your cart.`
    };

    const removeItem = (entities) => {
        const itemName = entities["specific_item:specific_item"][0].value;
        let quantity = (entities["wit$number:number"]?.[0]?.value) || 1;
        quantity = Math.floor(quantity);
    
        if (!itemName) {
            return "The item is not in stock.";
        }
    
        if (quantity <= 0) {
            return "Please enter a positive number.";
        }
        const normalizedItemName = itemName.toLowerCase().replace(/s$/, "");
    
        // Check if the item exists in the cart
        if (cart[normalizedItemName]) {
            const currentQuantity = cart[normalizedItemName];
    
            const removedQuantity = Math.min(currentQuantity, quantity);
    
            if (currentQuantity <= quantity) {
                delete cart[normalizedItemName];
            } else {
                cart[normalizedItemName] -= removedQuantity;
            }
    
            return `Sure, removing ${removedQuantity} ${normalizedItemName}(s) from your cart.`;
        } else {
            return `You don't have any ${normalizedItemName}(s) in your cart!`;
        }
    };
    

    const viewCart = () => {
        if (Object.keys(cart).length === 0) {
            return "Your cart is empty.";
        }

        let cartItems = [];
        let totalPrice = 0;

        for (let item in cart) {
            const itemQuantity = cart[item];
            const itemInfo = availableItems.find(
                (availableItem) => availableItem.name.toLowerCase() === item.toLowerCase()
            );
            if (itemInfo) {
                const itemPrice = itemInfo.price;
                const itemTotalPrice = itemPrice * itemQuantity;
                cartItems.push(`${itemQuantity} ${item}(s)`);
                totalPrice += itemTotalPrice;
            }
        }

        return `Your have ${cartItems.join(", ")} in your cart, totaling $${totalPrice.toFixed(2)}`;
    };

    // For API input structure
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // To handle plural text input
    const removePlural = (string) => {
        if (string.endsWith("s")) {
            return string.slice(0, -1);
        }
        return string;
    };
    

    const checkout = async () => {
        if (Object.keys(cart).length === 0) {
            return "Your cart is empty. Please add some items before checking out.";
        }

        let orderData = {};

        availableItems.forEach((item) => {
        orderData[item.name] = 0;
        });

        for (let itemName in cart) {
            const itemNameCapitalized = capitalizeFirstLetter(itemName);
            const itemNameSingular = removePlural(itemNameCapitalized);
            const quantity = cart[itemName];

            if (availableItems.some(item => item.name === itemNameSingular) && quantity > 0 && Number.isInteger(quantity)) {
                orderData[itemNameCapitalized] = quantity;
            } else {
                orderData[itemNameCapitalized] = 0;
            }
        }

        const response = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw10/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_1820e389d1e7a56c895c8593d5cb75d5a0e8950c83ae42263fc4090fc22369d3"
            },
            body: JSON.stringify(orderData)
        });
    
        const result = await response.json();
        const confirmationId = result.confirmationId;
        cart = {};  // Empty the cart after successful checkout
        return `Your order has been placed! Your confirmation ID is: ${confirmationId}`;
    };
    
    

    return {
        handleInitialize,
        handleReceive
    };
};

export default createChatAgent;