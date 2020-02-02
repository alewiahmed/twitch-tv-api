import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
  state = {
    error: '',
    filter: 'all',
    usersData: [],
    searchTerm: '',
    loading: false,
    isSearch: false,
    searchResult: [],
    searchActive: false
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
    this.setState({
      loading: true
    });
    users.forEach(async (user, index) => {
      let channels = await this.fetch('channels', user);
      let streams = await this.fetch('streams', user);
      if (index === users.length - 1) this.setState({ loading: false });
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

  showSpinner = () => {
    let { loading } = this.state;
    if (!loading) return null;
    return (
      <div className="sk-circle">
        <div className="sk-circle1 sk-child" />
        <div className="sk-circle2 sk-child" />
        <div className="sk-circle3 sk-child" />
        <div className="sk-circle4 sk-child" />
        <div className="sk-circle5 sk-child" />
        <div className="sk-circle6 sk-child" />
        <div className="sk-circle7 sk-child" />
        <div className="sk-circle8 sk-child" />
        <div className="sk-circle9 sk-child" />
        <div className="sk-circle10 sk-child" />
        <div className="sk-circle11 sk-child" />
        <div className="sk-circle12 sk-child" />
      </div>
    );
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
          ALL
        </button>
        <button
          onClick={() => this.toggleFilter('online')}
          className={filter === 'online' ? 'selected' : ''}
        >
          ONLINE
        </button>
        <button
          onClick={() => this.toggleFilter('offline')}
          className={filter === 'offline' ? 'selected' : ''}
        >
          OFFLINE
        </button>
      </div>
    );
  };

  inputBlured = e => {
    if (e.target.value !== '') return;
    this.resetInput(e);
  };

  inputFocused = () => {
    this.setState({
      searchActive: true
    });
  };

  search = e => {
    let { searchTerm, usersData } = this.state;
    e.preventDefault();
    if (!searchTerm || !usersData.length) return;
    let result1 = usersData.filter(single => {
      return single.user.toLowerCase().includes(searchTerm.toLowerCase());
    });
    let result2 = usersData.filter(single => {
      if (single.channels.status === null) return false;
      return single.channels.status
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    this.setState({
      filter: 'all',
      isSearch: true,
      searchResult: [...result1, ...result2]
    });
  };

  inputChanged = e => {
    this.setState({
      searchTerm: e.target.value
    });
  };

  resetInput = e => {
    e.preventDefault();
    this.setState({
      searchTerm: '',
      isSearch: false,
      searchResult: [],
      searchActive: false
    });
    this.searchInput.value = '';
  };

  showSearchForm = () => {
    let { usersData, searchActive } = this.state;
    if (!usersData.length) return null;
    let searchClass = searchActive ? 'search active' : 'search';
    return (
      <div className="search-container">
        <form
          onSubmit={this.search}
          className={searchClass}
          onBlur={this.inputBlured}
          onFocus={this.inputFocused}
          onChange={this.inputChanged}
        >
          <input ref={r => (this.searchInput = r)} />
          <button className="del" type="reset" onClick={this.resetInput} />
        </form>
      </div>
    );
  };

  showSearchResult = () => {
    let { usersData } = this.state;
    if (!usersData) return null;
  };

  singleUser = (user, index) => {
    let name = user.channels.display_name;
    let statusClass = user.streams.stream !== null ? 'status online' : 'status';
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
        rel="noopener noreferrer"
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
  };

  showUsers = () => {
    let { usersData, filter, searchResult, isSearch } = this.state;
    if (!usersData.length) return null;
    usersData = isSearch ? searchResult : usersData;
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
        return this.singleUser(user, index);
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
          <h1 className="header">Twitch Streamers</h1>
          {this.showSearchForm()}
          {this.showFilter()}
          {this.showUsers()}
          {this.showSpinner()}
        </div>
      </div>
    );
  }
}

export default App;
