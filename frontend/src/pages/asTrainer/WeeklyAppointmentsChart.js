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
        <Box mt={4}>
            <Typography variant="h6" gutterBottom align="center">
                Liczba treningów w bieżącym tygodniu: {totalAppointments}
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                        label={{ value: 'Treningi', angle: -90, position: 'insideLeft' }} 
                        allowDecimals={false}
                        domain={[0, maxCount]} 
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#0073e6"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default WeeklyAppointmentsChart;
