import React, { Component } from 'react';
import axios from 'axios';
import './App.scss';


class App extends Component {

  constructor(){
    super();
    this.state = {
      stockQuote: [],
      autoFill: [],
      userInput: '',
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

    // axios({
    //   method: 'GET',
    //   url: 'https://www.alphavantage.co/query?/',

    //   params: {
    //     function: 'SYMBOL_SEARCH',
    //     keywords: symbolting,
    //     apikey: "IUNM6E16UXNGR0X4",
    //   },
    // }).then(result => {
    //   result = result.data["bestMatches"]
      
    //   this.setState({
    //     autoFill: result
    //   })
    // })
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
      })

    }else{
      alert('please enter a company ticker')
    }
  }


  handleFillTextbox = index =>{

    let symbol = this.state.autoFill[index]["1. symbol"]

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

            <form autoComplete="off" action="">
              <input type="text" name="userInput" onSubmit={this.handleSubmit} value={this.state.userInput} onChange={this.handleChange} onKeyUp={this.handleAutofill}></input>
                <ul className="dropdownSearch">
                  {
                    this.state.autoFill.map((value, index) => {
                      return <li key={index} onClick={() => this.handleFillTextbox(index)}> {value["1. symbol"]} </li>
                    })
                  }
                </ul>

              <input type="submit" value="submit" onSubmit={this.handleSubmit} onClick={this.handleSubmit}></input>
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
