import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notification } from "antd";
import DetailsProductComponent from "./DetailsProductComponent";

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
                <ProductDetails
                    product={product}
                    imageURL={imageURL}
                    isSoldOrOwner={isSoldOrOwner}
                    isOwner={isOwner}
                    setIsModalVisible={setIsModalVisible}
                />
                <PurchaseModal
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    loading={loading}
                    currentStep={currentStep}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                    handlePurchase={handlePurchase}
                    form={form}
                    countries={countries}
                />
            </div>
        </div>
    );
};

export default DetailsProductComponent;
