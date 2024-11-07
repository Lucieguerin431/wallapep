import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import EditProductComponent from "./Components/Products/EditProductComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListMyProductsComponent from "./Components/Products/ListMyProductsComponent";
import HomePageComponent from "./Components/Home/HomePageComponent";
import UserProfile from "./Components/User/UserProfilComponent";
import TransactionListComponent from "./Components/Transactions/TransactionListComponent";
import NavigationBarComponent from "./Components/Layout/NavigationBarComponent";
import FooterComponent from "./Components/Layout/FooterComponent";

import {Route, Routes, Link, useNavigate, useLocation } from "react-router-dom"
import {Layout, Menu, Avatar, Typography, Col, Row, notification } from 'antd';
import {useEffect, useState} from "react";

let App = () => {
    const [api, contextHolder] = notification.useNotification();
    const HeaderAvatar = () => {
    const userId = localStorage.getItem("userId"); 

    return (
        <Link to={`/users/${userId}`}>
            <Avatar
                style={{ cursor: "pointer" }}
                src={localStorage.getItem("avatarUrl") || "/default-avatar.png"} 
                alt="User Avatar"
            />
        </Link>
    );
};
    let navigate = useNavigate();
    
    let location = useLocation();
    let [login, setLogin] = useState(false);

    // for not using Layout.Header, Layout.Footer, etc...
    let {Header, Content, Footer} = Layout;

    useEffect(() => {
        checkAll()
    }, [])

    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        checkUserAccess(isActive)
    }

    const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

    let checkLoginIsActive = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setLogin(false);
            return;
        }

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey)

            if (!jsonData.activeApiKey){
                navigate("/login")
            }
            return(jsonData.activeApiKey)
        } else {
            setLogin(false)
            navigate("/login")
            return (false)
        }
    }

    let checkUserAccess= async (isActive) => {
        let href = location.pathname
        if (!isActive && !["/","/login","/register"].includes(href) ){
            navigate("/login")
        }
    }

    let disconnect = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        setLogin(false)
        navigate("/login")
    }


    const {Text} = Typography;
    return (
        <Layout className="layout" style={{minHeight: "100vh"}}>
            {contextHolder}
            <NavigationBarComponent login={login} setLogin={setLogin} disconnect={disconnect} />
            <Content style={{padding: "20px 50px"}}>
                <div className="site-layout-content">
                    <Routes>
                        <Route path="/register" element={
                            <CreateUserComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/login"  element={
                            <LoginFormComponent setLogin={setLogin} openNotification={openNotification}/>
                        }/>
                        <Route path="/products" element={
                            <ListProductsComponent/>
                        }/>
                        <Route path="/products/edit/:id" element={
                            <EditProductComponent/>
                        }/>
                        <Route path="/products/:id" element={
                            <DetailsProductComponent/>
                        }/>
                        <Route path="/products/create" element={
                            <CreateProductComponent />
                        }></Route>
                        <Route path="/products/own" element={
                            <ListMyProductsComponent />
                        }></Route>
                        <Route path="/" element={
                            <HomePageComponent />
                        }></Route>
                        <Route path="/users/:id" element={
                            <UserProfile />
                        }></Route>
                        <Route path="/transactions/own" element={
                            <TransactionListComponent />
                        }></Route>
                    </Routes>
                </div>
            </Content>
            <FooterComponent />
        </Layout>
)
}

export default App;