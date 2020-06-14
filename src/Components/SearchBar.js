import React, { Component } from 'react';
import './SearchBar.css';
import { debounce } from 'lodash';

// This is the SearchBar component used to get Ticker information as the User searches
// Used a Debounce Technique to limit the number of API calls made
// After searching a ticker and finding it in the SearchBar
// CLicking on the ticker will send the ticker to the StockChart component and teh StockRecommendations Component

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ' ',
            tickerList: [],
        }
        this.fetchTickersDeb = debounce(this.fetchTickers, 500)
    }


    fetchTickers(stockSymbol) {
        const pointer = this;
        let arr = [];
        console.log(stockSymbol, "1");
        let url = `https://ticker-2e1ica8b9.now.sh/keyword/${stockSymbol}`;

        fetch(url) 
            .then( function(response) {
                return response.json();
            })
            .then ( function(data) {
                for (var key in data) {
                    arr.push(data[key]['symbol'] + ", "+ data[key]['name'])
                };

                pointer.setState({
                    tickerList: arr
                })
            }

            )
    }


    textChange = (e) => {
        const value = e.target.value;
        let arr = [];
        console.log(value, "10")
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            console.log(value, "value")
            console.log(regex, "regex");
            this.fetchTickers(value);
            arr = this.state.tickerList.sort().filter(tick => regex.test(tick));
        }
        this.setState({
            tickerList: arr,
            search: value
        });
    }
    
    tickerChosen(value) {
        let value1 = value.split(`,`);
        value = value1[0];
        this.setState({
            search: value,
            tickerList: []
        });



    };



    tickerSuggestions () {
        const { tickerList } = this.state;
        if (tickerList.length === 0) {
            return null;
        }
        return (
            <ul>
                {tickerList.map((ticker) => <li key={ticker} onClick={() =>  {this.props.parentCallback(ticker); this.tickerChosen(ticker);} }>{ticker}</li>)}
            </ul>
        )
    };



    render() {
        const { search } = this.state;
        return (

            <div className= 'SearchBar'>
                <div>
                    <input value = { search } onChange={this.textChange} type='text' />
                </div>
                {this.tickerSuggestions()}
            </div>
        )
    }
}

export default SearchBar
