import React, { Component } from 'react';
import axios from 'axios';
// import StockChart from './StockChart'
import Plot from 'react-plotly.js';
import { Line } from 'react-chartjs-2';
import './App.scss';



class App extends Component {

  constructor(){
    super();
    this.state = {
      companyTitle:"Facebook Inc.",
      mainPercentChange: '0.00%',
      stockQuote: [],
      autoFill: [],
      userInput: '',
      chartDates: [],
      chartPrices: [],

      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: '#737373',
            borderColor: 'rgba(136,136,136,0.5)',
          }
        ],
      }
    }
  }


  handleChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  handleAutofill = (event) => {
    event.preventDefault()
    let symbolting = this.state.userInput

    if (symbolting !== ''){
      axios({
        method: 'GET',
        url: 'https://www.alphavantage.co/query?/',
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: symbolting,
          apikey: "WPZV8PD9NGMXNUEF",
        },
      }).then(result => {
        result = result.data["bestMatches"]
        this.setState({
          autoFill: result
        })
      })
    }else{
      this.setState({
        autoFill:[]
      })
    }
  }

  handleFillTextbox = index => {
    let symbol = this.state.autoFill[index]["1. symbol"]

    this.setState({
      userInput: symbol,
      autoFill: [],
    })
  }


  handleSubmit = (event) => {
    event.preventDefault()

    let symbol = this.state.userInput
    alert(symbol)

    if (symbol !==''){
      axios({
        method: 'GET',
        url: `https://www.alphavantage.co/query?/`,
        dataResponse: 'json',
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: "WPZV8PD9NGMXNUEF",
          format: "json",

        },
      }).then(res => {
        //res all the information for the searched stock ticker
        res = res.data['Global Quote'];

        this.setState({
          stockQuote: Object.entries(res),
          // userInput: "",
        })
        console.log(Object.entries(res))


        axios({
          method: 'GET',
          url: `https://www.alphavantage.co/query?/`,
          dataResponse: 'json',
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol: symbol,
            apikey: "WPZV8PD9NGMXNUEF",
            interval: '5min',
            format: "json",
          },

        }).then(result => {
          result = result.data["Time Series (5min)"];
          console.log(result);
          let datesArray = [];
          let pricesArray = [];

          for (let i in result) {
            datesArray.push(i)
            pricesArray.push(result[i]["4. close"])
          }

          console.log(pricesArray);
          console.log(datesArray);

          let arrayDataSets = [{
            label: '',
            data: pricesArray,
          }]

          let myChartData = {
            arrayDataSets,
            pricesArray
          }

          console.log(myChartData);

          this.state.chartData.datasets[0].label = symbol;
          this.state.chartData.labels = datesArray.reverse();
          this.state.chartData.datasets[0].data = pricesArray.reverse();

          this.setState({
            // chartData: myChartData
            state: this.state,
          })

        })


        axios({
          method: 'GET',
          url: `https://financialmodelingprep.com/api/v3/company/profile/${symbol}`,
          dataResponse: 'json',
        }).then(result=>{

          result = result.data['profile'];

          let percentString = result['changesPercentage'].replace(/[!@#$%^&*()]/g, "");

          this.setState({
            companyTitle: result['companyName'],
            mainPercentChange: percentString,
          })

          console.log(percentString)
          console.log(symbol)
        })
      })

    }else{
      alert('please enter a company ticker')
    }
  }


  render() {
    let stockQuoteArray = this.state.stockQuote;


    return (
      <div className="App">
        <nav>
          <div className="title">
            <h1>Juno</h1>
            <h1>Finance</h1>
          </div>


          <div className="searchAutofill">
            <form autoComplete="off" action="">
              <div className="searchBar">
                <input type="text" name="userInput" onSubmit={this.handleSubmit} value={this.state.userInput} onChange={this.handleChange} onKeyUp={this.handleAutofill}></input>
                <button type="submit" value="submit" onSubmit={this.handleSubmit} onClick={this.handleSubmit}><i className="fa fa-search"></i></button>
              </div>
            </form>
            <ul className="dropdownSearch">
              {
                this.state.autoFill.map((value, index) => {
                  return <li key={index} onClick={() => this.handleFillTextbox(index)} onSubmit={this.handleSubmit}> {value["1. symbol"]} - {value["2. name"]}</li>
                })
              }
            </ul>
          </div>

          <div className="stockPortfolio">

          </div>


        </nav>
        
        <main>
          <div className='banner'>
            <ul className="dailyWinnersLosers">
                  <li>
                    <h4>Stock Name</h4>
                    <p>price<span> <i className="fa fa-caret-up"></i></span></p>
                  </li>

            </ul>
          </div>


          <div className="wrapper chartNumbersInfo">
            
            <h2>{this.state.companyTitle} (<span style={{ color: this.state.mainPercentChange > 0 ? 'green' : 'red'}}>{this.state.mainPercentChange}</span>) </h2>

            <div className="numbersGraph">
              <div className="companyNumbers">
                <ul className="stockInformationPlaceHolders">
                  <li>Ticker: </li>
                  <li>Open: </li>
                  <li>High: </li>
                  <li>Low: </li>
                  <li>Price: </li>
                  <li>Volume: </li>
                  <li>Day: </li>
                  <li>Previous Close: </li>
                  <li>($)Change: </li>
                  <li>(%)Change: </li>
                </ul>
                <ul className="stockInformation">
                  {
                    stockQuoteArray.map((value, index) => {
                      return <li key={index}><span>{value[1]}</span> </li>
                    })
                  }
                </ul>
              </div>
              <div className="stockChart">
                <Line
                  data={this.state.chartData}
                  width={700}
                  height={450}
                  options={{}}
                />
              </div>
            </div>
  
            
          </div>
        </main>

      </div>
    );
  }
}

export default App;
