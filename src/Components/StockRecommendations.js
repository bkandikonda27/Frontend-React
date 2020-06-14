import React, { Component } from 'react'
import Plot from 'react-plotly.js';
import { debounce } from 'lodash';

// StockRecommendations component will recieve a stock ticker from the SearchBar component
// Then,  it will make an API call to get StockRecommendations for a specific compoany
// Then, chart this information into a bar graph based on the Analyst Recommendations


export class StockRecommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strongBuy: [],
            strongSell: [],
            buy: [],
            sell: [],
            hold: [],
            period: [],
            stockSymbol: this.props.stockSymbol,
            previousTicker: this.props.previousTicker
        }
        this.fetchStockDeb = debounce(this.componentDidMount, 500)
    }
    
    componentDidMount() {
        this.fetchStock();
    }


    componentDidUpdate() {
        if (this.state.stockSymbol !== this.props.stockSymbol) {
            this.fetchStock();
        }
    }

    fetchStock() {
        const pointer = this;
        const apiKey = "br6openrh5rdamtpb6hg";
        let ticker = this.props.stockSymbol; 
        let URL = `https://finnhub.io/api/v1/stock/recommendation?symbol=${this.props.stockSymbol}&token=${apiKey}`;
        console.log("from Stock Recommendation")
        console.log(this.props.stockSymbol);
        
        let strongBuyFunc = [];
        let strongSellFunc = [];
        let buyFunc = [];
        let sellFunc = [];
        let holdFunc = [];
        let periodFunc = [];
        

        fetch(URL)
            .then(
                function(response) {
                    console.log(response);
                    return response.json();
                }
            )
            .then(
                function(data) {
                    console.log(data);

                    for(var key in data) {
                        strongBuyFunc.push(data[key]['strongBuy']);
                        strongSellFunc.push(data[key]['strongSell']);
                        buyFunc.push(data[key]['buy']);
                        sellFunc.push(data[key]['sell']);
                        holdFunc.push(data[key]['hold']);
                        periodFunc.push(data[key]['period'])
                    }
                    pointer.setState({
                        strongBuy: strongBuyFunc,
                        strongSell: strongSellFunc,
                        buy: buyFunc,
                        sell: sellFunc,
                        hold: holdFunc,
                        period: periodFunc,
                        stockSymbol: ticker
                    })
                }
            )
            .catch((error) => {
                console.log(error);
            })

    }
    
    render() {
        if (this.state.strongSell < 1) {
            return <h1>
                Sorry, the Analyst Recommendations aren't available for this ticker. Please search for another one!
            </h1>
        } else {
            return (
                <div>
                    <Plot 
                        data={[
                            {
                                x: this.state.period,
                                y: this.state.strongSell,
                                name: 'Strong Sell',
                                type: 'bar',
                                marker: { color: 'black'},
                            },
                            {
                                x: this.state.period,
                                y: this.state.sell,
                                name: 'Sell',
                                type: 'bar',
                                marker: { color: 'red'},
                            },
                            {
                                x: this.state.period,
                                y: this.state.hold,
                                name: 'Hold',
                                type: 'bar',
                                marker: { color: 'rgb(254, 196, 0)'},
                            },
                            {
                                x: this.state.period,
                                y: this.state.buy,
                                name: 'Buy',
                                type: 'bar',
                                marker: { color: 'rgb(114, 196, 0)'},
                            },
                            {
                                x: this.state.period,
                                y: this.state.strongBuy,
                                name: 'Strong Buy',
                                type: 'bar',
                                marker: { color: 'green'},
                            }
                        ]}
                        layout = { {width: 440, height: 720, barmode: 'stack', title: 'Analyst Recommendations'}}
                    />
                </div>
            )
        }
       
    }
}

export default StockRecommendations
