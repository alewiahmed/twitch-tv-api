import React, { Component } from 'react';
import './App.css';
import users from './users.json';
import $ from 'jquery';

class App extends Component {
  state = {
    usersData: []
  };
  componentWillMount() {
    this.getUserData();
  }

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

  showUsers = () => {
    let usersUI = users
      .filter(user => {
        return user.error === undefined;
      })
      .map((user, index) => {
        let name =
          user.stream !== null ? user.stream.display_name : user.display_name;
        let statusClass = user.stream !== null ? 'status online' : 'status';
        let stream =
          user.stream !== null ? (
            <p>
              <span>Streaming:</span>
              {` ${user.stream.status}`}
            </p>
          ) : null;
        return (
          <a
            key={index}
            target="_blank"
            className="single-user"
            href={user._links.channel}
          >
            <div className="row">
              <img alt="avatar" />
              <div className="column">
                <h4>{name}</h4>
                {stream}
              </div>
            </div>
            <div className={statusClass} />
          </a>
        );
      });
    return <div className="users-container">{usersUI}</div>;
  };

  render() {
    return (
      <div className="App">
        <div className="container">{this.showUsers()}</div>
      </div>
    );
  }
}

export default App;
