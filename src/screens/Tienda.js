import React from "react";
import {
    Keyboard,
    ScrollView,
    ImageBackground,
    Dimensions,
    StyleSheet,
    Image,
} from "react-native";
import { SafeAreaView, ProductCard } from "../components";
import {
    BlackButton,
    NavigationButton,
    SectionHeader,
} from "../mini_components";

import {
    newProducts as getNewProducts,
    bestSellers as getBestSellers,
    loadCollectionProducts,
} from "../shopify/products";

import config from "../config";
const { categoryTable } = config;

const Tienda = (props) => {
    const { navigation } = props;
    const jumbo = React.useRef({
        width: 0,
        height: 0,
    });
    const [newProducts, setNewProducts] = React.useState([]);
    const [bestSellers, setBestSellers] = React.useState([]);

    const image = Image.resolveAssetSource(
        require("../assets/images/pax3.jpg")
    );
    jumbo.current = {
        width: Math.round(Dimensions.get("window").width),
        height: Math.round(
            Dimensions.get("window").width * (image.height / image.width)
        ),
    };

    React.useEffect(() => {
        getNewProducts(10).then(setNewProducts);
        getBestSellers(10).then(setBestSellers);
    }, []);

    if (!newProducts || !bestSellers) {
        return <></>;
    }

    const navigateDisplay = React.useCallback(
        (title) => {
            let params = { title };
            switch (title) {
                case "Nuevos Productos": {
                    params.fetcher = () => getNewProducts(50);
                    break;
                }
                case "Más Vendidos": {
                    params.fetcher = () => getBestSellers(50);
                    break;
                }
                case "Accesorios": {
                    params.fetcher = () =>
                        loadCollectionProducts(categoryTable["Accesorios"]);
                    break;
                }
            }
            return () => navigation.navigate("Display Products", params);
        },
        [navigation, loadCollectionProducts, newProducts, bestSellers]
    );

    return (
        <SafeAreaView>
            <ScrollView
                style={{ backgroundColor: "white" }}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                onScroll={Keyboard.dismiss}
            >
                <ImageBackground
                    source={require("../assets/images/pax3.jpg")}
                    style={[styles.imgBackgroundStyle, jumbo.current]}
                >
                    <BlackButton
                        style={{ width: 100, height: 30 }}
                        text={"Comprar"}
                    />
                </ImageBackground>

                <NavigationButton
                    text="Vaporizadores"
                    style={{ marginHorizontal: -20 }}
                    onPress={() => navigation.navigate("Categorias")}
                />
                <NavigationButton
                    text="Accesorios"
                    style={{ marginHorizontal: -20 }}
                    onPress={navigateDisplay("Accesorios")}
                />
                {/* Start Product cards */}
                <SectionHeader
                    title="Nuevos"
                    onPress={navigateDisplay("Nuevos Productos")}
                />
                <ScrollView horizontal style={{ paddingVertical: 20 }}>
                    {newProducts.map((product) => (
                        <ProductCard
                            style={{ marginRight: 20 }}
                            key={product.id}
                            product={product}
                        />
                    ))}
                </ScrollView>
                {/* End Product cards */}
                <SectionHeader
                    title="Los más vendidos"
                    onPress={navigateDisplay("Más Vendidos")}
                />
                <ScrollView horizontal style={{ paddingVertical: 20 }}>
                    {bestSellers.map((product) => (
                        <ProductCard
                            style={{ marginRight: 20 }}
                            key={product.id}
                            product={product}
                        />
                    ))}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    imgBackgroundStyle: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: 20,
        marginHorizontal: -20,
    },
});

export default Tienda;
