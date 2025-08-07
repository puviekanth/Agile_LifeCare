import React from "react";
import Header from '../components/Header';
import ProductsStatsChart from '../components/ProductStatsChart';

const Analytics =()=>{
    return(
        <>
        <Header />
         <h2 className="text-3xl font-bold text-center mb-6 text-blue-800 tracking-tight mt-6">Analytics</h2>
         <ProductsStatsChart/>
        </>
    )
}

export default Analytics;