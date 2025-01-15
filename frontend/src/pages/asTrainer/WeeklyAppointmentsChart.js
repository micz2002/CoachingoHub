import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Typography, Box } from "@mui/material";
import axios from "axios";

const WeeklyAppointmentsChart = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [maxCount, setMaxCount] = useState(0);

    const fetchWeeklyAppointments = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/appointments/appointments-this-week",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                }
            );

            // Przekształcanie danych w formacie obiektu na tablicę
            const formattedData = Object.entries(response.data).map(([date, count]) => ({
                date,
                count,
            }));
            setWeeklyData(formattedData);

            // Obliczanie maksymalnej liczby treningów w jednym dniu
            const max = Math.max(...formattedData.map((item) => item.count));
            setMaxCount(max); // Ustawienie maksymalnej wartości dla osi Y

            // Obliczanie łącznej liczby treningów
            const total = formattedData.reduce((sum, item) => sum + item.count, 0);
            setTotalAppointments(total);
        } catch (err) {
            console.error("Error fetching weekly appointments:", err);
        }
    };

    useEffect(() => {
        fetchWeeklyAppointments();
    }, []);

    return (
        <Box display="flex" flexDirection="column"  mt={4}
        style={{marginRight: "20px"}}>
            <Typography variant="h6" gutterBottom align="center"
                style={{
                    padding: "2px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
                    textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    margin: "0 350px 10px 345px",
                    borderRadius: "10px",        
                    fontWeight: "bold" ,
                   
                                     
                }}>
                Liczba treningów w bieżącym tygodniu: {totalAppointments}
            </Typography>

            <ResponsiveContainer   style={{
    marginRight: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "15px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.8)",
    padding: "20px",
    width: "90%", 
    margin: "5px auto 0px auto", // Wyśrodkowanie
  }} width="90%" height={220}>
                <LineChart 
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.2)" />
                    <XAxis dataKey="date" 
                    stroke="#fff"
                    tick={{ fill: "#fff" }}
                    strokeWidth={1.5}
                    style={{ fontSize: "12px",
                    fontWeight: "500"
                     }}/>
                    <YAxis
                        label={{
                            value: "Treningi",
                            angle: -90,
                            position: "insideLeft",
                            fill: "#fff",
                            style: { fontSize: "12px", textAnchor: "middle",
                            fontWeight: "bold",
                             },
                          }}
                          stroke="#fff"
                          tick={{ fill: "#fff" }}
                          allowDecimals={false}
                          domain={[0, maxCount]} 
                          strokeWidth={1.5}
                    />
                    <Tooltip 
                    contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderRadius: "10px",
                        color: "#fff",
                        border: "none",
                      }}
                      labelStyle={{ color: "#fff" }}/>
                    <Line
                         type="monotone"
                         dataKey="count"
                         stroke="rgb(176, 255, 234)" 
                         strokeWidth={2.5}
                         activeDot={{
                           r: 10,
                           fill: "#fff",
                           stroke: "#00ffcc",
                           strokeWidth: 2,
                         }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default WeeklyAppointmentsChart;
