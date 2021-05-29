import React, { useEffect, useState } from "react";
import { withRouter, NavLink, useHistory } from 'react-router-dom';
import { Layout, Breadcrumb, Row, Col, Card, Typography, Table, Button } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { dialog } from '../../component/alert'
import Dummy from '../../dummy/dummy'

const { Content } = Layout;
const { Text, Title } = Typography;

const KelolaDokter = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState([]);

    const gotoTambahDataDokter= () => {
        const loc = '/kelola-data-pengguna/dokter/tambah-data';
        history.push(loc);
    }

    const gotoUbahDataDokter = () => {
        const loc = '/kelola-data-pengguna/dokter/ubah-data';
        history.push(loc);
    }

    const columnsDokter = [
        {
            title: "ID Dokter",
            dataIndex: 'id_dokter',
            key: 'id_dokter',
            width: '25%',
            sorter: (a, b) => a.id_pasien - b.id_pasien,
        },
        {
            title: "Nama Dokter",
            dataIndex: 'nama',
            key: 'nama',
            width: '25%',
            sorter: (a, b) => a.nama - b.nama,
        },
        {
            title: "Spesialisasi",
            dataIndex: 'spesialisasi',
            key: 'spesialisasi',
            width: '25%',
            sorter: (a, b) => a.nama - b.nama,
        },
        {
            title: 'Kelola',
            width: '20%',
            align: 'center',
            render: (record) => {
                return (
                <Row justify="center" gutter={[20,0]}>
                  <Col>
                    <Button
                        onClick={() => {
                            setRecord(record);
                            gotoUbahDataDokter();
                        }
                    }>
                        <Text style={{color: "#000"}}>
                            <EditOutlined style={{fontSize:20}}/>
                        </Text>
                    </Button>
                  </Col>
                  <Col>
                    <Button 
                        onClick={() => {
                            dialog({icon: "info", title:"Hapus Data Dokter", text: "Apakah Anda yakin akan menghapus data dokter ini?"}).then(()=>{
                                console.log("deleted");
                            })
                        }}
                    >
                        <Text style={{color: "#000"}}>
                            <DeleteOutlined style={{fontSize:20}}/>
                        </Text>
                    </Button>
                  </Col>
                </Row>
                );
            },
        },
    ]

    return(
        <Layout style={{backgroundColor: "#072A6F"}}>
            <Content className="layout-content">
                <Breadcrumb style={{marginLeft:40, marginBottom:20, color:"#FFF"}} separator=">">
                    <Breadcrumb.Item href="/">
                        <Text className="title">
                            <HomeOutlined />
                        </Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/profil-staf">
                        <Text className="title">
                            <span>Admin</span>
                        </Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/kelola-data-pengguna/dokter">
                        <Text className="title">
                            <span>Kelola Data Dokter Poliklinik</span>
                        </Text>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Row style={{marginLeft:40}}>
                    <Col>
                        <NavLink to="/kelola-data-pengguna/pasien" className="text-heading">
                            <Title level={1} style={{color: '#FFF'}}>
                                DATA PASIEN
                            </Title>
                        </NavLink>
                    </Col>
                    <Col style={{marginLeft:48}}>
                        <NavLink to="/kelola-data-pengguna/dokter" className="text-heading" activeStyle={{color: '#EB3D00'}}>
                            <Title level={1} style={{color: '#EB3D00'}}>
                                DATA DOKTER 
                            </Title>
                        </NavLink>
                    </Col>
                    <Col style={{marginLeft:48}}>
                        <NavLink to="/kelola-data-pengguna/staf" className="text-heading">
                            <Title level={1} style={{color: '#FFF'}}>
                                DATA STAF
                            </Title>
                        </NavLink>
                    </Col>
                </Row>

                <Row style={{marginBottom:20}}>
                    <Card className="informasi-card" style={{width:"100%"}}>
                        <Row>
                            <Text className="title-tabel">
                                Data Dokter
                            </Text>
                        </Row>
                        <Table
                            columns={columnsDokter}
                            size="middle"
                            bordered={false}
                            loading={loading}
                            dataSource={Dummy.dataDokter}
                            // onChange={handleTableChange}
                        />
                    </Card>
                </Row>
            </Content>
        </Layout>
    );
}

export default withRouter(KelolaDokter)