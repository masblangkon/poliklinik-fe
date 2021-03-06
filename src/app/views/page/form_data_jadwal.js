import React, { useEffect, useState } from "react";
import { withRouter, useHistory, NavLink} from 'react-router-dom';
import { Layout, Row, Col, Select, Breadcrumb, Card, Typography, Form, Input, Button, TimePicker } from 'antd';
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { dialog } from '../../component/alert'
import { APIServices }  from '../../service';

//import Dummy from '../../dummy/dummy'

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const FormDataJadwal = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const dataPoli = [
        {
            id_poli: 1,
            nama: "Umum"
        }, 
        {
            id_poli: 2,
            nama: "Gigi"
        }
    ]

    const [dataDokter, setDataDokter] = useState([]);

    useEffect(()=>{
        console.log(props.location);
        getDataDokter();
        if(props.location.state){
          form.setFieldsValue(props.location.state);
          let jam = props.location.state.jam_operasional.split('-', 5);
          form.setFieldsValue({jam_buka: (moment(jam[0], 'HH:mm')) });
          form.setFieldsValue({jam_tutup: (moment(jam[1], 'HH:mm')) });

          let _poli = []
          props.location.state.poli.map(res =>{
            return _poli.push(res.id_poli)
          })
          console.log(_poli)
          form.setFieldsValue({ poli: _poli });

          let _dokter = []
          props.location.state.dokter.map(res =>{
            return _dokter.push(res.id_dokter)
          })
          console.log(_dokter)
          form.setFieldsValue({ dokter: _dokter });
        }else{
          form.resetFields();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.state]);

    const getDataDokter = () => {
        setLoading(true);
        APIServices.getAllDokter().then(res => {
                if(res.data){
                    setDataDokter(res.data.data);
                    setLoading(false)
                }
            }).catch(err => {
                if(err){
                    //setDataDokter(Dummy.dataDokter);
                    console.log(err)
                    setLoading(false)
                }
            })
        }

    const onFinish= (values) => {
        setLoading(true);
        let body ={
            id_jadwal: props.location.state.id_jadwal,
            hari: values.hari,
            jam_operasional: values.jam_buka.format('HH:mm')+"-"+values.jam_tutup.format('HH:mm'),
            poli: values.poli,
            dokter: values.dokter
        }
        console.log(body);

        APIServices.putDataJadwal(body).then(res => {
            setLoading(false);
            if(res.data){
                history.goBack();
                dialog({icon: "success", title:"Ubah Data Jadwal Berhasil!"}).then(()=>{
                    console.log("Berhasil");
                })
            }
          }).catch(err => {
            setLoading(false);
            if(err){
                dialog({icon: "error", title:"Ubah Data Jadwal Gagal!"}).then(()=>{
                    console.log("Gagal");
                })
            }
          })
    }
    
    return(
        <Layout style={{backgroundColor: "#072A6F"}}>
        <Content className="layout-content">
        <Breadcrumb style={{marginLeft:40, marginBottom:20}} separator=">">
                <Breadcrumb.Item >
                    <NavLink to="/"> 
                        <Text className="title">
                            <HomeOutlined />
                        </Text>
                    </NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    <NavLink to="/profil-staf">  
                        <Text className="title">
                        Admin
                        </Text>
                    </NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <NavLink to="/kelola-informasi"> 
                        <Text className="title">
                            Kelola Informasi
                        </Text>
                    </NavLink>
                </Breadcrumb.Item>
            <Breadcrumb.Item>
                        <Text className="title">
                            Ubah Jadwal Pelayanan
                        </Text>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row justify="center">
            <Card className="form-card" style={{width:400, textAlign:"left"}}>
                <Row style={{marginBottom:20}}>
                    <Text className="title-tabel">
                        Ubah Jadwal Pelayanan
                    </Text>
                </Row>
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish}>
                    <Row justify="center">
                        <Col span={24}>
                            <Text className="title-label">Hari</Text>
                            <Form.Item name="hari" >
                                    <Input className="input-form secondary" disabled/>
                            </Form.Item>

                            <Text className="title-label">Jam Operasional</Text>
                            <Row>
                                <Form.Item name="jam_buka">
                                    <TimePicker className="input-form secondary" 
                                        clearIcon
                                        clearText
                                        allowClear={false}
                                        showNow={false}
                                        format='HH:mm'
                                        placeholder="Jam Buka"/>
                                </Form.Item>
                                <Text style={{padding:5}}>-</Text>
                                <Form.Item name="jam_tutup">
                                    <TimePicker className="input-form secondary" 
                                        clearText
                                        allowClear={false}
                                        showNow={false}
                                        format='HH:mm'
                                        placeholder="Jam Tutup"/>
                                </Form.Item>
                            </Row>
                            

                            <Text className="title-label">Poli</Text>
                                <Form.Item name="poli" rules={[{ required: true, message: "Harap pilih poli" }]}>
                                        <Select className="input-form secondary" mode="multiple" allowClear>
                                            {dataPoli.map(item => (
                                                <Option key={item.id_poli} value={item.id_poli}>
                                                    {item.nama}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item>

                            <Text className="title-label">Dokter</Text>
                            {/* <Form.List name="dokter">
                            {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                    <Row key={field.key} >
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, curValues) =>
                                                prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                            }
                                        >
                                            {() => (
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'dokter']}
                                                fieldKey={[field.fieldKey, 'dokter']}
                                                rules={field.fieldKey===0 ? [{ required: true }] : []}
                                            > */}
                                            <Form.Item name="dokter" rules={[{ required: true, message: "Harap pilih dokter" }]}>
                                                <Select className="input-form secondary" mode="multiple" allowClear style={{minHeight:"100%"}}>
                                                {dataDokter.map(item => (
                                                    <Option key={item.id_dokter} value={item.id_dokter}>
                                                        {item.nama}
                                                    </Option>
                                                ))}
                                                </Select>
                                            </Form.Item>
                                            {/* </Form.Item>
                                            )}
                                        </Form.Item>
                                        <MinusCircleOutlined style={{padding: 10}} onClick={() => remove(field.name)} />
                                       
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Tambah Dokter
                                    </Button>
                                </Form.Item>
                            </>
                            )}
                            </Form.List> */}
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

export default withRouter(FormDataJadwal)