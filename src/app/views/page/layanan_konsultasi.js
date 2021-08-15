import React, {useState, useEffect} from "react";
import { withRouter } from 'react-router-dom';
import 'react-chat-elements/dist/main.css';
import { MessageList } from 'react-chat-elements'
import { Layout, Row, Col, Breadcrumb, Typography, Card, Menu, Image, Form, Input, Button, message, Upload } from 'antd';
import { HomeOutlined, SendOutlined, PaperClipOutlined} from '@ant-design/icons';
import UserImage from "../../../assets/userimage.jpg";
import { APIServices }  from '../../service';
import CONFIG from '../../service/config';
import moment from 'moment';

import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

const { Content } = Layout;
const { Text } = Typography;

const Konsultasi = () => {
    const [dataDokter, setDataDokter] = useState(null)
    const [dataPasien, setDataPasien] = useState(null)
    const [dataKonsultasi, setDataKonsultasi] = useState([])
    const [dataPesan, setDataPesan] = useState([ [] ])
    const [pesanType, setPesanType] = useState("text")
    const [formPesanInput] = Form.useForm();
    const [loadingCreateKonsultasi, setLoadingCreateKonsultasi] = useState(false)
    const [loadingKonsultasi, setLoadingKonsultasi] = useState(false)
    const [loadingPesan, setLoadingPesan] = useState(false)
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState(0);
    const [menukey, setMenuKey] = useState(0);

    /* RENDER WHEN EVENT PUSH */
    useEffect(()=>{
        window.Echo = new Echo({
            authEndpoint: "http://25.70.2.196:8000/laravel-websockets/auth",
            broadcaster: 'pusher',
            key: "anyKey",
            wsHost: "25.70.2.196",
            wssHost: "25.70.2.196",
            // wsHost: "http://api.kota101.studio",
            // wssHost: "https://api.kota101.studio",
            wsPort: 6001,
            wssPort: 6001,
            disableStats: true,
            forceTLS: true // Critical if you want to use a non-secure WebSocket connection
        });

        // let echo = window.Echo;
        // echo.channel('antre')
        //     .listen('AntreanSentUmum', (e) => {
                
        //         console.log(e);
        //     })
        //     .listen('AntreanUpdateUmum', (e) => {
        //         console.log(e);
                
        //     })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        let _role = JSON.parse(localStorage.getItem('role'));
        let login_time = JSON.parse(localStorage.getItem('login'));
        setRole(_role/login_time)

        if(_role/login_time === 2){
            getKonsultasi(JSON.parse(localStorage.getItem('id_dokter'), ""));
        } else if(_role/login_time === 3){
            getDataDokter();
        } 
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDataDokter = () => {
        setLoading(true);
        setLoadingKonsultasi(true);
        APIServices.getAllDokter().then(res => {
                if(res.data){
                    setDataDokter(res.data.data);
                    getKonsultasi("", JSON.parse(localStorage.getItem('id_pasien')), res.data.data);
                    console.log(res.data.data)
                    setLoading(false)
                }
            }).catch(err => {
                if(err){
                    console.log(err.response)
                    setLoading(false)
                }
            })
        }
    
    const getKonsultasi = (id_dokter, id_pasien, list_dokter) => {
        setLoadingKonsultasi(true);
        APIServices.getKonsultasi({id_dokter: id_dokter, id_pasien: id_pasien}).then(res => {
                if(res.data){
                    let _role = JSON.parse(localStorage.getItem('role'));
                    let login_time = JSON.parse(localStorage.getItem('login'));
                    
                    if(_role/login_time === 2){
                        let arr = []
                        res.data.data.forEach((val) => {
                            arr.push(val.pasien)
                        })
                        
                        console.log("arr1: ", arr)
                        getPesan(res.data.data[0].id_konsultasi, 0)
                        setDataKonsultasi(res.data.data);
                        setDataPasien(arr)
                    } else if (_role/login_time === 3){
                        
                        let arr = []

                        list_dokter.forEach((val_dokter) => {
                            let match = 0;
                            res.data.data.forEach((val_konsul => {
                                if(val_konsul.id_dokter === val_dokter.id_dokter){
                                    arr.push(val_konsul);
                                    match = 1;
                                } 
                            }))

                            if(match ===0){
                                arr.push([])
                            }
                        })
                        
                        console.log("arr2: ", arr)
                        getPesan(arr[0].id_konsultasi, 0)
                        setDataKonsultasi(arr);
                    }
                    
                    console.log(res.data.data)
                    setLoadingKonsultasi(false)
                }
            }).catch(err => {
                if(err){
                    //setDataDokter(Dummy.dataDokter);
                    message.info("Data Konsultasi tidak ditemukan")
                    console.log(err.response)
                    setLoadingKonsultasi(false)
                }
            })
        }
        
    const getPesan = (id_konsultasi, key) => {
        setLoadingPesan(true);
        APIServices.getPesan(id_konsultasi).then(res => {
                if(res.data){
                    let _dataPesan = [];
                    res.data.data[0].pesan.forEach((val) => {
                        
                        let messageBox = {
                            type: val.type,
                        }

                        if(val.type ==="text"){
                            messageBox.text = val.pesan
                        } else {
                            messageBox.data = {
                                uri: CONFIG.BASE_URL+"/"+val.pesan,
                            }
                        }

                        let a = moment(val.created_at, 'YYYY-MM-DD HH:mm:ss')
                        console.log(a)
                        let b = moment().startOf('day');

                        console.log(b)
                        console.log(moment.duration(a.diff(b)).asDays())
                        if( (moment.duration(a.diff(b)).asDays() >= 0)){
                            messageBox.dateString = moment(val.created_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
                        } else {
                            messageBox.dateString = moment(val.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
                        }

                        let id_pasien = JSON.parse(localStorage.getItem('id_pasien'))
                        let id_dokter = JSON.parse(localStorage.getItem('id_dokter'))
                        if((role === 3 && val.pengirim === "pasien") || (!!id_pasien && val.pengirim === "pasien")){
                            messageBox.position =  'right'
                            messageBox.status = 'sent'
                        } else if((role === 2 && val.pengirim === "dokter") || (!!id_dokter && val.pengirim === "dokter")){
                            messageBox.position = 'right'
                            messageBox.status = 'sent'
                        } else {
                            messageBox.position = 'left'
                        }

                        _dataPesan.push(messageBox)
                    })
                    let arr = dataPesan
                    arr[key] = _dataPesan
                    console.log("arr: ", arr)
                    setDataPesan(arr);
                    setLoadingPesan(false)
                }
            }).catch(err => {
                if(err){
                    message.info("Gagal memuat data pesan!")
                    console.log(err.response)
                    setLoadingPesan(false)
                }
            })
        }
    
    const handleGantiRuangKonsultasi = (key, data) => {
        setMenuKey(key); 
        
        if((dataKonsultasi[key].id_konsultasi !== undefined) && (dataPesan[key] === undefined)){
            console.log("get pesan")
            let arr = dataPesan;
            arr[key] = []
            setDataPesan(arr)
            getPesan(dataKonsultasi[key].id_konsultasi, key)
        }
        console.log("data_konsultasi: ", dataKonsultasi)
        console.log("data_pesan: ", dataPesan)
    } 

    const buatKonsultasi = (id_dokter) => {
        let body = {
            id_dokter: id_dokter,
            id_pasien: JSON.parse(localStorage.getItem('id_pasien'))
        }
        setLoadingCreateKonsultasi(true)
        APIServices.postKonsultasi(body).then(res => {
            setLoadingCreateKonsultasi(false)
            getKonsultasi(id_dokter, JSON.parse(localStorage.getItem('id_pasien')))
            if(res.data){
                console.log("Inisiasi konsultasi berhasil")
            }
          }).catch(err => {
            setLoadingCreateKonsultasi(false)
            if(err){
                // dialog({icon: "error", title:"Gagal Mengirim Pesan!"}).then(()=>{
                //     console.log(err);
                // })
            }
          })
    }
    
    const onFinishPesan = (values) => {
        if(values.pesan !== undefined && values.pesan !== " "){
            console.log("list pesan: ", dataPesan)
            let _dataPesan = [...dataPesan];
                _dataPesan[menukey].push(
                    {
                        position: 'right',
                        type: 'text',
                        text: values.pesan,
                        dateString: "Baru saja",
                        status: "waiting"
                    }
                )
            setDataPesan(_dataPesan)

            let body = {
                id_konsultasi: dataKonsultasi[menukey].id_konsultasi,
                pesan: values.pesan,
                type: "text"
            }
            APIServices.postPesan(body).then(res => {
                if(res.data){
                    console.log("Pesan berhasil dikirim!");
                    getPesan(dataKonsultasi[menukey].id_konsultasi, menukey)
                }
              }).catch(err => {
                if(err){
                    message.error("Gagal Mengirim Pesan!")
                    // dialog({icon: "error", title:"Gagal Mengirim Pesan!"}).then(()=>{
                    //     console.log(err);
                    // })
                }
              })
        }
        
        formPesanInput.resetFields()
    }

    const [uploading, setUploading] = useState()
    const [fileList, setFileList] = useState([])
    const uploadProps = {
      onRemove: file => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList)
          if(newFileList.length<1){
            setPesanType("text")
          }
          return {
            fileList: newFileList,
          };
      },
      beforeUpload: file => {
          setFileList([...fileList, file])
          return false;
      },
      fileList,
      listType: "picture"
    };

    const uploadProps2 = {
        beforeUpload: file => {
            setFileList([...fileList, file])
            setPesanType("image")
            console.log(file)
            return false;
        },
        fileList,
        showUploadList: false
    }

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('image', file);
          console.log("file: ", file)
        });

        console.log(formData)
        console.log(fileList[0])
        setUploading(true)

        let _dataPesan = [...dataPesan];
        _dataPesan[menukey].push(
            {
                position: 'right',
                type:'photo',
                data: {
                    uri: fileList[0].name,
                },
                dateString: "Baru saja",
                status: "waiting"
            }
        )
        setDataPesan(_dataPesan)
        setFileList([])
        setPesanType("text")
        // POST IMAGE
        APIServices.postImage(formData).then(res => {
            if(res.data){
                console.log(res.data)

                let body = {
                    id_konsultasi: dataKonsultasi[menukey].id_konsultasi,
                    pesan: res.data.url,
                    type: "photo"
                }
                APIServices.postPesan(body).then(res => {
                    if(res.data){
                        console.log("Berhasil Mengirim Pesan!");
                        getPesan(dataKonsultasi[menukey].id_konsultasi, menukey)
                    }
                }).catch(err => {
                    if(err){
                        message.error("Gagal Mengirim Pesan!")
                    }
                })
            }
          }).catch(err => {
            if(err){
                message.error("Gagal Mengirim Pesan!")
            }
          })
      };

    return(
        <Layout style={{backgroundColor: "#072A6F", minWidth:700, minHeight:"100vh"}}>
            <Content className="layout-content-new">
                <Breadcrumb style={{marginTop: 10, marginLeft:40, marginBottom:20, color:"#FFF"}} separator=">">
                    <Breadcrumb.Item href="/">
                        <Text className="title">
                            <HomeOutlined />
                        </Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/konsultasi-online">
                        <Text className="title">
                            <span>Konsultasi Online</span>
                        </Text>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Row style={{marginBottom:20, marginRight:20}}>
                    <Card className="konsultasi-card" bodyStyle={{padding:0}} style={{width:"100%", minHeight: 500, marginLeft:40}}>
                        {/* RUANG KONSULTASI PASIEN */}
                        {(role === 3) &&
                            <Row>
                            <Col span={7}>
                                {/* LIST DOKTER */}
                                <Row style={{marginLeft:20, marginTop: 10}}>
                                    <Text style={{color:"#EB3D00", fontWeight:"bold"}}>List Dokter</Text>
                                </Row>
                                {!!dataDokter &&
                                <Menu
                                    defaultSelectedKeys={['0']}
                                    mode="inline"
                                >
                                    {dataDokter.map((res, idx) =>{
                                        return(
                                            <Menu.Item key={idx} onClick={(item) => {console.log(item); handleGantiRuangKonsultasi(Number(item.key), res);}}>
                                                <Row>
                                                    <Image
                                                        style={{marginTop:5, marginRight:10, width: 30, height: 30, borderRadius: 90}}
                                                        alt={"avatar"}
                                                        src={CONFIG.BASE_URL+"/"+res.avatar}
                                                        preview={false}
                                                    />
                                                    <Text style={{color:"#EB3D00"}}>{res.spesialisasi==="Umum" ? "dr. " : "drg. "} {res.nama}</Text>
                                                </Row>
                                            </Menu.Item>
                                        )
                                    })}
                                </Menu>
                                }
                            </Col>

                            {/* RUANG KONSULTASI */}
                            <Col span={17} style={{height: 500, borderLeft:"4px solid #8F8F8F", backgroundColor:"#F8F8F8"}}>
                                <Row style={{marginLeft:20, marginTop: 10}}>
                                    <Text style={{color:"#EB3D00", fontWeight:"bold"}}>Ruang Konsultasi</Text>
                                </Row>
                                {!!dataDokter && 
                                <Row style={{marginLeft:20}}>
                                    <Image
                                        style={{marginTop:5, marginRight:10, width: 30, height: 30, borderRadius: 90}}
                                        alt={"avatar"}
                                        src={CONFIG.BASE_URL+"/"+dataDokter[menukey].avatar}
                                    />
                                    <Text style={{color:"#EB3D00", marginTop:5}}>{dataDokter[menukey].spesialisasi==="Umum" ? "dr. " : "drg. "} {dataDokter[menukey].nama}</Text>
                                </Row>
                                }
                                <div style={{width: "100%", borderBottom:"4px solid #8F8F8F", marginTop: 10, marginBottom: 20}}></div>
                                
                                {  loadingKonsultasi ?
                                    <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                        <Col>
                                        <Row justify="center">    
                                            <Text>
                                                Memuat data konsultasi . . . 
                                            </Text>
                                        </Row>
                                        </Col>
                                    </Row>
                                : (dataKonsultasi[menukey].id_konsultasi !== undefined) ? 

                                    /* LIST PESAN */
                                    (loadingPesan && dataPesan[menukey].length === 0) ?
                                        <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                            <Col>
                                            <Row justify="center">    
                                                <Text>
                                                    Memuat data pesan . . . 
                                                </Text>
                                            </Row>
                                            </Col>
                                        </Row>
                                    :
                                        <>
                                        {(dataPesan[menukey].length === 0) ?
                                            <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                                <Col>
                                                <Row justify="center">    
                                                    <Text>
                                                        Anda belum pernah mengirim pesan
                                                    </Text>
                                                </Row>
                                                </Col>
                                            </Row>
                                            :
                                            <Row style={{width:"100%",height: 340, overflowY:"scroll", top:340, marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                                <MessageList
                                                    className='message-list'
                                                    lockable={false}
                                                    toBottomHeight={'100%'}
                                                    dataSource={dataPesan[menukey]} 
                                                    style={{width:500}}
                                                    />
                                            </Row>
                                        }
                                        
                                        <Form form={formPesanInput} onFinish={onFinishPesan}>
                                            <Row style={{marginLeft:20}}>
                                                <Col xl={20} lg={18} md={16} sm={14} xs={14}>
                                                    {pesanType==="text" ?
                                                        <Form.Item name="pesan">
                                                            <Input style={{borderRadius: 10}} focus={true} autoFocus={true}
                                                                placeholder="Ketik pesan anda . . ."
                                                            />
                                                        </Form.Item>
                                                    :
                                                        <Upload {...uploadProps} style={{paddingBottom: 20}}>

                                                        </Upload>
                                                    }
                                                </Col>
                                            
                                                <Col xl={4} lg={6} md={8} sm={10} xs={10}>
                                                    <Row>
                                                        <Upload {...uploadProps2}>
                                                            <Button type="text" onClick={()=>{console.log("ATTACH FILE")}} >
                                                                <Text>
                                                                    <PaperClipOutlined style={{fontSize:25, color: "#EB3D00"}}/>
                                                                </Text>
                                                            </Button>
                                                        </Upload>
                                                        
                                                        <Button type="text" htmlType="submit" >
                                                            <Text>
                                                                <SendOutlined style={{fontSize:25, color: "#EB3D00"}}/>
                                                            </Text>
                                                        </Button>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Form>
                                        </>
                                    /*END OF LIST PESAN */
                                :
                                    (!!dataDokter) &&
                                    <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                        <Col>
                                        <Row justify="center">    
                                            <Text>
                                                Anda belum pernah melakukan konsultasi dengan 
                                                <b>{dataDokter[menukey].spesialisasi==="Umum" ? " dr. " : " drg. "}
                                                {dataDokter[menukey].nama}</b>
                                            </Text>
                                        </Row>
                                        <Row justify="center">
                                            <Button type='primary' className="app-btn secondary" info style={{marginTop: 10}} 
                                                loading={loadingCreateKonsultasi}
                                                onClick={() => {
                                                    buatKonsultasi(dataDokter[menukey].id_dokter);
                                                }}
                                                >
                                                Konsultasi Sekarang
                                            </Button>
                                        </Row>
                                        </Col>
                                    </Row>
                                }
                            </Col>
                            </Row>
                        }


                        {/* RUANG KONSULTASI DOKTER */}
                        {(role === 2) &&
                            <Row>
                            <Col span={7}>
                                {/* LIST PASIEN */}
                                <Row style={{marginLeft:20, marginTop: 10}}>
                                    <Text style={{color:"#EB3D00", fontWeight:"bold"}}>List Pasien</Text>
                                </Row>
                                {!!dataPasien &&
                                <Menu
                                    defaultSelectedKeys={['0']}
                                    mode="inline"
                                >
                                    {dataPasien.map((res, idx) =>{
                                        return(
                                            <Menu.Item key={idx} onClick={(item) => {console.log(item); handleGantiRuangKonsultasi(Number(item.key), res);}}>
                                                <Row>
                                                    <Image
                                                        style={{marginTop:5, marginRight:10, width: 30, height: 30, borderRadius: 90}}
                                                        alt={"avatar"}
                                                        src={UserImage}
                                                        preview={false}
                                                    />
                                                    <Text style={{color:"#EB3D00"}}> {res.nama}</Text>
                                                </Row>
                                            </Menu.Item>
                                        )
                                    })}
                                </Menu>
                                }
                            </Col>

                            {/* RUANG KONSULTASI */}
                            <Col span={17} style={{height: 500, borderLeft:"4px solid #8F8F8F", backgroundColor:"#F8F8F8"}}>
                                <Row style={{marginLeft:20, marginTop: 10}}>
                                    <Text style={{color:"#EB3D00", fontWeight:"bold"}}>Ruang Konsultasi</Text>
                                </Row>
                                {!!dataPasien && 
                                <Row style={{marginLeft:20}}>
                                    <Image
                                        style={{marginTop:5, marginRight:10, width: 30, height: 30, borderRadius: 90}}
                                        alt={"avatar"}
                                        src={UserImage}
                                    />
                                    <Text style={{color:"#EB3D00", marginTop:5}}>{dataPasien[menukey].nama}</Text>
                                </Row>
                                }
                                <div style={{width: "100%", borderBottom:"4px solid #8F8F8F", marginTop: 10, marginBottom: 20}}></div>
                                
                                {  loadingKonsultasi ?
                                    <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                        <Col>
                                        <Row justify="center">    
                                            <Text>
                                                Memuat data konsultasi . . . 
                                            </Text>
                                        </Row>
                                        </Col>
                                    </Row>
                                : (dataKonsultasi[menukey].id_konsultasi !== undefined) ? 

                                    /* LIST PESAN */
                                    (loadingPesan && dataPesan[menukey].length === 0) ?
                                        <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                            <Col>
                                            <Row justify="center">    
                                                <Text>
                                                    Memuat data pesan . . . 
                                                </Text>
                                            </Row>
                                            </Col>
                                        </Row>
                                    :
                                        <>
                                        {(dataPesan[menukey].length === 0) ?
                                            <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                                <Col>
                                                <Row justify="center">    
                                                    <Text>
                                                        Anda belum pernah mengirim pesan
                                                    </Text>
                                                </Row>
                                                </Col>
                                            </Row>
                                            :
                                            <Row style={{width:"100%",height: 340, overflowY:"scroll", top: 0, flexDirection:"collumn", display:"flex", verticalAlign:"initial", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                                <MessageList
                                                    className='message-list'
                                                    lockable={false}
                                                    // toBottomHeight={'100%'}
                                                    dataSource={dataPesan[menukey]} 
                                                    style={{width:500}}
                                                    />
                                            </Row>
                                        }
                                        
                                        <Form form={formPesanInput} onFinish={onFinishPesan}>
                                            <Row style={{marginLeft:20}}>
                                                <Col xl={20} lg={18} md={16} sm={14} xs={14}>
                                                    {pesanType==="text" ?
                                                        <Form.Item name="pesan">
                                                            <Input style={{borderRadius: 10}} focus={true} autoFocus={true}
                                                                placeholder="Ketik pesan anda . . ."
                                                            />
                                                        </Form.Item>
                                                    :
                                                        <Upload {...uploadProps} style={{paddingBottom: 20}}>

                                                        </Upload>
                                                    }
                                                </Col>
                                            
                                                <Col xl={4} lg={6} md={8} sm={10} xs={10}>
                                                    <Row>
                                                        <Upload {...uploadProps2}>
                                                            <Button type="text" onClick={()=>{console.log("ATTACH FILE")}} >
                                                                <Text>
                                                                    <PaperClipOutlined style={{fontSize:25, color: "#EB3D00"}}/>
                                                                </Text>
                                                            </Button>
                                                        </Upload>
                                                        
                                                        {pesanType==="text" ?
                                                            <Button type="text" htmlType="submit" >
                                                                <Text>
                                                                    <SendOutlined style={{fontSize:25, color: "#EB3D00"}}/>
                                                                </Text>
                                                            </Button>
                                                            :
                                                            <Button type="text" onClick={()=> {handleUpload()}} >
                                                                <Text>
                                                                    <SendOutlined style={{fontSize:25, color: "#EB3D00"}}/>
                                                                </Text>
                                                            </Button>
                                                        }
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Form>
                                        </>
                                    /*END OF LIST PESAN */
                                :
                                    (!!dataPasien) &&
                                    <Row justify="center" align="middle" style={{width:"100%", height: 340, overflowY:"scroll", marginBottom: 10, backgroundColor:"#F8F8F8"}}>
                                        <Col>
                                        <Row justify="center">    
                                            <Text>
                                                Anda belum pernah menerima permintaan konsultasi dari Pasien
                                            </Text>
                                        </Row>
                                        </Col>
                                    </Row>
                                }
                            </Col>
                            </Row>
                        }
                    </Card>
                </Row>
            </Content>
        </Layout>
    );
}

export default withRouter(Konsultasi)