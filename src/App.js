import React, { Component } from 'react';
import './App.css';
import users from './users.json';
import $ from 'jquery';

class App extends Component {
  state = {
    filter: 'all',
    usersData: []
  };
  componentWillMount() {
    this.getUserData();
  }

  toggleFilter = filter => {
    this.setState({
      filter
    });
  };

  getUserData = async () => {
    let users = [
      'ESL_SC2',
      'OgamingSC2',
      'cretetion',
      'freecodecamp',
      'storbeck',
      'habathcx',
      'RobotCaleb',
      'noobs2ninjas'
    ];

    users.forEach(async user => {
      let channels = await this.fetch('channels', user);
      let streams = await this.fetch('streams', user);
      this.setState(state => {
        state.usersData.push({ user, channels, streams });
        return state;
      });
    });
  };

  fetch = async (type, userName) => {
    const URL = `https://wind-bow.gomix.me/twitch-api/${type}/${userName}?callback=?`;
    try {
      return await $.getJSON(URL);
    } catch (e) {
      return { error: e };
    }
  };

  showFilter = () => {
    let { filter, usersData } = this.state;
    if (!usersData.length) return null;
    return (
      <div className="filter-container">
        <button
          onClick={() => this.toggleFilter('all')}
          className={filter === 'all' ? 'selected' : ''}
        >
          All
        </button>
        <button
          onClick={() => this.toggleFilter('online')}
          className={filter === 'online' ? 'selected' : ''}
        >
          Online
        </button>
        <button
          onClick={() => this.toggleFilter('offline')}
          className={filter === 'offline' ? 'selected' : ''}
        >
          Offline
        </button>
      </div>
    );
  };

  inputBlured = () => {
    this.setState({
      searchActive: false
    });
    this.searchInput.value = '';
  };

  inputFocused = () => {
    this.setState({
      searchActive: true
    });
  };

  showSearch = () => {
    let { usersData, searchActive } = this.state;
    // if (!usersData.length) return null;
    let searchClass = searchActive ? 'search active' : 'search';
    return (
      <div className="search-container">
        <div
          class={searchClass}
          onBlur={this.inputBlured}
          onFocus={this.inputFocused}
        >
          <input
            id="inpt_search"
            type="text"
            ref={r => (this.searchInput = r)}
          />
        </div>
      </div>
    );
  };

  showUsers = () => {
    let { usersData, filter } = this.state;
    if (!usersData.length) return null;
    let usersUI = usersData
      .filter(user => {
        let truth = user.channels.error === undefined;
        if (filter === 'online') {
          truth = truth && user.streams.stream !== null;
        } else if (filter === 'offline') {
          truth = truth && user.streams.stream === null;
        }
        return truth;
      })
      .map((user, index) => {
        let name = user.channels.display_name;
        let statusClass =
          user.streams.stream !== null ? 'status online' : 'status';
        let stream =
          user.streams.stream !== null ? (
            <p>
              <span className="streaming">Streaming: </span>
              {`${user.streams.stream.channel.status}`}
            </p>
          ) : (
            <p>
              <span>Recent Stream: </span>
              {`${user.channels.status ? user.channels.status : 'None'}`}
            </p>
          );
        return (
          <a
            key={index}
            target="_blank"
            className="single-user"
            href={user.channels.url}
          >
            <div className="row">
              <img src={user.channels.logo} alt="avatar" />
              <div className="column">
                <h4>{name}</h4>
                {stream}
              </div>
            </div>
            <div className={statusClass} />
          </a>
        );
      });
    if (!usersUI.length)
      return (
        <div className="users-container">Nothing to show at this time</div>
      );
    return <div className="users-container">{usersUI}</div>;
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          {this.showSearch()}
          {this.showFilter()}
          {this.showUsers()}
        </div>
      </div>
    );
  }
}

export default App;
