import React, { Component } from 'react'
import StockChart from './StockChart';
import StockRecommendations from './StockRecommendations';
import SearchBar from './SearchBar';
import './Parent.css';

function CorrectRender(props, oldtick) {
    const ticker = props.props;
    console.log("props", props)
    const previousTicker = props.oldtick;
    if (ticker.length > 0 && previousTicker !== ticker) {
        return <div>
            <StockChart stockSymbol = {ticker} previousTicker={previousTicker}/>
            <StockRecommendations stockSymbol = {ticker} previousTicker={previousTicker}/>
        </div>
    }
    return <h1>
        Search for a Stock Ticker!
    </h1>;
    }

export class Parent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stockSymbol: '',
            previousTicker: ''
        }
        this.callbackFunction = this.callbackFunction.bind(this);
    }

    
    shaveData(value) {
        let value1 = value.split(`,`);
        value = value1[0];
        this.setState({
            stockSymbol: value,
        });
        console.log("from shaved data SS", this.state.stockSymbol)
        console.log("from shaved data PT", this.state.previousTicker)
    }



    callbackFunction(sS)  {
        this.setState({ previousTicker: this.state.stockSymbol});
        this.shaveData(sS);
    };

    render() {
        return (
            <div className='Parent'>
                <header>
                    <SearchBar parentCallback = {this.callbackFunction}/>
                    <CorrectRender props={this.state.stockSymbol} oldtick={this.state.previousTicker}/>
                </header>
            </div>
        )
    }
}

export default Parent;
