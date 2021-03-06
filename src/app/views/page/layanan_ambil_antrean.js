import React, { useState, useEffect } from "react";
import { withRouter, NavLink } from 'react-router-dom';
import { Layout, Row, Col, Breadcrumb, Typography, Card, Table, Button, Select, Spin} from 'antd';
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import { APIServices } from '../../service'
import Auth from "../../service/auth";
import { dialog } from '../../component/alert'
import TabelPasien from '../modal/tabel_pasien'
import moment from 'moment';

import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
 
const AmbilAntrean = (props) => {
    const [loadingButton, setLoadingButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPilihPasien, setShowPilihPasien] = useState(false);
    const [dataAntrean, setDataAntrean] = useState([]);
    const [lastAntrean, setLastAntrean] = useState([]);
    const [newAntrean, setNewAntrean] = useState("-");
    const [selectedPasien, setSelectedPasien] = useState(null);
    const [antreanExist, setAntreanExist] = useState(false)
    const [noAntrean, setNoAntrean] = useState(null)
    const [sisaAntrean, setSisaAntrean] = useState(null)

    useEffect(()=>{
        window.Echo = new Echo({
            // authEndpoint: "http://25.70.2.196:8000/laravel-websockets/auth",
            broadcaster: 'pusher',
            key: "anyKey",
            wsHost: "api.kota101.studio",
            wsPort: 6001,
            disableStats: true,
            forceTLS: false // Critical if you want to use a non-secure WebSocket connection
        });

        let echo = window.Echo;

        if(props.location.state.poli === "umum"){
            echo.channel('antre')
                .listen('AntreanSentUmum', (e) => {
                    console.log("log event: ", e);
                    getAntreanUmum()
                    getNewAntrean(1)
                    getLastAntreanUmum()
                })
                .listen('AntreanUpdateUmum', (e) => {
                    console.log(e);
                    getAntreanUmum()
                    getNewAntrean(1)
                    getLastAntreanUmum()
                })
        } else {
            echo.channel('antre')
                .listen('AntreanSentGigi', (e) => {
                    console.log(e);
                    getAntreanGigi()
                    getNewAntrean(2)
                    getLastAntreanGigi()
                })
                .listen('AntreanUpdateGigi', (e) => {
                    console.log(e);
                    getAntreanGigi()
                    getNewAntrean(2)
                    getLastAntreanGigi()
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [role, setRole] = useState(0);
    /* RENDER WHEN PAGE OPEN */
    useEffect(()=>{
        let _role = JSON.parse(localStorage.getItem('role'));
        let login_time = JSON.parse(localStorage.getItem('login'));
        setRole(_role/login_time)

        if(props.location.state.poli === "umum"){
            getLastAntreanUmum()
            getAntreanUmum()
            getNewAntrean(1);
        } else {
            getLastAntreanGigi()
            getAntreanGigi()
            getNewAntrean(2);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNewAntrean = (id_poli) => {
        setLoading(true);
        APIServices.getNewAntrean(id_poli).then(res => {
                if(res.data){
                    console.log(res.data.data.no_antrean)
                    setNewAntrean(res.data.data.no_antrean)
                    setLoading(false)
                }
            }).catch(err => {
                if(err){
                    console.log(err)
                    setLoading(false)
                }
            })
        }

    const getAntreanUmum = () => {
        setLoading(true);
        APIServices.getAntreanUmum().then(res => {
                if(res.data){
                    setLoading(false)
                    console.log("AU: ", res.data.data.data)
                    setDataAntrean(res.data.data.data);
                    res.data.data.data.forEach(val => {
                        if(val.id_pasien === JSON.parse(localStorage.getItem('id_pasien')) && val.status === 0){
                            setAntreanExist(true);
                            setNoAntrean(val.no_antrean)
                            let current = val.no_antrean.split("U-")
                            let last = lastAntrean.no_antrean.split("U-")
                            console.log("tes: ", parseInt(current[1]))
                            setSisaAntrean(parseInt(current[1]) - parseInt(last[1]))
                        }
                    })
                }
            }).catch(err => {
                if(err){
                    console.log(err)
                    setLoading(false)
                }
            })
        }
    
    const getLastAntreanUmum = () => {
        setLoading(true);
        APIServices.getLastAntreanUmum().then(res => {
                console.log("LA: ", res)
                if(res.data){
                    if(res.data.data.data.length > 0){
                        setLastAntrean(res.data.data.data[0])
                    } else {
                        setLastAntrean({no_antrean:"U-000"})
                    }
                    setLoading(false)
                }
            }).catch(err => {
                if(err){
                    console.log(err)
                    setLoading(false)
                }
            })
        }

    const getAntreanGigi = () => {
        setLoading(true);
        APIServices.getAntreanGigi().then(res => {
                if(res.data){
                    setLoading(false)
                    console.log("AG: ", res.data.data.data)
                    setDataAntrean(res.data.data.data);
                    res.data.data.data.forEach(val => {
                        if(val.id_pasien === JSON.parse(localStorage.getItem('id_pasien')) && val.status === 0){
                            setAntreanExist(true);
                            setNoAntrean(val.no_antrean)
                            let current = val.no_antrean.split("G-")
                            let last = lastAntrean.no_antrean.split("G-")
                            console.log("tes: ", parseInt(current[1]))
                            setSisaAntrean(parseInt(current[1]) - parseInt(last[1]))}
                    })
                }
            }).catch(err => {
                if(err){
                    console.log(err)
                    setLoading(false)
                }
            })
        }

    const getLastAntreanGigi = () => {
        setLoading(true);
        APIServices.getLastAntreanGigi().then(res => {
                console.log("LG: ", res)
                if(res.data){
                    if(res.data.data.data.length > 0){
                        setLastAntrean(res.data.data.data[0])
                    } else {
                        setLastAntrean({no_antrean:"G-000"})
                    }
                    setLoading(false)
                }
            }).catch(err => {
                if(err){
                    console.log(err)
                    setLoading(false)
                }
            })
        }

    const ambilAntrean = (data) => {
        let body = {
            id_poli: props.location.state.poli === "umum" ? 1 : 2,
            id_pasien: (role === 1 || role === 2 || role === 4 || role === 5) ? 
                (selectedPasien ? selectedPasien.id_pasien : "") 
                : 
                JSON.parse(localStorage.getItem('id_pasien')),
        }
        setLoadingButton(true);

        // Promise.all([
        //     APIServices.postAntrean(body1),
        //     APIServices.postAntrean(body2),
        //     APIServices.postAntrean(body3),
        //     APIServices.postAntrean(body4),
        // ]).then((res) =>{
        //     setLoading(false);
        // })

        let isExist = dataAntrean.some(item => item.id_pasien === body.id_pasien)
        if(!isExist){
            APIServices.postAntrean(body).then(res => {
                setLoadingButton(false);
                if(res.data){
                    dialog({icon: "success", title:"Ambil Nomor Antrean Berhasil!"}).then(()=>{
                        setSelectedPasien(null)
                        if(props.location.state.poli === "umum"){
                            getLastAntreanUmum()
                            getAntreanUmum()
                            getNewAntrean(1);
                        } else {
                            getLastAntreanGigi()
                            getAntreanGigi()
                            getNewAntrean(2);
                        }
                        console.log("Berhasil");
                    })
                }
            }).catch(err => {
                setLoadingButton(false);
                if(err){
                    dialog({icon: "error", title:"Ambil Nomor Antrean Gagal!"}).then(()=>{
                        console.log("Gagal");
                    })
                }
            })
        } else {
            dialog({icon: "error", title:"Pasien sudah berada dalam Antrean!"}).then(()=>{
                console.log("Gagal");
            })
            setLoadingButton(false);
        }
    }

    const columnsAntrean = [
        {
            title: "Nomor Antrean",
            dataIndex: 'no_antrean',
            key: 'nomor',
            width: '25',
            align: 'center',
            
        },
        {
            title: "Nama Pasien",
            dataIndex: "nama",
            key: 'nama',
            width: '25',
            align: 'center',
        },
    ]

    return(
        <Layout style={{backgroundColor: "#072A6F"}}>
            <Content className="layout-content-new">
                <Breadcrumb style={{marginTop: 20, marginLeft:40, marginBottom:20, color:"#FFF"}} separator=">">
                    <Breadcrumb.Item>
                        <NavLink to="/"> 
                            <Text className="title">
                                <HomeOutlined />
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <NavLink to="/antrean-poliklinik"> 
                            <Text className="title">
                                <span>Antrean Poliklinik</span>
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to="/antrean-poliklinik"> 
                            <Text className="title">
                                {props.location.state.poli === "umum" ? "Poli Umum" : "Poli Gigi"}
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={10} style={{minHeight:600, marginRight:40}} justify="space-between">
                    <Col xs={24} md={12} lg={8}>
                        
                        
                        <Card className="button-card" style={{height:350}}>
                        <Row justify="center">
                            <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                {antreanExist ? "NOMOR ANTREAN ANDA" : "AMBIL NOMOR ANTREAN BARU"}
                            </Text>
                        </Row>
                        {loading ?
                            <Row justify="center" align="middle" style={{marginTop:40}}>
                                <Spin indicator={antIcon} /> 
                            </Row>
                        :
                        <>
                            <Card justify="center" style={{marginTop:20, borderColor: "#EB3D00", borderWidth: 5, borderRadius: 15}}>
                                <Row justify="center">
                                    <Text style={{color:"#EB3D00", fontWeight:"bold", fontSize: "3em"}}>
                                        {antreanExist ? noAntrean : (newAntrean) ? newAntrean : "-"}
                                    </Text>
                                </Row>
                            </Card>
                            
                            
                            {Auth.isLogin() && (role === 1 || role === 2 || role === 4 || role === 5) &&
                                <>
                                {selectedPasien &&
                                    <Row justify="center">
                                        <Text ellipsis style={{color:"#EB3D00", fontWeight:"bold", marginTop: 20}}>
                                                {selectedPasien.kode_pasien+" | "+selectedPasien.nama}
                                        </Text>
                                    </Row>
                                }
                                <Row justify="center">
                                    {selectedPasien ? 
                                        <>
                                        <Button type='text' info style={{color: "#072A6F"}} 
                                            loading={loadingButton}
                                            onClick={() => {
                                                setShowPilihPasien(true)
                                            }}
                                        >
                                            Ganti Pasien
                                        </Button>
                                        </>
                                    :
                                        <Button type='text' info style={{marginTop: 20, color: "#072A6F"}} 
                                            loading={loadingButton}
                                            onClick={() => {
                                                setShowPilihPasien(true)
                                            }}
                                        >
                                            Pilih Pasien
                                        </Button>
                                    }
                                    
                                </Row>
                                </>
                            }
                            
                            <Row justify="center">
                                {!antreanExist || (role !== 3) ? 
                                    <Button type='primary' className="app-btn secondary" info style={{marginTop: 20}} 
                                        loading={loadingButton}
                                        onClick={() => {
                                            ambilAntrean();
                                        }}
                                    >
                                        Ambil Nomor Antrean
                                    </Button>
                                    :
                                    <>
                                    <Col>
                                    <Row justify="center" style={{marginTop:30}}>
                                        <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                            Menunggu {sisaAntrean} antrean
                                        </Text>
                                    </Row>
                                    <Row justify="center">
                                        <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                            *) Apabila terlewat lebih dari 3 antrean,
                                        </Text>
                                    </Row>
                                    <Row justify="center">
                                        <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                            silahkan mengambil antrean baru.
                                        </Text>
                                    </Row>
                                    </Col>
                                    </>
                                }
                            </Row>
                        </>
                        }
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="button-card" style={{height:350}}>
                        <Row justify="center">
                            <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                SEDANG DILAYANI
                            </Text>
                        </Row>
                        {loading ?
                            <Row justify="center" align="middle" style={{marginTop:40}}>
                                <Spin indicator={antIcon} /> 
                            </Row>
                        :
                        <>
                            
                            <Card justify="center" style={{marginTop:20, borderColor: "#EB3D00", borderWidth: 5, borderRadius: 15}}>
                                <Row justify="center">
                                    <Text style={{color:"#EB3D00", fontWeight:"bold", fontSize: "3em"}}>
                                        {lastAntrean.no_antrean ? lastAntrean.no_antrean : "-"}
                                    </Text>
                                </Row>
                            </Card>
                            <Row justify="center" style={{marginTop:20}}>
                                <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                    Jam Masuk
                                </Text>
                            </Row>
                            <Row justify="center">
                                <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                {lastAntrean.jam_masuk ? moment(lastAntrean.jam_masuk, 'YYYY-MM-DD HH:mm:ss.S').format('HH:mm:ss') : "-"}
                                
                                </Text>
                            </Row>
                            <Row justify="center" style={{marginTop:20}}>
                                <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                    {props.location.state.poli === "umum" ? "Poli Umum" : "Poli Gigi"}
                                </Text>
                            </Row>
                            <Row justify="center">
                                <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                    {props.location.state.poli === "umum" ? "dr. Eva Dianita" : "drg. Weni Fitriani"} 
                                </Text>
                            </Row>
                        </>
                        }
                        </Card>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Card className="button-card" style={{minHeight:350}}>
                            <Row justify="center">
                                <Text style={{color:"#EB3D00", fontWeight:"bold"}}>
                                    LIST ANTREAN
                                </Text>
                            </Row>
                            <Table
                                columns={columnsAntrean}
                                size="middle"
                                bordered={false}
                                loading={loading}
                                dataSource={dataAntrean}
                                // onChange={handleTableChange}
                            />
                        </Card>
                    </Col>
                </Row>
                <TabelPasien
                    visible={showPilihPasien}
                    buttonCancel={()=> {setShowPilihPasien(false)}}
                    setSelectedPasien={setSelectedPasien}
                    selectedPasien={selectedPasien}
                />
            </Content>
        </Layout>
    );
}

export default withRouter(AmbilAntrean)