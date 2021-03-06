import React, { useEffect, useState } from "react";
import { withRouter, useHistory, NavLink} from 'react-router-dom';
import { Layout, Row, Col, Breadcrumb, Card, Typography, Form, Input, Upload, Select, Button, message } from 'antd';
import { HomeOutlined, LoadingOutlined, UploadOutlined, CheckCircleFilled } from '@ant-design/icons';
import { dialog } from '../../component/alert'
import { APIServices } from '../../service'
import CONFIG from '../../service/config';

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const FormDataStaf = (props) => {
    const history = useHistory();
    const [formDataStaf] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadInfo, setUploadInfo] = useState("");

    const [path, setPath] = useState("");
    const [role, setRole] = useState(4);

    useEffect(()=>{
        let _role = JSON.parse(localStorage.getItem('role'));
        let login_time = JSON.parse(localStorage.getItem('login'));
        setRole(_role/login_time)

        console.log(_role/login_time)
        if(_role/login_time === 1){
            setPath("/dashboard-admin");
        } else if(_role/login_time === 4){
            setPath("/dashboard-staf-umum");
        } else {
            setPath("/dashboard-perawat")
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        console.log(props.location)
        if(props.location.state){
            formDataStaf.setFieldsValue(props.location.state);
        }else{
            formDataStaf.resetFields()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location]);

    const onFinishDataStaf= (values) => {
        setLoading(true);

        let _role = 0;
        if(values.kategori_staf === "Petugas Administrasi"){
            _role = 1;
        } else if(values.kategori_staf === "Perawat"){
            _role = 5;
        } else {
            _role = 4;
        }

        let createBody ={
            no_identitas: values.no_identitas,
            no_telepon: values.no_telepon,
            password: "admin123",
            role: _role,
            status: 1
        }

        let body ={
            no_identitas: values.no_identitas,
            no_telepon: values.no_telepon,
            avatar: uploadInfo.response && uploadInfo.response.url,
            nama: values.nama,
            jabatan: values.jabatan,
        }
        console.log("Body: ", body);

        //
        if(props.location.state){
            body.id_staf = props.location.state.id_staf;
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
                    console.log(err);
                    dialog({icon: "error", title:"Buat Akun Staf Gagal!"}).then(()=>{
                        console.log("Gagal");
                    })
                }
              })
            
        }
        
    }

    const UploadProps = {
        name: 'image',
        action: CONFIG.BASE_URL+'/api/upload/postUploadAvatar',
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
            {props.location.pathname !== "/dashboard-staf/edit-profil" &&
                <Breadcrumb style={{marginLeft:40, marginBottom:20}} separator=">">
                    <Breadcrumb.Item >
                        <NavLink to="/"> 
                            <Text className="title">
                                <HomeOutlined />
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <NavLink to={`${path}`}>  
                            <Text className="title">
                            Admin
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`${path}/kelola-data-pengguna/staf`}> 
                            <Text className="title">
                                Kelola Data Staf
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                </Breadcrumb> 
            }

            <Row justify="center">
            <Card className="form-card" style={{width: 400, textAlign:"left"}}>
                <Row>
                        <Text className="title-tabel">
                            {   props.location.pathname === `${path}/edit-profil` ? "Edit Profil" 
                                :
                                props.match.params.aksi === "ubah-data" ? "Ubah Data" : "Tambah Data"
                            }
                        </Text>
                    </Row>
                <Form form={formDataStaf} initialValues={props.location.state} name="control-hooks" onFinish={onFinishDataStaf}>
                    <Row justify="center">
                        <Col span={24}>
                                {props.location.state &&
                                    <div>
                                    <Text className="title-label">ID Staf</Text>
                                    <Form.Item name="id_staf" >
                                            <Input className="input-form secondary" disabled/>
                                    </Form.Item>

                                    
                                    </div>
                                } 
                                <Text className="title-label">Nomor Identitas</Text>
                                    <Form.Item name="no_identitas" 
                                    rules={[
                                        { required: true, message: "Harap masukkan nomor identitas" },
                                        { pattern: new RegExp('^[0-9]+$'),  message: 'Harap hanya masukkan angka!'},
                                    ]}
                                    >
                                            <Input className="input-form secondary" 
                                            disabled={props.location.state}
                                            placeholder="Masukkan nomor identitas"/>
                                    </Form.Item>

                                <Text className="title-label">Nomor Telepon</Text>
                                <Form.Item name="no_telepon"
                                    rules={[
                                        { required: true, message: "Harap masukkan nomor telepon" },
                                        { pattern: new RegExp('^[0-9]+$'),  message: 'Harap hanya masukkan angka!'},
                                    ]}
                                >
                                        <Input className="input-form secondary" placeholder="Masukkan nomor telepon"/>
                                </Form.Item>

                                {!props.location.state &&
                                    <div>
                                    <Text className="title-label">Password</Text>
                                    <Form.Item name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Harap masukkan password Anda!'
                                            },
                                            {
                                                pattern: new RegExp('[a-zA-Z0-9]{8,}$'),
                                                message: "Harap masukkan 8 karakter atau lebih"
                                            }
                                        ]}
                                    >
                                        <Input.Password className="input-form secondary"
                                            placeholder="Masukkan 8 karakter atau lebih" 
                                        />
                                    </Form.Item>

                                    <Text className="title-label">Konfirmasi Password</Text>
                                    <Form.Item name="confirmPassword"
                                        dependencies={['password']}
                                        rules={[
                                            { 
                                                required: true, message: 'Harap konfirmasi password!' 
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                    }
                                    
                                                    return Promise.reject('Password tidak cocok!');
                                                },
                                            }),
                                        ]}
                                        >
                                        <Input.Password className="input-form secondary" 
                                            placeholder="Masukkan ulang password"
                                        />
                                    </Form.Item>
                                    </div>
                                }

                                <Text className="title-label">Foto</Text>
                                {/* {props.location.state && 
                                    <div>
                                    <Image src={CONFIG.BASE_URL+"/"+(form.getFieldValue(['avatar'] || props.location.state.avatar))}  
                                        preview={false}
                                        alt={form.getFieldValue(['avatar'] || props.location.state.avatar)}
                                        className="image-profil"
                                    />
                                    </div>
                                } */}
                                <Form.Item name="avatar" 
                                    rules={[{ required: true, message: "Harap unggah foto"  }]}
                                >
                                    <Upload {...UploadProps}>
                                        <Button>
                                            <UploadOutlined /> {(!!formDataStaf.getFieldValue(['avatar']) || props.location.state) ? "Ubah Foto" : "Unggah Foto"}
                                            {(!!formDataStaf.getFieldValue(['avatar']) || props.location.state) && <CheckCircleFilled style={{ color: '#27ae60', marginLeft: '1em'}}/>}
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Text className="title-label">Nama Staf</Text>
                                <Form.Item name="nama" 
                                    rules={[
                                        { required: true, message: "Harap masukkan nama!" },
                                        { pattern: new RegExp('[a-zA-Z]$'), message: "Harap hanya masukkan huruf!" },
                                    ]}>
                                        <Input className="input-form secondary" 
                                        placeholder="Masukkan nama"/>
                                </Form.Item>

                                <Text className="title-label">Jabatan</Text>
                                    <Form.Item name="jabatan" 
                                        rules={[{ required: true, message: "Harap pilih jabatan!"  }]}
                                    >
                                        <Select defaultValue="Pilih Kategori" className="input-form" >
                                            <Option key={1} value="Petugas Administrasi">Petugas Administrasi</Option>
                                            <Option key={2} value="Perawat">Perawat</Option>
                                            <Option key={3} value="Staf Umum">Staf Umum</Option>
                                        </Select>
                                    </Form.Item>

                                {}
                                    {/* <Form.Item name="staf_umum" 
                                        rules={[{ required: true, message: "Harap masukkan jabatan" }]}
                                    >
                                        <Input className="input-form secondary" 
                                        placeholder="Masukkan jabatan"/>
                                    </Form.Item> */}
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