import React, { Component } from 'react';
import axios from 'axios';
// import Banner from './Banner';
import { Line } from 'react-chartjs-2';
import './App.scss';



class App extends Component {

  constructor(){
    super();
    this.state = {

      topNews: [],

      activeCompanyOne: "",
      activeCompanyTwo: "",
      activeCompanyThree: "",
      activeCompanyFour: "",
      activeCompanyFive: "",
      activeCompanySix: "",
      activeCompanySeven: "",
      activeCompanyEight: "",
      activeCompanyNine: "",
      activeCompanyTen: "",

      companyTicker:'',

      companyTitle:"Facebook Inc.",
      mainPercentChange: '0.00',
      stockQuote: [],
      autoFill: [],
      userInput: '',
      chartDates: [],
      chartPrices: [],

      userPortfolio:[],

      exchange:'',
      industry:'',
      companyWebsite: '',
      companyDescription: '',
      ceo: '',
      sector:'',
      companyImage:'',


      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: '#737373',
            borderColor: 'rgba(136,136,136,0.5)',
            pointRadius: 1,
            
          }
        ],
      }
    }
  }

  componentDidMount(){

    axios({
      method: "GET",
      url: 'https://stocknewsapi.com/api/v1/category?section=general&items=5&token=f3rxhssyrsg70doigztgrkpzkmrp2pealzljbdsv',
      dataResponse: 'json',
    }).then(res => {
      res = res.data["data"]


      this.setState({
        topNews: res
      })
    })



    axios({
      method: 'GET',
      url: `https://financialmodelingprep.com/api/v3/stock/actives`,
      dataResponse: 'json',
    }).then(result => {

      result = result.data

      let activeArray = result["mostActiveStock"];

      this.setState({
        activeCompanyOne: activeArray[0],
        activeCompanyTwo: activeArray[1],
        activeCompanyThree: activeArray[2],
        activeCompanyFour: activeArray[3],
        activeCompanyFive: activeArray[4],
        activeCompanySix: activeArray[5],
        activeCompanySeven: activeArray[6],
        activeCompanyEight: activeArray[7],
        activeCompanyNine: activeArray[8],
        activeCompanyTen: activeArray[9],
      })



    })
    axios({
      method: 'GET',
      url: `https://www.alphavantage.co/query?/`,
      dataResponse: 'json',
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: 'FB',
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

      axios({
        method: 'GET',
        url: `https://www.alphavantage.co/query?/`,
        dataResponse: 'json',
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: 'GOOG',
          apikey: "WPZV8PD9NGMXNUEF",
          interval: '5min',
          format: "json",
        },

      }).then(result => {
        result = result.data["Time Series (5min)"];
        let datesArray = [];
        let pricesArray = [];

        for (let i in result) {
          datesArray.push(i)
          pricesArray.push(result[i]["4. close"])
        }

        let arrayDataSets = [{
          label: '',
          data: pricesArray,
        }]

        let myChartData = {
          arrayDataSets,
          pricesArray
        }

        this.state.chartData.datasets[0].label = 'GOOG';
        this.state.chartData.labels = datesArray.reverse();
        this.state.chartData.datasets[0].data = pricesArray.reverse();

        this.setState({
          // chartData: this.state.myChartData
          state: this.state,
        })

      })


      axios({
        method: 'GET',
        url: `https://financialmodelingprep.com/api/v3/company/profile/GOOG`,
        dataResponse: 'json',
      }).then(result => {

        result = result.data['profile'];

        let percentString = result['changesPercentage'].replace(/[!@#$%^&*()]/g, "");

        this.setState({
          companyTitle: result['companyName'],
          mainPercentChange: percentString,
        })

      })
    })
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

        let justTheTicker = res['01. symbol'];

        this.setState({
          stockQuote: Object.entries(res),
          userInput: "",
          companyTicker: justTheTicker,
        })


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

          let datesArray = [];
          let pricesArray = [];

          for (let i in result) {
            datesArray.push(i)
            pricesArray.push(result[i]["4. close"])
          }


          let arrayDataSets = [{
            label: '',
            data: pricesArray,
          }]

          let myChartData = {
            arrayDataSets,
            pricesArray
          }

          
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

          res = result.data['profile'];

          let companySymbol = result.data['symbol']

          let percentString = res['changesPercentage'].replace(/[!@#$%^&*()]/g, "");

          this.setState({
            companyTitle: res['companyName'],
            mainPercentChange: percentString,
            exchange: res["exchange"],
            industry: res["industry"],
            companyWebsite: res["website"],
            companyDescription: res["description"],
            ceo: res["ceo"],
            sector: res["sector"],
            companyImage: res["image"],
            companyTicker: companySymbol,

          })

        })
      })

    }else{
      alert('please enter a company ticker')
    }
  }




  render() {


    return (
      <div className="App">
        <div className="mainContentWrapper">
          <nav>
            <div className="title">
              <h1>Juno</h1>
              <h1>Finance</h1>
            </div>
  
            <div className="searchAutofill">
              <form autoComplete="off" action="">
                <div className="searchBar">
                  <input type="text" name="userInput" onSubmit={this.handleSubmit} value={this.state.userInput} onChange={this.handleChange} onKeyUp={this.handleAutofill}></input>
                  <button className="searchButton" type="submit" value="submit" onSubmit={this.handleSubmit} onClick={this.handleSubmit}><i className="fa fa-search"></i></button>
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
            <ul className="userPortfolio">
                
            </ul>
          </nav>
          
  
  
  
          <main>
            <div className='banner'>
              <ul className="activeList">
                <li className="activeContainer a1">
                  <h4>{this.state.activeCompanyOne["ticker"]}</h4>
                  <p>{this.state.activeCompanyOne["price"]} (<span style={{ color: this.state.activeCompanyOne["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyOne["changes"]}</span>)</p>
                </li>
                <li className="activeContainer a2">
                  <h4>{this.state.activeCompanyTwo["ticker"]}</h4>
                  <p>{this.state.activeCompanyTwo["price"]} (<span style={{ color: this.state.activeCompanyTwo["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyTwo["changes"]}</span>)</p>
                </li>
  
                <li className="activeContainer a3">
                  <h4>{this.state.activeCompanyThree["ticker"]}</h4>
                  <p>{this.state.activeCompanyThree["price"]} (<span style={{ color: this.state.activeCompanyThree["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyThree["changes"]}</span>)</p>
                </li>
                <li className="activeContainer a4">
                  <h4>{this.state.activeCompanyFour["ticker"]}</h4>
                  <p>{this.state.activeCompanyFour["price"]} (<span style={{ color: this.state.activeCompanyFour["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyFour["changes"]}</span>)</p>
                </li>
  
                <li className="activeContainer a5">
                  <h4>{this.state.activeCompanyFive["ticker"]}</h4>
                  <p>{this.state.activeCompanyFive["price"]} (<span style={{ color: this.state.activeCompanyFive["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyFive["changes"]}</span>)</p>
                </li>
                <li className="activeContainer a6">
                  <h4>{this.state.activeCompanySix["ticker"]}</h4>
                  <p>{this.state.activeCompanySix["price"]} (<span style={{ color: this.state.activeCompanySix["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanySix["changes"]}</span>)</p>
                </li>
  
                <li className="activeContainer a7">
                  <h4>{this.state.activeCompanySeven["ticker"]}</h4>
                  <p>{this.state.activeCompanySeven["price"]} (<span style={{ color: this.state.activeCompanySeven["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanySeven["changes"]}</span>)</p>
                </li>
                <li className="activeContainer a8">
                  <h4>{this.state.activeCompanyEight["ticker"]}</h4>
                  <p>{this.state.activeCompanyEight["price"]} (<span style={{ color: this.state.activeCompanyEight["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyEight["changes"]}</span>)</p>
                </li>
                <li className="activeContainer a9">
                  <h4>{this.state.activeCompanyNine["ticker"]}</h4>
                  <p>{this.state.activeCompanyNine["price"]} (<span style={{ color: this.state.activeCompanyNine["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyNine["changes"]}</span>)</p>
                </li>
                <li className="activeContainer a10">
                  <h4>{this.state.activeCompanyTen["ticker"]}</h4>
                  <p>{this.state.activeCompanyTen["price"]} (<span style={{ color: this.state.activeCompanyTen["changes"] > 0 ? 'green' : 'red' }}>{this.state.activeCompanyTen["changes"]}</span>)</p>
                </li>
  
              </ul>
  
            </div>
  
  
            <div className="wrapper chartNumbersInfo">
              <h2>{this.state.companyTitle} (<span style={{ color: this.state.mainPercentChange > 0 ? 'green' : 'red' }}>{this.state.mainPercentChange}%</span>) </h2>
  
              <div className="numbersGraph">
                <div className="companyNumbers">
                  
                  <ul className="stockInformation">
                    {
                      this.state.stockQuote.map((value, index) => {
                        return <li key={index}><span>{value[0]}</span> <span>{value[1]}</span></li>
                        
                      })
                    }
                  </ul>
                </div>
                <div className="stockChart">
                  <Line
                    data={this.state.chartData}
                    width={500}
                    height={400}
                    options={{maintainAspectRatio : false}}
                    />
                </div>
              </div>
            </div>
  
            <div className="aboutNews wrapper">
              <div className="aboutCompany">
                  <h4>{this.state.companyTitle} Key Info</h4>
                  <h5>Company CEO: {this.state.ceo}</h5>
                  <h5>Company URL: <a href={this.state.companyWebsite}>{this.state.companyWebsite}</a></h5>
                  <h5>Exchange: {this.state.exchange}</h5>
                  <h5>Industry: {this.state.industry}</h5>
                  <h5>Sector: {this.state.sector}</h5>
  
                  <h4 className="companyParagraph">About {this.state.companyTitle}</h4>
                  <p>{this.state.companyDescription}</p>
              </div>
  
              <ul className="news">
                {
                  this.state.topNews.map((value, index) => {
                    return <li key={index}>
                      <h3> <a href={value['news_url']}>{value["title"]}</a></h3>
                      <div className="newsImage"> <img src={value['image_url']}></img> </div>
                      <p>{value["text"]}</p>
                    
                    </li>
                  })
                }
              </ul>
            </div>
  
          </main>
        </div>
        <footer>
          <p>Copyright © Neel Patel 2019</p>
        </footer>
      </div>
    );
  }
}

export default App;
