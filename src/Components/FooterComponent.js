import React from 'react';
import { Layout, Typography, Row, Col, Divider } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Footer } = Layout;
const { Text } = Typography;

const FooterComponent = () => {
    return (
        <Footer style={{ backgroundColor: "#001529", color: "white", textAlign: "center", padding: "20px 0" }}>
            <Row>
                <Col span={24}>
                    <Text style={{ color: "#bfbfbf" }}>
                        © {new Date().getFullYear()} Wallapep - Marketplace. All rights reserved.
                    </Text>
                </Col>
                <Col span={24} style={{ marginTop: "5px" }}>
                    <Text style={{ color: "#bfbfbf", display: "inline-flex", alignItems: "center" }}>
                        <MailOutlined style={{ marginRight: '8px' }} /> support@wallapep.com
                    </Text>
                    <Divider type="vertical" style={{ height: "15px", backgroundColor: "#FFFFFFA6", margin: "0 16px" }} />
                    <Text style={{ color: "#bfbfbf", display: "inline-flex", alignItems: "center" }}>
                        <PhoneOutlined style={{ marginRight: "8px" }} /> +33 1 23 45 67 89
                    </Text>
                </Col>
            </Row>
        </Footer>
    );
};

export default FooterComponent;
