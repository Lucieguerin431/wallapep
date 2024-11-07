import { useState, useEffect } from "react";
import { List, Typography, Row, Button, Divider, Card } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCardComponent from "../Products/ProductCardComponent";

const HomePageComponent = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({}); // État pour le comptage des catégories non vendues
    const categories = [
        "Electronics", "Clothing", "Furniture", "Toys", "Books", "Sports", "Plants"
    ];

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            let availableProducts = jsonData.filter(product => !product.buyerEmail); // Filtrer les produits non vendus
            let productsWithImage = await Promise.all(
                availableProducts.map(async p => {
                    let urlImage = process.env.REACT_APP_BACKEND_BASE_URL + "/images/" + p.id + ".png";
                    p.image = (await checkURL(urlImage)) ? urlImage : "/imageMockup.png";
                    return p;
                })
            );
            setProducts(productsWithImage);

            // Comptage des catégories pour les produits non vendus
            const counts = productsWithImage.reduce((acc, product) => {
                acc[product.category] = (acc[product.category] || 0) + 1;
                return acc;
            }, {});
            setCategoryCounts(counts);
        } else {
            let serverErrors = (await response.json()).errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    const checkURL = async (url) => {
        try {
            return (await fetch(url)).ok;
        } catch (error) {
            return false;
        }
    };

    const handleExploreProducts = () => {
        navigate("/products");
    };

    const { Title, Paragraph } = Typography;
    return (
        <div style={{ padding: "20px 50px" }}>
            <div style={{
                textAlign: "center",
                padding: "50px 0",
                backgroundColor: "white",
                marginBottom: "40px",
                borderRadius: "8px",
            }}>
                <Title level={1}>A Marketplace for Buying, Selling, and Connecting</Title>
                <Paragraph style={{ maxWidth: "600px", margin: "0 auto", fontSize: "16px" }}>
                    Find great deals on electronics, clothing, plants, and more - or list your own items for others to discover. Buy, sell, and connect effortlessly in a trusted community.
                </Paragraph>
                <Button type="primary" size="large" onClick={handleExploreProducts} style={{ marginTop: "20px" }}>
                    Explore All Items
                </Button>
            </div>

            <Title level={4} style={{ textAlign: "left", marginBottom: "20px" }}>
                Shop by Category
            </Title>
            <Row justify="left" style={{ marginBottom: "30px" }}>
                {categories.map(category => (
                    <Button
                        key={category}
                        type="default"
                        onClick={() => navigate(`/products?category=${category}`)}
                        style={{ margin: "0 5px" }}
                    >
                        {category} ({categoryCounts[category] || 0})
                    </Button>
                ))}
            </Row>
            <Divider />
            
            {categories.map(category => {
                const categoryProducts = products.filter(product => product.category === category);
                return categoryProducts.length > 0 ? (
                    <Card style={{marginBottom:"15px"}} key={category}>
                        <div>
                            <Row justify="space-between" align="middle" style={{ marginBottom: "15px" }}>
                                {/* Ajout du comptage des produits disponibles à côté du titre de la catégorie */}
                                <Title level={2} style={{ marginBottom: "0" }}>
                                    {category} ({categoryCounts[category] || 0})
                                </Title>
                                <Button
                                    type="link"
                                    onClick={() => navigate(`/products?category=${category}`)}
                                >
                                    See More →
                                </Button>
                            </Row>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={categoryProducts.slice(0, 4)}
                                renderItem={product => (
                                    <List.Item>
                                        <ProductCardComponent product={product} />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Card>
                ) : null;
            })}
        </div>
    );
}

export default HomePageComponent;
