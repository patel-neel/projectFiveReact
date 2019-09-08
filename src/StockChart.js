import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

class StockChart extends Component{
    constructor(props){
        super(props);
        this.state = {
            // chartData: {
            //     labels: [],
            //     datasets: [
            //         {
            //             label: '',
            //             data: [],
            //         }
            //     ],
            // }
        }
    }

    // stockCharFunction(){
    //     axios({
    //         method: 'GET',
    //         url: `https://www.alphavantage.co/query?/`,
    //         dataResponse: 'json',
    //         params: {
    //             function: 'TIME_SERIES_INTRADAY',
    //             symbol: this.props.userInput,
    //             apikey: "WPZV8PD9NGMXNUEF",
    //             interval: '5min',
    //             format: "json",
    //         },

    //     }).then(result => {
    //         result = result.data["Time Series (5min)"];
    //         console.log(result);
    //         let datesArray = [];
    //         let pricesArray = [];

    //         for (let i in result) {
    //             datesArray.push(i);
    //             pricesArray.push(result[i]["4. close"])
    //         }

    //         console.log(pricesArray);
    //         console.log(datesArray);

    //         let arrayDataSets = [{
    //             label: 'Price',
    //             data: pricesArray,
    //         }]
            
    //         let myChartData = {
    //             arrayDataSets,
    //             pricesArray
    //         }

    //         console.log(myChartData);

    //         this.state.chartData.datasets[0].label = 'price';
    //         this.state.chartData.labels = datesArray;
    //         this.state.chartData.datasets[0].data = pricesArray;

    //         this.setState({
    //             // chartData: myChartData
    //             state: this.state,
    //         })

    //     })
    // }

    render(){
        return(
            
            <div className="stockChart">
                <h1>{this.props.userInput}</h1>
                <Line
                    data={this.props.chartData}
                    options={{}}
                    />
            </div>
        )
    }
}




export default StockChart