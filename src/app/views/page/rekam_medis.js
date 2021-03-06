import React, { useEffect, useState } from "react";
import { withRouter, NavLink } from 'react-router-dom';
import { Layout, Breadcrumb, Row, Col, Card, Typography, Button} from 'antd';
import { HomeOutlined, InfoOutlined } from '@ant-design/icons';
import DetailPasien from '../modal/detail_pasien'
import moment from 'moment';

const { Content } = Layout;
const { Text } = Typography;

const RekamMedis = (props) => {
    const [dataRekamMedis, setDataRekamMedis] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [record, setRecord] = useState([]);
    const [searchKey, setSearchKey] = useState("");

    const [path, setPath] = useState("");
    const [role, setRole] = useState(5);

    useEffect(()=>{
        let _role = JSON.parse(localStorage.getItem('role'));
        let login_time = JSON.parse(localStorage.getItem('login'));
        setRole(_role/login_time)

        console.log(_role/login_time)
        if(_role/login_time === 2){
            setPath("/dashboard-dokter");
        } else if(_role/login_time === 5){
            setPath("/dashboard-perawat");
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleModal = () => {
        //message.info("Laman Detail Kunjungan belum Tersedia");
        setVisibleModal(!visibleModal);
    };

    useEffect(()=>{
        let tanggal = moment(props.location.state.tanggal, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY') 
        props.location.state.tanggal = tanggal
        setDataRekamMedis(props.location.state)
        console.log(props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey]);
    
    return(
        <Layout style={{backgroundColor: "#072A6F"}}>
            <Content className="layout-content">
                <Breadcrumb style={{marginLeft:20, marginBottom:20}} separator=">">
                    <Breadcrumb.Item>
                        <NavLink to="/">  
                            <Text className="title">
                                <HomeOutlined />
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`${path}`}>  
                            <Text className="title">
                                Dashboard
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`${path}/kelola-rekam-medis/${props.match.params.poli}`}>  
                            <Text className="title">
                                Kelola Rekam Medis
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`${path}/kelola-rekam-medis/${props.match.params.poli}`}>  
                            <Text className="title">
                               {props.match.params.poli === "umum" ? "Umum" : "Gigi"}
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`${path}/kelola-rekam-medis/${props.match.params.poli}/data-kunjungan/${props.match.params.id_pasien}`}>  
                            <Text className="title">
                                Data Kunjungan
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`${path}/kelola-rekam-medis/umum/data-kunjungan/${props.match.params.id_pasien}/detail`}>  
                            <Text className="title">
                                Detail 
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <DetailPasien
                    dataPasien={record}
                    buttonCancel={handleModal}
                    visible={visibleModal}
                />

                <Row style={{marginBottom:20, marginRight:20}}>
                    <Card className="informasi-card" style={{width:"100%"}}>
                        <Row>
                            <Text className="title-tabel">
                                Rekam Medis Pasien {`{ID Pasien: ${props.match.params.id_pasien}}`}
                            </Text>
                        </Row>
                        <Row style={{marginBottom:20}} align="middle">
                            <Text className="title-tabel">
                                Informasi Pasien:
                            </Text>
                            <Button
                                style={{marginLeft: 10}}
                                onClick={() => {
                                    setRecord(props.location.state.dataPasien)
                                    console.log("test",props.location.state)
                                    handleModal();
                                }}
                            >
                                <Text style={{color: "#000"}}>
                                    <InfoOutlined style={{fontSize:20}}/>
                                </Text>
                            </Button>
                        </Row>
                        <Row>
                            <Text className="title-tabel">
                                Tanggal Kunjungan : {dataRekamMedis.tanggal ? dataRekamMedis.tanggal : "-"}
                            </Text>
                        </Row>
                        <Row>
                            <Text className="title-tabel">
                                Dokter Pemeriksa : {dataRekamMedis.nama_dokter ? dataRekamMedis.nama_dokter : "-"}
                            </Text>
                        </Row>
                        <Row>
                            <Text className="title-tabel">
                                Jam Masuk : {dataRekamMedis.jam_masuk ? dataRekamMedis.jam_masuk : "-"}
                            </Text>
                        </Row>
                        <Row>
                            <Text className="title-tabel">
                                Jam Keluar : {dataRekamMedis.jam_keluar ? dataRekamMedis.jam_keluar : "-"}
                            </Text>
                        </Row>
                        <div className="rekammedis-card" >
                        <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Anamnesa" >
                                {dataRekamMedis.anamnesa ? dataRekamMedis.anamnesa : "-"}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Diagnosis" >
                                {dataRekamMedis.diagnosis ? dataRekamMedis.diagnosis: "-"}
                            </Card>
                        </Col>
                        </Row>
                    </div>
                    <div className="rekammedis-card" >
                        <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Terapi" >
                                {dataRekamMedis.terapi ? dataRekamMedis.terapi: "-"}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Keterangan" >
                                {dataRekamMedis.keterangan ? dataRekamMedis.keterangan : "-"}
                            </Card>
                        </Col>
                        </Row>
                    </div>
                    </Card>
                </Row>
            </Content>
        </Layout>
    );
}

export default withRouter(RekamMedis)