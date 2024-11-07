import { useState, useEffect } from 'react';
import { List, Card, Typography, Row, Col, Input, Select, Pagination } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCardComponent from "./ProductCardComponent";
import { SearchOutlined, ShoppingTwoTone } from "@ant-design/icons";

const ListProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState(null);
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [categoryCounts, setCategoryCounts] = useState({}); 

    const categories = ["Electronics", "Clothing", "Furniture", "Toys", "Books", "Sports", "Plants"];
    const productsPerPage = 16;
    const navigate = useNavigate();
    const location = useLocation();

    const priceRanges = [
        { label: "Under 50€", min: 0, max: 50 },
        { label: "50€ - 100€", min: 50, max: 100 },
        { label: "100€ - 500€", min: 100, max: 500 },
        { label: "500€ - 1000€", min: 500, max: 1000 },
        { label: "Over 1000€", min: 1000, max: Infinity },
    ];

    useEffect(() => {
        getProducts();

        const params = new URLSearchParams(location.search);
        const initialCategory = params.get("category");
        if (initialCategory) {
            setSelectedCategory(initialCategory);
        }
    }, [location.search]);

    const getProducts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products`, {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                const jsonData = await response.json();
                const promisesForImages = jsonData.map(async (product) => {
                    const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${product.id}.png`;
                    const existsImage = await checkURL(urlImage);
                    product.image = existsImage ? urlImage : "/imageMockup.png";
                    return product;
                });

                const productsWithImage = await Promise.all(promisesForImages);
                setProducts(productsWithImage);

                // Count categories for unsold products
                const counts = productsWithImage.reduce((acc, product) => {
                    if (!product.buyerEmail) {
                        acc[product.category] = (acc[product.category] || 0) + 1;
                    }
                    return acc;
                }, {});
                setCategoryCounts(counts);
            } else {
                const responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    console.error("Error: " + e.msg);
                });
            }
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };

    const checkURL = async (url) => {
        try {
            const response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        filterProducts();
    }, [selectedCategory, searchTerm, products, sortOrder, priceRange]);

    const filterProducts = () => {
        let filtered = products.filter((product) => {
            return (
                (!selectedCategory || product.category === selectedCategory) &&
                (!searchTerm || product.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
                product.price >= priceRange[0] &&
                product.price <= priceRange[1]
            );
        });
        
        if (sortOrder === "desc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "asc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        filtered.sort((a, b) => (a.buyerEmail ? 1 : -1));

        setFilteredProducts(filtered);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePriceRangeChange = (value) => {
        const range = priceRanges.find((r) => r.label === value);
        setPriceRange(range ? [range.min, range.max] : [0, Infinity]);
    };

    const { Title, Text } = Typography;

    return (
        <div style={{ padding: "20px 50px" }}>
            <Title level={2} style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
                <ShoppingTwoTone style={{ fontSize: "32px", marginRight: "10px", lineHeight: "1" }} twoToneColor="#007bff" />
                Discover All The Items
            </Title>
            <Title level={5} style={{ marginBottom: "30px", color: "gray" }}>
                Browse through all available items. Use the search and filter options to find exactly what you're looking for.
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12} md={5}>
                    <Input
                        placeholder="Search for items"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col xs={24} sm={12} md={3}>
                    <Select
                        placeholder="Category"
                        style={{ width: "100%" }}
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                        allowClear
                    >
                        {categories.map((category) => (
                            <Select.Option key={category} value={category}>
                                {category} ({categoryCounts[category] || 0})
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Price range"
                        style={{ width: "100%"}}
                        onChange={handlePriceRangeChange}
                        allowClear
                    >
                        {priceRanges.map((range) => (
                            <Select.Option key={range.label} value={range.label}>
                                {range.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Sort"
                        style={{ width: "100%" }}
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value)}
                        allowClear
                    >
                        <Select.Option value="asc">Price: Low to High</Select.Option>
                        <Select.Option value="desc">Price: High to Low</Select.Option>
                    </Select>
                </Col>
            </Row>

            <Text type="secondary" style={{ display: "block", marginBottom: "15px" }}>
                {filteredProducts.length} item(s) found
            </Text>
            
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)}
                renderItem={(product) => (
                    <List.Item>
                        <ProductCardComponent product={product} showCategory={true} />
                    </List.Item>
                )}
            />

            <Pagination
                current={currentPage}
                pageSize={productsPerPage}
                total={filteredProducts.length}
                onChange={handlePageChange}
                style={{ textAlign: "center", marginTop: "20px" }}
            />
        </div>
    );
};

export default ListProductsComponent;
