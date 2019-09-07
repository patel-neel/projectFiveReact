import React, { Component } from 'react';
import axios from 'axios';


class SearchBar extends Component {

    constructor() {
        super();
        this.state = {
            stockQuote: [],
            autoFill: [],
            userInput: "",
        }
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

            this.setState({
                autoFill: result
            })
        })
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

    render(){
        return(
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
        )
    }

}




export default SearchBar