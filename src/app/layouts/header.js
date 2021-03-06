/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Layout, Typography, Row, Col, Button, Image, Dropdown, Menu, message} from "antd";
import { UserOutlined, MenuOutlined, BellFilled, BellOutlined } from '@ant-design/icons';
import { withRouter, NavLink, useHistory } from "react-router-dom";
import Auth from "../service/auth"
import Logo from "../../assets/logo.jpg";
import NavbarMenu from '../views/drawer/menu';
import Notifikasi from '../views/drawer/notifikasi';

const { Text } = Typography;

const HeaderLayout = (props) => {
    const history = useHistory();
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleNotifikasi, setVisibleNotifikasi] = useState(false);
    const [listNotifikasi, setListNotifikasi] = useState([])

    const handleDrawerMenu = () => {
        setVisibleMenu(!visibleMenu);
    };

    const handleDrawerNotifikasi = () => {
        setVisibleNotifikasi(!visibleNotifikasi);
    };

    let _role = JSON.parse(localStorage.getItem('role'));
    let login_time = JSON.parse(localStorage.getItem('login'));
    let role = _role/login_time

    console.log(_role/login_time)

    const menuLayanan = (
        <Menu style={{marginTop:20, backgroundColor:"#EB3D00"}}>
            <Menu.Item >
                <NavLink to="/antrean-poliklinik">  
                    <Text className="title-navmenu" style={{fontWeight:"normal"}}>
                        Antrean Poliklinik
                    </Text>
                </NavLink>
            </Menu.Item>
            <Menu.Item >
                {role === 2 || role === 3 ? 
                    <NavLink to="/konsultasi-online">  
                        <Text className="title-navmenu" style={{fontWeight:"normal"}}>
                            Konsultasi Online
                        </Text>
                    </NavLink>
                :
                    <Text onClick={()=>message.info("Anda perlu login sebagai pasien atau dokter untuk mengakses laman konsultasi!")} 
                        className="title-navmenu" style={{fontWeight:"normal"}}>
                        Konsultasi Online
                    </Text>
                }
            </Menu.Item>
        </Menu>
      );

    const gotoDashboard= () => {
        let role = JSON.parse(localStorage.getItem('role'));
        let login_time = JSON.parse(localStorage.getItem('login'));
        if (role/login_time === 1){
            history.push('/dashboard-admin');
        } else if (role/login_time === 2){
            history.push('/dashboard-dokter');
        } else if (role/login_time === 3){
            history.push('/dashboard-pasien');
        } else if (role/login_time === 4){
            history.push('/dashboard-staf-umum');
        } else if (role/login_time === 5){
            history.push('/dashboard-perawat');
        }
    }

    const gotoLogin= () => {
        const loc = '/login';
        history.push(loc);
    }

    return (
        <Layout align="middle" className="navmenu" style={{maxWidth:'100%'}}>
            <Row justify="space-between" align='middle' style={{height:'100%'}}>
                {/* <Col xs={12} sm={6} md={6} lg={6} xl={10} xxl={12} style={{paddingLeft:10}}> */}
                <Col style={{paddingLeft:10}}>
                    <Row align='middle'>
                        <Image src={Logo} alt="Poliklinik POLBAN" 
                            style={{width: 60, height: 60, borderRadius: 20}}
                            preview={false}
                            onClick={()=> props.history.push("/")} 
                        />
                        <Col className="title" style={{paddingLeft:5}}>
                            UNIT  <br></br>
                            PELAYANAN <br></br>
                            KESEHATAN
                        </Col>
                    </Row>
                </Col>
                {/* <Col xs={2} sm={14} md={16} lg={18} xl={14} xxl={12}> */}
                <Col className="title-navmenu">
                <Menu mode="horizontal" style={{backgroundColor:"transparent", borderRadius: "0px 0px 150px 0px"}}>
                    <Menu.Item key="1">
                        <NavLink to="/" className="title-navmenu">
                            BERANDA
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Dropdown overlay={menuLayanan} placement="bottomCenter">
                            <Text className="title-navmenu">
                                LAYANAN
                            </Text>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink to="/informasi" className="title-navmenu">
                            INFORMASI
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <NavLink to="/bantuan" className="title-navmenu">
                            BANTUAN
                        </NavLink>
                        {/* <Text onClick={()=>message.info("Laman Bantuan belum tersedia")} className="title-navmenu">
                            BANTUAN
                        </Text> */}
                    </Menu.Item>
                    {Auth.isLogin() &&
                        <Menu.Item key="5">
                            <Button className="title-navmenu" type="text" onClick={handleDrawerNotifikasi}>
                                <Text className="title-navmenu">
                                    {(listNotifikasi.length > 0) ? 
                                        <BellFilled style={{fontSize:20, margin:0}}/> 
                                    :
                                        <BellOutlined style={{fontSize:20, margin:0}}/> 
                                    }  
                                </Text>
                            </Button>
                        </Menu.Item>
                    }
                    <Menu.Item key="6">
                        <div className="login-button">
                        {Auth.isLogin() ? 
                            <Button type='primary' className="app-btn primary" onClick={gotoDashboard}>
                                <UserOutlined style={{fontSize:20}}/> DASHBOARD
                            </Button>
                            :
                            <Button type='primary' className="app-btn primary" onClick={gotoLogin}>
                                <UserOutlined style={{fontSize:20}}/> LOGIN
                            </Button>
                        }
                        </div>
                    </Menu.Item>
                    
                    </Menu>
                </Col>
                
                <Col className="title-navmenu-mobile">
                    {Auth.isLogin() &&
                        <Button className="title-navmenu-mobile" type="text" onClick={handleDrawerNotifikasi}>
                            <Text className="title-navmenu-mobile">
                                {(listNotifikasi.length > 0) ? 
                                    <BellFilled style={{fontSize:30, margin:0}}/> 
                                :
                                    <BellOutlined style={{fontSize:30, margin:0}}/> 
                                }  
                            </Text>
                        </Button>
                    }
                    <Button className="title-navmenu-mobile" type="text" onClick={handleDrawerMenu} >
                        <Text>
                            <MenuOutlined className="title-navmenu-mobile" style={{fontSize:30, color: "#FFF"}}/>
                        </Text>
                    </Button>
                </Col>
            </Row>
            <NavbarMenu
                buttonCancel={handleDrawerMenu}
                visible={visibleMenu}
                handleDashboard={() => {handleDrawerMenu(); gotoDashboard()}}
                handleLogin={() => {handleDrawerMenu(); gotoLogin()}}
                role={role}
            />
            <Notifikasi
                buttonCancel={handleDrawerNotifikasi}
                visible={visibleNotifikasi}
                role={role}
            />
        </Layout>
    );
}

export default withRouter(HeaderLayout);