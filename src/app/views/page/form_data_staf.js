import React, { useEffect, useState } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { Layout, Row, Col, Breadcrumb, Card, Typography, Form, Input, Upload, Button, message } from 'antd';
import { HomeOutlined, LoadingOutlined, UploadOutlined, CheckCircleFilled } from '@ant-design/icons';
import { dialog } from '../../component/alert'
import { APIServices } from '../../service'
import CONFIG from '../../service/config';

const { Content } = Layout;
const { Text } = Typography;

const FormDataStaf = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadInfo, setUploadInfo] = useState("");

    useEffect(()=>{
        console.log(props.location)
        if(props.location.state){
          form.setFieldsValue(props.location.state);
        }else{
          form.resetFields()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish= (values) => {
        setLoading(true);
        let createBody ={
            no_telepon: values.no_telepon,
            password: "admin123",
            role: 1
        }

        let body ={
            avatar: uploadInfo.response ? uploadInfo.response.url : "aaa.jpg",
            nama: values.nama,
            jabatan: values.jabatan,
        }
        console.log("Body: ", body);
        console.log("Tes: ", UploadProps)

        //
        if(props.location.state){
            body.no_telepon = "081285051111";
            APIServices.putDataStaf(body).then(res => {
                setLoading(false);
                if(res.data){
                    history.goBack();
                    dialog({icon: "success", title:"Ubah Data Staf Berhasil!"}).then(()=>{
                        console.log("Berhasil");
                    })
                }
              }).catch(err => {
                setLoading(false);
                if(err){
                    dialog({icon: "error", title:"Ubah Data Staf Gagal!"}).then(()=>{
                        console.log("Gagal");
                    })
                }
              })
        } else {
            APIServices.register(createBody).then(res => {
                setLoading(false);
                if(res.data){
                    APIServices.postDataStaf(body).then(res => {
                        setLoading(false);
                        if(res.data){
                            history.goBack();
                            dialog({icon: "success", title:"Tambah Data Staf Berhasil!"}).then(()=>{
                                console.log("Berhasil");
                            })
                        }
                      }).catch(err => {
                        setLoading(false);
                        if(err){
                            dialog({icon: "error", title:"Tambah Data Staf Gagal!"}).then(()=>{
                                console.log("Gagal");
                            })
                        }
                      })
                }
              }).catch(err => {
                setLoading(false);
                if(err){
                    dialog({icon: "error", title:"Tambah Data Staf Gagal!"}).then(()=>{
                        console.log("Gagal");
                    })
                }
              })
            
        }
        
    }

    const UploadProps = {
        name: 'file',
        action: CONFIG.BASE_URL+'/api/upload/uploadAvatar',
        enctype: "multipart/form-data",
        headers: {
            authorization: 'authorization-text',
          },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            setUploadInfo(info.file);
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
    
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
                <Breadcrumb.Item href="/kelola-data-pengguna/staf">
                    <Text className="title">
                        Kelola Data Staf
                    </Text>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Text className="title">
                        {props.match.params.aksi === "ubah-data" ? "Ubah Data" : "Tambah Data"}
                    </Text>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row justify="center">
            <Card className="form-card" style={{width: 400, textAlign:"left"}}>
                <Row>
                        <Text className="title-tabel">
                            {props.match.params.aksi === "ubah-data" ? "Ubah Data" : "Tambah Data"}
                        </Text>
                    </Row>
                <Form form={form} name="control-hooks" onFinish={onFinish}>
                    <Row justify="center">
                        <Col span={24}>
                                <Text className="title-label">ID Staf</Text>
                                <Form.Item name="id_staf" >
                                        <Input className="input-form secondary" disabled/>
                                </Form.Item>

                                <Text className="title-label">Nomor Telepon</Text>
                                <Form.Item name="no_telepon"
                                    //rules={[{ required: true, message: "Harap masukkan nomor telepon" }]}
                                >
                                        <Input className="input-form secondary" disabled={props.location.state}/>
                                </Form.Item>

                                <Text className="title-label">Foto</Text>
                                <Form.Item name="avatar" 
                                    rules={[{ required: true, message: "Harap unggah foto"  }]}
                                >
                                    <Upload {...UploadProps}>
                                        <Button>
                                            <UploadOutlined /> Unggah Foto
                                            {!!form.getFieldValue(['avatar']) && <CheckCircleFilled style={{ color: '#27ae60', marginLeft: '1em'}}/>}
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Text className="title-label">Nama Staf</Text>
                                <Form.Item name="nama" 
                                    rules={[{ required: true, message: "Harap masukkan nama" }]}
                                >
                                        <Input className="input-form secondary" />
                                </Form.Item>

                                <Text className="title-label">Jabatan</Text>
                                        <Form.Item name="jabatan" 
                                            rules={[{ required: true, message: "Harap masukkan jabatan" }]}
                                        >
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

export default withRouter(FormDataStaf)