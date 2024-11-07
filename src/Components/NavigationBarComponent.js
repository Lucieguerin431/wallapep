import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Row, Col, Divider } from "antd";
import { PlusOutlined, UserOutlined, DollarCircleOutlined, AppstoreOutlined, LogoutOutlined, DownOutlined, ShoppingOutlined, AppstoreTwoTone, DollarCircleTwoTone } from "@ant-design/icons";

const NavigationBarComponent = ({ login, disconnect }) => {
    const { Header } = Layout;
    const location = useLocation();
    const userId = localStorage.getItem("id");
    const userEmail = localStorage.getItem("email") || "My Account";

    const currentPath = location.pathname;
    const selectedKey = currentPath === "/products" ? "menuAllProducts"
                      : currentPath === "/products/create" ? "menuCreateListing"
                      : currentPath === `/users/${userId}` || currentPath === "/products/own" || currentPath === "/transactions/own" ? "submenuAccount"
                      : null;

    return login ? (
        <Header style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "1200px" }}>
                <Row align="middle" justify="space-between">
                    <Col style={{ minWidth: "80px", display: "flex", justifyContent: "flex-start" }}> 
                        <Menu theme="light" mode="horizontal" selectedKeys={selectedKey ? [selectedKey] : []} style={{ backgroundColor: "transparent" }}>
                            <Menu.Item key="logo" style={{ marginRight: "30px" }}>
                                <Link to="/">
                                    <img src="/w_logo.png" width="40" height="40" alt="Site Logo" />
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Col>

                    <Col style={{ flex: 1, display: "flex", justifyContent: "center" }}> 
                        <Menu theme="light" mode="horizontal" selectedKeys={[selectedKey]} style={{ backgroundColor: "transparent", borderBottom: "none" }}>
                            <Menu.Item key="menuAllProducts" icon={<ShoppingOutlined />} style={{ color: "#007bff", fontSize: "16px" }}>
                                <Link to="/products">Buy items</Link>
                            </Menu.Item>
                            <Menu.Item key="menuCreateListing" icon={<PlusOutlined />} style={{ color: "#fb3188", fontSize: "16px" }}>
                                <Link to="/products/create">Sell now</Link>
                            </Menu.Item>
                        </Menu>
                    </Col>

                    <Col style={{ minWidth: "150px", display: "flex", justifyContent: "flex-end", gap: "16px" }}>                        
                    <Menu theme="light" mode="horizontal" selectedKeys={selectedKey === "submenuAccount" ? ["submenuAccount"] : []} 
                        selectable={false} style={{ backgroundColor: "transparent" }}>
                            <Menu.SubMenu
                                key="submenuAccount"
                                popupClassName="custom-menu-submenu"
                                title={
                                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <DownOutlined style={{ fontSize: "12px", color: "#007bff" }} /> 
                                        <Avatar
                                            size="large"
                                            style={{ backgroundColor: "#fb3188" }}
                                        >
                                            {userEmail.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </span>
                                }
                            >
                                <Menu.Item key="menuProfile" icon={<UserOutlined/>} style={{ color: "#007bff" }}>
                                    <Link to={`/users/${userId}`}>My Profile</Link>
                                </Menu.Item>
                                <Menu.Item key="menuMyListings" icon={<AppstoreTwoTone />} style={{ color: "#007bff" }}>
                                    <Link to="/products/own">My Ads</Link>
                                </Menu.Item>
                                <Menu.Item key="menuMyTransactions" icon={<DollarCircleTwoTone />} style={{ color: "#007bff" }}>
                                    <Link to="/transactions/own">My Transactions</Link>
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="menuLogout" icon={<LogoutOutlined />} onClick={disconnect} style={{ color: "#f5222d" }}>
                                    Logout
                                </Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    </Col>
                </Row>
            </div>
        </Header>
    ) : (
        <Row align="middle" justify="start" style={{ padding: "15px 175px" }}>
            <img src="/w_logo.png" width="40" height="40" alt="Site Logo" />
        </Row>
    );
};

export default NavigationBarComponent;
