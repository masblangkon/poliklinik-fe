import React, { useEffect, useState } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { Layout, Row, Col, Breadcrumb, Card, Typography, Form, Input, Select, Button, DatePicker } from 'antd';
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import { dialog } from '../../component/alert'
import { APIServices } from '../../service'
import moment from 'moment';

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const UbahDataPasien = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        console.log(props.location)
        if(props.location.state){
          form.setFieldsValue(props.location.state);
          let tanggal = props.location.state.tanggal_lahir;
          form.setFieldsValue({tanggal_lahir: (moment(tanggal, 'YYYY-MM-DD')) });
        }else{
          form.resetFields()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish= (values) => {
        setLoading(true);
        let body ={
            kategori: values.kategori,
            jurusan: values.jurusan,
            prodi: values.prodi,
            nama: values.nama,
            nomor_identitas: values.nomor_identitas,
            tanggal_lahir: values.tanggal_lahir.format('YYYY-MM-DD'),
            alamat: values.alamat
        }
        APIServices.putDataPasien(body).then(res => {
            setLoading(false);
            if(res.data){
                history.goBack();
                dialog({icon: "success", title:"Ubah Data Pasien Berhasil!"}).then(()=>{
                    console.log("Berhasil");
                })
            }
          }).catch(err => {
            setLoading(false);
            if(err){
                dialog({icon: "error", title:"Ubah Data Pasien Gagal!"}).then(()=>{
                    console.log("Gagal");
                })
            }
          })
    }
    
    return(
        <Layout style={{backgroundColor: "#072A6F"}}>
        <Content className="layout-content">
        <Breadcrumb style={{marginLeft:40, marginBottom:20}} separator=">">
                <Breadcrumb.Item href="/">
                    <Text className="title">
                        <HomeOutlined />
                    </Text>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/profil-staf">
                    <Text className="title">
                        Admin
                    </Text>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/kelola-data-pengguna/pasien">
                    <Text className="title">
                        Kelola Data Pasien
                    </Text>
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    <Text className="title">
                        {props.match.params.aksi === "ubah-data" ? "Ubah Data" : "Tambah Data"}
                    </Text>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row justify="center">
            <Card className="form-card" style={{width: 600, textAlign:"left"}}>
                <Row>
                    <Text className="title-tabel">
                        Ubah Data Pasien
                    </Text>
                </Row>
                <Form form={form} name="control-hooks" onFinish={onFinish}>
                <Row justify="space-between" gutter={30}>
                    <Col span={12}>
                        <Text className="title-label">ID Pasien</Text>
                        <Form.Item name="id_pasien" >
                                <Input className="input-form secondary" disabled/>
                        </Form.Item>
                        
                        <Text className="title-label">Nomor Telepon</Text>
                            <Form.Item name="no_telepon" rules={[{ required: true }]}>
                                    <Input className="input-form secondary" disabled/>
                            </Form.Item>
                            
                        <Text className="title-label">Kategori Pasien</Text>
                            <Form.Item name="kategori" rules={[{ required: true }]}>
                                <Select defaultValue="Umum" className="input-form">
                                    <Option value="Umum">Umum</Option>
                                    <Option value="Mahasiswa">Mahasiswa</Option>
                                    <Option value="Staf/Dosen">Staf/Dosen</Option>
                                    <Option value="Keluarga Staf/Dosen">Keluarga Staf/Dosen</Option>
                                </Select>
                            </Form.Item>
                        
                        {form.getFieldValue('kategori')==="Mahasiswa" &&
                            <div>
                                <Text className="title-label">Jurusan</Text>
                                <Form.Item name="no_telepon" rules={[{ required: true }]}>
                                        <Input className="input-form secondary" disabled/>
                                </Form.Item>

                                <Text className="title-label">Program Studi</Text>
                                <Form.Item name="no_telepon" rules={[{ required: true }]}>
                                        <Input className="input-form secondary" disabled/>
                                </Form.Item>
                            </div>
                        }
                        
                    </Col>
                    <Col span={12}>
                        <Text className="title-label">Nama Pasien</Text>
                            <Form.Item name="nama" rules={[{ required: true }]}>
                                    <Input className="input-form secondary" />
                            </Form.Item>

                        <Text className="title-label">Nomor Identitas</Text>
                            <Form.Item name="nomor_identitas" rules={[{ required: true }]}>
                                    <Input className="input-form secondary" />
                            </Form.Item>
                            
                        <Text className="title-label">Tanggal Lahir</Text>
                            <Form.Item name="tanggal_lahir" rules={[{ required: true }]}>
                                    <DatePicker className="input-form secondary" format='DD/MM/YYYY' placeholder="" style={{width:256}}/>

                            </Form.Item>
                            
                        <Text className="title-label">Alamat</Text>
                            <Form.Item name="alamat" rules={[{ required: true }]}>
                                    <Input className="input-form secondary" />
                            </Form.Item>
                    </Col>
                </Row>
                <Row justify="center">
                    <Button className="app-btn tertiary" onClick={()=> {history.goBack()}}>
                        Cancel
                    </Button>
                    &nbsp;
                    <Button className="app-btn secondary" 
                        type="primary"
                        htmlType="submit"
                        disabled={loading}
                    >
                        {loading && <LoadingOutlined />}
                        Submit
                    </Button>
                </Row>
                </Form>
            </Card>
        </Row>
        </Content>
        </Layout>
    );
    
}

export default withRouter(UbahDataPasien)