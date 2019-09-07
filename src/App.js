import React, { Component } from 'react';
// import StockChart from './StockChart'
import SearchBar from './SearchBar'
import axios from 'axios';
import './App.scss';


class App extends Component {

  constructor(){
    super();
    this.state = {
      stockQuote: [],
      autoFill: [],
      userInput: "",
    }
  }


  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
    event.preventDefault()
  }




  handleAutofill = (event) => {
    event.preventDefault()
    let symbolting = this.state.userInput

    axios({
      method: 'GET',
      url: 'https://www.alphavantage.co/query?/',
 
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: symbolting,
        apikey: "IUNM6E16UXNGR0X4",

      },
    }).then(result => {
      result = result.data["bestMatches"]

      // for(let i=0; i< result.length; i++){
      //   console.log(result[i]["1. symbol"])
      // }
      // result.map((value, index) => {
      //     console.log(value["1. symbol"])
      //   }
      // )

      
      this.setState({
        autoFill: result
      })
      // console.log(result)

    })
  }





  handleSubmit = (event) => {
    event.preventDefault()

    let symbol = this.state.userInput

    // alert(symbol)

    axios({
      method: 'GET',
      url: `https://www.alphavantage.co/query?/`,
      dataResponse: 'json',
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: "IUNM6E16UXNGR0X4",
        format: "json",

      },
    }).then(res => {
      //res all the information for the searched stock ticker
      res = res.data['Global Quote'];

      this.setState({
        
        stockQuote: Object.entries(res)
      })
      console.log(Object.entries(res))
    })
  }


  handleFillTextbox = index =>{

    // alert(index)

    let symbol = this.state.autoFill[index]["1. symbol"]

    alert(symbol)

    this.setState({
      userInput: symbol,
      autoFill:[],
      
    })
  }

  render() {
    let stockQuoteArray = this.state.stockQuote;

    return (
      <div className="App">

        <nav>
          <div className="wrapper">
            <h1>Juno Capital</h1>
            <form action="">
              <input type="text" name="userInput" value={this.state.userInput} onChange={this.handleChange} onKeyUp={this.handleAutofill}></input>
                <ul className="dropdownSearch">
                  {
                    this.state.autoFill.map((value, index) => {
                      return <li key={index} onClick={() => this.handleFillTextbox(index)}> {value["1. symbol"]} </li>
                    })
                  }
                </ul>

              <input type="button" value="submit" onClick={this.handleSubmit}></input>
            </form>

          </div>
        </nav>
        
        
        <main>
          <ul className="stockInformation">
            {
              stockQuoteArray.map((value, index) => {
                return <li key={index}><span>{value[1]}</span> </li>
              })
              
            }
          </ul>
        </main>

      </div>
    );
  }
}

export default App;
