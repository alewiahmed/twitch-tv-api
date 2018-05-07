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
    let { usersData } = this.state;
    if (!usersData.length) return null;
    let usersUI = usersData
      .filter(user => {
        return user.channels.error === undefined;
      })
      .map((user, index) => {
        console.log(user);
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
        <div className="container">{this.showUsers()}</div>
      </div>
    );
  }
}

export default App;
