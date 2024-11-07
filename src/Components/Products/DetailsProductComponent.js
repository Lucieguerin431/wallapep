import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Typography, Image, Button, Divider, Row, Col, Breadcrumb, Modal, Spin, Form, Input, Select, notification, Steps, Tooltip} from "antd";
import { ShoppingOutlined, UserOutlined, QuestionCircleOutlined, ShoppingCartOutlined} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

const DetailsProductComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [imageURL, setImageURL] = useState("/imageMockup.png"); 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [countries, setCountries] = useState([]);
    const [form] = Form.useForm();
    const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;

    const userId = localStorage.getItem("id");

    useEffect(() => {
        getProduct(id);
    }, [id]);

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((response) => response.json())
            .then((data) => {
                const countryList = data
                    .map((country) => ({
                        name: country.name.common,
                        code: country.cca2,
                        flag: country.flags.png,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
            });
    }, []);

    const getProduct = async (productId) => {
        try {
            const response = await fetch(`${baseURL}/products/${productId}`, {
                headers: { "apikey": localStorage.getItem("apiKey") },
            });

            if (response.ok) {
                const productData = await response.json();
                setProduct(productData);
                setProductImage(productData.id);
            } else {
                throw new Error("Failed to fetch product details");
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Unable to fetch product details.",
            });
        }
    };

    const setProductImage = async (productId) => {
        const urlImage = `${baseURL}/images/${productId}.png`;
        const existsImage = await checkURL(urlImage);
        setImageURL(existsImage ? urlImage : "/imageMockup.png");
    };

    const checkURL = async (url) => {
        try {
            let response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    const isOwner = product.sellerId == userId;
    const isSoldOrOwner = isOwner || product.buyerId;

    const handleNext = async () => {
        try {
            if (currentStep === 0) {
                await form.validateFields(["address", "postalCode", "country"]);
            }
            setCurrentStep(currentStep + 1);
        } catch (error) {
            notification.error({
                message: "Incomplete Form",
                description: "Please complete all required fields in the shipping information.",
            });
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePurchase = async () => {
        setLoading(true);
        try {
            await form.validateFields();
            const response = await fetch(`${baseURL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": localStorage.getItem("apiKey"),
                },
                body: JSON.stringify({
                    productId: id,
                    buyerId: userId,
                    shippingDetails: {
                        address: form.getFieldValue("address"),
                        postalCode: form.getFieldValue("postalCode"),
                        country: form.getFieldValue("country"),
                    },
                    cardDetails: {
                        number: form.getFieldValue("cardNumber"),
                        expiry: form.getFieldValue("expiry"),
                        cvv: form.getFieldValue("cvv"),
                    },
                }),
            });

            if (response.ok) {
                notification.success({
                    message: "Transaction Successful",
                    description: "Your purchase has been recorded.",
                });
                setIsModalVisible(false);
                navigate("/transactions/own");
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            notification.error({
                message: "Purchase Error",
                description: "Please complete all required fields and try again.",
            });
            console.error("Purchase failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px 50px", display: "flex", justifyContent: "center", minHeight: "700px" }}>
            <div style={{ 
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "40px",
                maxWidth: "1200px",
                width: "100%",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}>
                <Breadcrumb style={{ marginBottom: "40px", fontSize: "16px", color: "#888", cursor:"pointer" }} separator=">">
                    <Breadcrumb.Item onClick={() => navigate("/products")}>
                        Products
                    </Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(`/products?category=${product.category}`)}>
                        {product.category || "Category"}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {product.title || "Product"}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Row gutter={32} align="middle">
                    <Col xs={24} md={12} style={{ display: "flex", justifyContent: "center" }}>
                        <Image
                            src={imageURL}
                            alt={product.title}
                            style={{ 
                                width: "100%", 
                                maxHeight: "500px", 
                                objectFit: "cover", 
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                    </Col>
    
                    <Col xs={24} md={12}>
                        <Title level={2} style={{ marginBottom: "10px", fontSize: "28px", lineHeight: "1.2" }}>{product.title}</Title>
                        <Text type="secondary" style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>
                            Category: {product.category}
                        </Text>
                        {product.sellerId && (
                                <Link to={`/users/${product.sellerId}`} style={{ fontSize: "16px", color: "#fb3188", marginBottom: "30px", display: "flex", alignItems: "center", textDecoration:"underline" }}>
                                    <UserOutlined style={{ marginRight: "8px" }} />
                                    View Seller's Profile
                                </Link>
                        )}
                        <div style={{ backgroundColor: "yellow", padding: "5px 10px", borderRadius: "5px", display: "inline-block", marginBottom: "30px" }}>
                            <Title level={2} style={{ margin: 0, color: "#000" }}>
                                {product.price}€
                            </Title>
                        </div>

                        <Divider />

                        <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>{product.description}</Text>

                        <Divider />

                        {isSoldOrOwner && (
                            <Title level={4} style={{ color: "red", fontWeight: "bold" }}>
                                {isOwner ? "You are the owner of this item." : "This item has been sold."}
                            </Title>
                        )}
                        {!isSoldOrOwner && (
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                size="large"
                                style={{ 
                                    marginTop: "20px", 
                                    width: "100%", 
                                    maxWidth: "300px", 
                                    height: "55px",
                                    fontSize: "18px",
                                    fontWeight: "bold"
                                }}
                                onClick={() => setIsModalVisible(true)}
                            >
                                Buy Now
                            </Button>
                        )}
                    </Col>
                </Row>
                <Modal
                    title={<><ShoppingCartOutlined style={{ marginRight: "8px" }} /> Complete Your Purchase</>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Spin spinning={loading}>
                        <Steps current={currentStep} style={{ marginBottom: "20px", padding: "0 15px", marginTop:"20px" }}>
                            <Step title="Shipping Information" />
                            <Step title="Payment" />
                        </Steps>

                        <Form form={form} layout="vertical" style={{ marginTop: "20px", padding: "0 15px" }}>
                            {currentStep === 0 && (
                                <>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                        rules={[{ required: true, message: "Please enter your address" }]}
                                    >
                                        <Input placeholder="123 Green Street" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Postal Code"
                                        name="postalCode"
                                        rules={[{ required: true, message: "Please enter your postal code" }]}
                                    >
                                        <Input placeholder="75001" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Country"
                                        name="country"
                                        rules={[{ required: true, message: "Please select your country" }]}
                                    >
                                        <Select placeholder="Select your country" showSearch>
                                            {countries.map((country) => (
                                                <Option key={country.code} value={country.name}>
                                                    <img
                                                        src={country.flag}
                                                        alt={country.name}
                                                        style={{ width: "20px", marginRight: "8px" }}
                                                    />
                                                    {country.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </>
                            )}
                            {currentStep === 1 && (
                                <>
                                    <Form.Item
                                        label="Card Number"
                                        name="cardNumber"
                                        rules={[
                                            { required: true, message: "Please enter your card number" },
                                            { len: 16, message: "Card number must be 16 digits" }
                                        ]}
                                    >
                                        <Input 
                                            placeholder="1234567812345678" 
                                            maxLength={16}
                                            onKeyDown={(e) => {
                                                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Expiry Date (MMYY)"
                                        name="expiry"
                                        rules={[
                                            { required: true, message: "Please enter the expiry date (MMYY)" },
                                            {
                                                validator: (_, value) => {
                                                    if (!value || value.length < 4) return Promise.reject("Please enter a valid date");
                                                    
                                                    const month = parseInt(value.substring(0, 2), 10);
                                                    const year = parseInt("20" + value.substring(2, 4), 10);
                                                    
                                                    if (month < 1 || month > 12) return Promise.reject("Month must be between 01 and 12");
                                    
                                                    const expiryDate = new Date(year, month - 1);
                                                    return expiryDate > new Date()
                                                        ? Promise.resolve()
                                                        : Promise.reject("The expiration date must be in the future");
                                                }
                                            }
                                        ]}

                                    >
                                        <Input 
                                            placeholder="MMYY" 
                                            maxLength={4}
                                            onKeyDown={(e) => {
                                                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={
                                            <span>
                                                CVV
                                                <Tooltip title="The CVV is a 3-digit code located on the back of your card.">
                                                    <QuestionCircleOutlined />
                                                </Tooltip>
                                            </span>
                                        }
                                        name="cvv"
                                        rules={[
                                            { required: true, message: "Please enter the CVV code" }, 
                                            { len: 3, message: "CVV must be 3 digits" }
                                        ]}
                                    >
                                        <Input.Password 
                                            maxLength={3} 
                                            placeholder="123"
                                            onKeyDown={(e) => {
                                                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )}
                        </Form>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", padding: "0 15px" }}>
                            {currentStep > 0 && (
                                <Button onClick={handlePrevious}>
                                    Previous
                                </Button>
                            )}
                            {currentStep < 1 ? (
                                <Button type="primary" onClick={handleNext} style={{ marginLeft: "auto" }}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="primary" onClick={handlePurchase} style={{ marginLeft: "auto" }}>
                                    Confirm Purchase
                                </Button>
                            )}
                        </div>
                    </Spin>
                </Modal>
            </div>
        </div>
    );
};

export default DetailsProductComponent;
