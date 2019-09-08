import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './App.scss';


class App extends Component {

  constructor(){
    super();
    this.state = {
      stockQuote: [],
      autoFill: [],
      userInput: '',
      chartDates: [],
      chartPrices: [],
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
          userInput: "",
        })
        console.log(Object.entries(res))


        //INTRADAY DATA////////////////////////////

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

        }).then(result =>{
          result = result.data["Time Series (5min)"];

          let datesArray =  [];
          let pricesArray = [];

          for (let i in result){
            datesArray.push(i);
            pricesArray.push(result[i]["4. close"])
          }

          this.setState({
            chartDates: datesArray,
            chartPrices: pricesArray,
          })
          
        })

        axios({
          method: 'GET',
          url: `https://financialmodelingprep.com/api/v3/company/profile/${symbol}`,
          dataResponse: 'json',
        }).then(result=>{

          result = result.data['profile'];

          console.log(result)
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
          <div className="wrapper">
            <h1>Juno Capital</h1>

            <form autoComplete="off" action="">
              <input type="text" name="userInput" onSubmit={this.handleSubmit} value={this.state.userInput} onChange={this.handleChange} onKeyUp={this.handleAutofill}></input>
              <input type="submit" value="submit" onSubmit={this.handleSubmit} onClick={this.handleSubmit}></input>
                <ul className="dropdownSearch">
                  {
                    this.state.autoFill.map((value, index) => {
                      return <li key={index} onClick={() => this.handleFillTextbox(index)} onSubmit={this.handleSubmit}> {value["1. symbol"]} - {value["2. name"]}</li>
                    })
                  }
                </ul>
            </form>

          </div>
        </nav>
        
        
        <main>
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

          </div>
        </main>

      </div>
    );
  }
}

export default App;
