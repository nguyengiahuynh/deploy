import React, { Component } from 'react';
import axios from 'axios'
import logo from './logo.svg';
import justifiedLayout from 'justified-layout'; 
import './App.css';



const config = {
  containerWidth: 1150,
  containerPadding: 0,
  boxSpacing: {
    horizontal: 5,
    vertical: 5
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      pictures: [],
      geometry: null,
      next: 1
    }
  }

  editSizeImage(data){
    return data.map((item) => {
        return {width: +item.width_m, height: +item.height_m}
    })
  }

  componentDidMount() { 
    axios.get('https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=ca3783111609d69139840916b7a01ad2&format=json&nojsoncallback=1&per_page=20&page=1&extras=media%2Curl_m%2Cowner_name')
      .then(res => {
          this.setState({
            pictures: res.data.photos.photo,
            geometry: justifiedLayout(this.editSizeImage(res.data.photos.photo), config),
            next: this.state.next + 1,
          });
          console.log(this.state.geometry);
          })
  }

  render() {
    return (
      <div className="container" style={{position: 'relative'}}>
      {!!this.state.pictures.length && this.state.pictures.map((item, key) => {
        return(
          <div className="photo-view" key={key} style={this.state.geometry.boxes[key]}>
            <div className="interaction-view">
              <div className="photo-list-photo-interaction">
                <a className="overlay"> </a>
                <div className="interaction-bar">
                    <div className="text">
                      <a className="title">{item.title}</a>
                      <a className="attribution">by {item.ownername} - {item.views} views</a>
                    </div>
                </div>
              </div>
            </div>
            <img src={item.url_m} alt="img" />
          </div>
          )
        })
      }
      </div>
    )
  }


}
export default App;
