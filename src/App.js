import React, { Component } from 'react';
import axios from 'axios'
import logo from './logo.svg';
import justifiedLayout from 'justified-layout';
import InfiniteScroll from 'react-infinite-scroller';
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
      nextPage: 1,
      isLoading: false
    }
  }

  editSizeImage(data){
    return data.map((item) => {
        return {width: +item.width_m, height: +item.height_m}
    })
  }

  loadMore(){
    this.setState({
      isLoading: true
    })
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=ca3783111609d69139840916b7a01ad2&format=json&nojsoncallback=1&per_page=20&page=${this.state.nextPage}&extras=media%2Curl_m%2Cowner_name`)
      .then(res => {
          this.setState({
            pictures: [...this.state.pictures,...res.data.photos.photo],
            nextPage: this.state.nextPage + 1 > res.totalPages ? false : this.state.nextPage + 1
          }, () => {
            this.setState({
              geometry: justifiedLayout(this.editSizeImage(this.state.pictures), config),
              isLoading: false
            })
          });
        })
  }

  handleOnScroll() {
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 300;
    if (scrolledToBottom && this.state.nextPage && !this.state.isLoading) {
      this.loadMore();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll.bind(this));
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll.bind(this));
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=ca3783111609d69139840916b7a01ad2&format=json&nojsoncallback=1&per_page=20&page=${this.state.nextPage}&extras=media%2Curl_m%2Cowner_name`)
      .then(res => {
          this.setState({
            pictures: res.data.photos.photo,
            geometry: justifiedLayout(this.editSizeImage(res.data.photos.photo), config),
            nextPage: this.state.nextPage + 1,
          });
          })
  }

  render() {
    console.log(this.state.pictures);
    return (
     <div className="container" style={{position: 'relative'}}>
     {!!this.state.pictures.length && this.state.pictures.map((item, key) => {
        return(
          <a href={item.url_m}>
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
          </a>
          )
        })
      }
      </div>
    )
  }
}
export default App;
