import { FaCheck} from "react-icons/fa";
import { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import { Typography, DatePicker, Button,Table, Input, Select } from "antd";
import axios from 'axios';
import ReadyAnimation from "../../Components/ReadyAnimation";
import StockAnimation from "../../Components/StockAnimation";
import RetourAnimation from "../../Components/RetourEnStockAnimation";
import PayedAnimation from "../../Components/payedAnimation";
import LoadingAnimation from "../../Components/LoadingAnimation";
import CancelledAnimation from "../../Components/CancelledAnimation";
import MyLottieAnimation from "../../Components/CarAnimation";
import RetourEnStockAnimation from "../../Components/RetourEnStockAnimation";
import DoneAnimation from "../../Components/DoneAnimation";
import '../../App.css';
import MiniDrawerfourisseur from "../../Layouts/sideBarFournisseur";
import React from "react";
import { Box } from "@mui/material";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

function Homepage() {
    const [statusDistribution, setStatusDistribution] = useState({});
    const [dateRange, setDateRange] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [statusCounts, setStatusCounts] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date()); // État pour stocker la date système

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Récupérez le jeton d'accès depuis le stockage local (ou d'où vous l'avez stocké)
            try {
                const response = await axios.get('http://localhost:3000/listerColisFournisseur', {
                    headers: {
                        'x-access-token': localStorage.getItem('token'),
                      },
                });
                setData(response.data.colisList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        updateStatusCounts();
    }, [data]);

    const updateStatusCounts = () => {
        const counts = {};
        data.forEach(item => {
            counts[item.status] = (counts[item.status] || 0) + 1;
        });
        setStatusCounts(counts);
    };


    const handleSearch = (value) => {
        setSearchQuery(value);
        const filteredData = data.filter((item) =>
          Object.values(item).some((val) => {
            if (typeof val === "string") { // Vérifiez si val est une chaîne de caractères
              return val.toLowerCase().includes(value.toLowerCase());
            }
            return false; // Si val n'est pas une chaîne de caractères, ne filtre pas
          })
        );
        setFilteredData(filteredData);
      };
      
    const columns = [

        {
            title: "Nom",
            dataIndex: "nomClient",
            key: "nomClient",
        },
        {
            title: "Prenom",
            dataIndex: "prenomClient",
            key: "prenomClient",
        },
        {
            title: "Destination",
            dataIndex: "destination",
            key: "destination",
        },
        {
            title: "Numéro ",
            dataIndex: "num_client",
            key: "num_client",
        },
        {
            title: "Date de Création",
            dataIndex: "date_creation",
            key: "date_creation",
        },
        {
            title: "Prix",
            dataIndex: "prix",
            key: "prix",
        },
        {
            title: "Type de Paiement",
            dataIndex: "typeDePayment",
            key: "typeDePayment",
        },


        {
            title: "Status",
            dataIndex: "status",
            key: "status"

        }
    ];


    const filteredDataByStatus = data.filter((item) => {
        if (selectedStatus === "All") {
            return true;
        } else {
            return item.status === selectedStatus;
        }
    });

    

    const handleStatusChange = (status) => {
        setSearchQuery(""); // Réinitialise la recherche
      
        if (status === "All") {
          setSelectedStatus("All");
          setFilteredData(data); // Affiche toutes les colis
        } else if (status === "created") {
          setSelectedStatus("created");
          const createdData = data.filter((item) => item.status === "Créé");
          setFilteredData(createdData);
        } else {
          setSelectedStatus(status);
          const filteredData = data.filter((item) => {
            if (status === "All") {
              return true;
            } else {
              return item.status === status;
            }
          });
          setFilteredData(filteredData);
        }
      };
      
    
    

    

    function getStatusIcon(status) {
        switch (status) {
            case 'en stock':
                return <StockAnimation size={40} color="white" />;
            case 'en cours':
                return <MyLottieAnimation size={40} color="white" />;
            case 'livré':
                return <PayedAnimation size={40} color="white" />;
            case 'en attente':
                return <ReadyAnimation size={40} color="white"  />;
            case 'retour en stock':
                return <RetourEnStockAnimation size={40} color="white" />;
            case 'retour au fournisseur':
                return <RetourAnimation size={40} color="white" />;
            case 'livré et payé':
                return <PayedAnimation size={40} color="white" />;
            case 'en pickup':
                return <LoadingAnimation size={40} color="white" />; // Shopping cart icon for Pickup status
            case 'annulé':
                return <CancelledAnimation size={40} color="white" />;
            case 'payé':    
                return <DoneAnimation size={40} color="white" />
            default:
                return null;
        }
    }


    const getStatusColor = (status) => {
        switch (status) {
            case 'en stock':
                return '#4caf50'; // Vert
            case 'en cours':
                return '#ffc107'; // Jaune
            case 'livré':
                return '#f44336'; // Rouge
            case 'en attente':
                return '#fff236 '; // Jaune pâle
            case 'retour en stock':
                return '#7f00ff'; // Violet
            case 'retour au fournisseur':
                return '#2196f3'; // Rouge foncé
            case 'livré et payé':
                return '#4caf50'; // Vert (même que En stock)
            case 'en pickup':
                return '#ff9800'; // Orange
            case 'annulé':
                return '#f44336'; // Rouge (même que Livrés)
            case 'payé':
                return '#FF8042'; // Bleu
            // case 'echange livré':
            //     return '#2196f3'; // Bleu (même que Echange crée)
            default:
                return 'transparent';
        }
    };

    useEffect(() => {
        // Mettez à jour la date système toutes les secondes
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    
    return (
        <>
            <MiniDrawerfourisseur/>

        <div className="homepage-container" style={{ marginTop: 50, padding: 1, position: 'relative', width: 1300, marginLeft: '200px', left: 140}}>
            <Title level={2} className="centered">
                Welcome to Delivery
            </Title>
            <div className="filter-container">
            <p>Date : {currentDate.toLocaleString()}</p>

            </div>

            <div className="button-section" >
                <Button
                    
                    type="primary"
                    className="status-button"
                    onClick={() => handleStatusChange("created")}
                    style={{ width: '150px', height: '50px' }} // Ajoutez ces styles pour fixer la taille du bouton
    >            
                    <FaCheck className="button-icon" />
                    Créé
                </Button>
                <Box sx={{ mx: '3%', mt: '3%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center' ,marginLeft:'10px'}}>

                <Grid sx={{ p: 3 }} item xs={12} container spacing={0.5} >
                    
                    
                
                    {['en attente' , 'en stock', 'en cours', 'retour en stock', 'livré', 'en pickup',
                      'annulé', 'retour au fournisseur', 'livré et payé', 'payé'].map((status) => (
                        <Button
                        className="status-button"
                            key={status}
                            elevation={3}
                            sx={{p: 1,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: getStatusColor(status),
                            transition: 'background-color 0.3s ease-in-out',
                            cursor: 'pointer', // Add pointer cursor
                            '&:hover': {
                                boxShadow: 'inset 0 0 0 2em var(--hover)',
                                transform: 'translateY(-0.25em)',
                                backgroundColor: '#3D246C',
                                cursor: 'pointer',
                            },
                        }} 
                            item xs={2}
                            size="large"
                            type="primary"
                            
                            style={{width: '250px', height: '150px',background: getStatusColor(status), borderColor: getStatusColor(status) }}
                            onClick={() => handleStatusChange(status)}
                        >
                            <span className="status-icon">{getStatusIcon(status)}</span>
                            {status}
                            <span className="status-badge">{statusCounts[status]}</span>
                        </Button>

                    ))}
                    
                
                </Grid>
                </Box>

            </div>

            <div className="table-container">
                <div className="table-header">
                    <Title level={4} className="table-title">
                        {selectedStatus === "All" ? "Tous les Colis" : `Colis ${selectedStatus}`}
                    </Title>
                    <Search
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: "200px" }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={searchQuery ? filteredData : filteredDataByStatus}
                    rowKey="id" // Assuming your data has an attribute named "id"
                    bordered
                    size="middle"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                    style={{ marginTop: "20px" }}
                />
            </div>
        </div>
        </>
    );
}

export default Homepage;

