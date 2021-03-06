import React, { useEffect, useState } from "react";
import { withRouter, NavLink, useHistory } from 'react-router-dom';
import { Breadcrumb, Row, Col, Card, Typography, Table, Button, Input, Select} from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from '@ant-design/icons';
import { dialog, deleteDialog } from '../../component/alert'
import { APIServices }  from '../../service';
import DetailPasien from '../modal/detail_pasien'
import FilterEkspor from '../modal/filter_ekspor'
import moment from 'moment';


const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const KelolaPasien = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [dataPasien, setDataPasien] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleModalEkspor, setVisibleModalEkspor] = useState(false);
    const [record, setRecord] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [filterKey, setFilterKey] = useState("");
    const [pagination, setPagination] = useState({current:1, pageSize:5, total:10});

    const gotoTambahDataPasien= () => {
        const loc = '/dashboard-admin/kelola-data-pengguna/pasien/tambah-data';
        history.push(loc);
    }

    const gotoUbahDataPasien = (data) => {
        const loc = '/dashboard-admin/kelola-data-pengguna/pasien/ubah-data';
        history.push({pathname:loc, state:data});
    }

    const handleModal = () => {
        setVisibleModal(!visibleModal);
    };

    const handleModalEkspor = () => {
        setVisibleModalEkspor(!visibleModalEkspor);
    };

    useEffect(()=>{
        getDataPasien(searchKey, filterKey, pagination.current,  pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey, filterKey]);

    const getDataPasien = (nama, kategori, current, limit) => {
        setLoading(true);
        APIServices.getAllDataPasien(nama, kategori, current, limit).then(res => {
                if(res.data){
                    let _data = Object.values(res.data.data)
                    let _meta = _data.pop()
                    console.log("Pagination: ", _meta)
                    setPagination({
                        current: _meta.pagination.current_page,
                        pageSize: _meta.pagination.per_page,
                        total: _meta.pagination.total
                    })
                    _data.forEach((item, idx) => {
                        _data[idx].no = ((current-1)*limit) + (idx+1);
                    })
                    setDataPasien(_data);
                    setLoading(false)
                }
            }).catch(err => {
                if(err){
                    //setDataPasien(Dummy.dataPasien);
                    console.log(err.response)
                    setLoading(false)
                }
            })
        }
    
    const deletePasien = (id) => {
        setLoading(true);
        APIServices.deleteDataPasien(id).then(res => {
                if(res.data){
                    dialog({icon: "success", title:"Hapus Data Pasien Berhasil!"}).then(()=>{
                        console.log("Berhasil");
                        getDataPasien(searchKey, filterKey, pagination.current, pagination.pageSize)
                    })
                }
            }).catch(err => {
                if(err){
                    console.log(err.response)
                    setLoading(false)
                    dialog({icon: "error", title:"Hapus Data Pasien Gagal!"}).then(()=>{
                        console.log("Gagal");
                    })
                }
            })
        }
    
    const handleTableChange = (_pagination) =>{
        getDataPasien(searchKey, filterKey, _pagination.current, _pagination.pageSize)
    }

    const columnsPasien = [
        {
            title: "No.",
            dataIndex: 'no',
            key: 'no',
            width: '20',
            align: 'center',
            sorter: (a, b) => a.no - b.no,
        },
        {
            title: "Kode Pasien",
            dataIndex: 'kode_pasien',
            key: 'kode_pasien',
            width: '20',
            align: 'center',
            sorter: (a, b) => a.kode_pasien - b.kode_pasien,
        },
        {
            title: "Nama Pasien",
            dataIndex: 'nama',
            key: 'nama',
            width: '20',
            align: 'center',
            sorter: (a, b) => a.nama - b.nama,
        },
        {
            title: "Kategori",
            dataIndex: 'kategori',
            key: 'kategori',
            width: '20',
            align: 'center',
            sorter: (a, b) => a.nama - b.nama,
        },
        {
            title: "Usia",
            dataIndex: 'tanggal_lahir',
            key: 'tanggal_lahir',
            align: 'center',
            sorter: (a, b) => a.tanggal_lahir - b.tanggal_lahir,
            render: (value) => {
                let usia = moment().diff(moment(value, 'YYYY-MM-DD'), 'years');;

                return (
                    <Text>{usia}</Text>
                )
            } 
        },
        {
            title: "Nomor Rekam Medis",
            children: [
                {
                    title: "Poli Gigi",
                    key: 'gigi',
                    align: 'center',
                    sorter: (a, b) => a.usia - b.usia,
                    render: (record) => {
                        let kode = "-"
                        if(record.kode_rekam_medis.length > 0){
                            record.kode_rekam_medis.forEach(val =>{
                                if(val.id_poli === 2){
                                    kode = val.kode_rekam_medis
                                }
                            })
                        }
                        return (
                            <Text>{kode}</Text>
                        )
                    }
                },
                {
                    title: "Poli Umum",
                    key: 'umum',
                    align: 'center',
                    sorter: (a, b) => a.usia - b.usia,
                    render: (record) => {
                        let kode = "-"
                        if(record.kode_rekam_medis.length > 0){
                            record.kode_rekam_medis.forEach(val =>{
                                if(val.id_poli === 1){
                                    kode = val.kode_rekam_medis
                                }
                            })
                        }
                        return (
                            <Text>{kode}</Text>
                        )
                    }
                }
            ]
        },
        {
            title: "Detail",
            align: 'center',
            render: (record) => {
                return (
                    <Row justify="center">
                        <Button
                            onClick={() => {
                                setRecord(record)
                                handleModal();
                            }}
                        >
                            <Text style={{color: "#000"}}>
                                <InfoOutlined style={{fontSize:20}}/>
                            </Text>
                        </Button>
                    </Row>
                )
            }
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
                            console.log(record);
                            gotoUbahDataPasien(record);
                        }}
                    >
                        <Text style={{color: "#000"}}>
                            <EditOutlined style={{fontSize:20}}/>
                        </Text>
                    </Button>
                  </Col>
                  <Col>
                    <Button 
                        onClick={() => {
                            deleteDialog({icon: "info", title:"Hapus Data Pasien", text: "Apakah Anda yakin akan menghapus data pasien ini?"}).then(()=>{
                                deletePasien(record.id_pasien);
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
        <>
                <Breadcrumb style={{marginLeft:20, marginBottom:20, marginTop:85}} separator=">">
                    <Breadcrumb.Item>
                        <NavLink to="/">  
                            <Text className="title">
                                <HomeOutlined />
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to="/dashboard-admin">  
                            <Text className="title">
                                Dashboard
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to="/dashboard-admin/kelola-data-pengguna/pasien">  
                            <Text className="title">
                                Kelola Data Pasien
                            </Text>
                        </NavLink>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <DetailPasien
                    dataPasien={record}
                    buttonCancel={handleModal}
                    visible={visibleModal}
                />

                <FilterEkspor
                    title="Data Pasien"
                    buttonCancel={handleModalEkspor}
                    visible={visibleModalEkspor}
                />

                <Row style={{width:"100%"}}>
                    <Col>
                        <Search 
                            allowClear
                            placeholder="Cari berdasarkan Nama Pasien" 
                            onChange={(e)=> setSearchKey(e.target.value)} 
                            style={{ width: 300, maxWidth:"90%", marginLeft: 20, marginBottom: 20, borderRadius: 20}}
                        />
                    </Col>
                    <Col>
                        <Select
                            allowClear
                            placeholder="Filter berdasarkan Kategori Pasien"
                            onChange={(val) => setFilterKey(val)}
                            style={{ width: 300, maxWidth:"90%", marginLeft: 20, marginBottom: 20, borderRadius: 20}}
                        >
                            <Option value="Umum">Umum</Option>
                            <Option value="Mahasiswa">Mahasiswa</Option>
                            <Option value="Staf/Dosen">Staf/Dosen</Option>
                            <Option value="Keluarga Staf/Dosen">Keluarga Staf/Dosen</Option>
                        </Select>
                    </Col>
                </Row>

                <Row style={{width:"100%", marginBottom:20, marginRight:20}}>
                    <Card className="informasi-card" style={{width:"100%"}}>
                        <Row style={{marginBottom:20}}>
                            <Text className="title-tabel">
                                Data Pasien
                            </Text>
                        </Row>
                        <Row justify="end">
                            <Button type='primary' className="app-btn secondary" info style={{marginTop: 10, marginRight: 10, backgroundColor:"#008000"}} 
                                onClick={() => {
                                    handleModalEkspor();
                                }}
                            >
                                Ekspor Data Pasien
                            </Button>
                            <Button type='primary' className="app-btn secondary" info style={{marginTop: 10}} 
                                onClick={() => {
                                    gotoTambahDataPasien();
                                }}
                            >
                                Tambah Data Pasien
                            </Button>
                        </Row>
                        <Table
                            columns={columnsPasien}
                            size="middle"
                            bordered={false}
                            loading={loading}
                            dataSource={dataPasien}
                            pagination={{...pagination, showSizeChanger: true}}
                            onChange={handleTableChange}
                            scroll={{ x: 500 }}
                        />
                    </Card>
                </Row>
            </>
    );
}

export default withRouter(KelolaPasien)