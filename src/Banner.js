// import React, { Component } from 'react';
// import axios from 'axios';

// class Banner extends Component{
//     constructor(){
//         super();
//         this.state = {
//             activeStocks:[]
//         }
//     }
//     componentDidMount(){
//         axios({
//             method: 'GET',
//             url: `https://financialmodelingprep.com/api/v3/stock/actives`,
//             dataResponse: 'json',
//         }).then(result => {

//             result = result.data["mostActiveStock"][0];

            
//             this.state.activeStocks = result;
            
//             console.log(this.state.activeStocks[0])
//             console.log(result)
//         })
//     }



//     render(){
//         return(
//             <div className='sickBanner'>
//                 <div>
//                     <p>{this.state.activeStocks}</p>
//                 </div>
//                 <p>price<span> <i className="fa fa-caret-up"></i></span></p>
//             </div>

//         )
//     }
// }

// export default Banner;