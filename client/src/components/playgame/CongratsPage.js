import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllGameChallenges, setCurrentChallengeIndex, getGameId, setGamePoints, getGameInfo } from '../../actions/index';
import config from '../../../config/config';

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getAllGameChallenges, setCurrentChallengeIndex, getGameId,setGamePoints, getGameInfo }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    userId: state.client.userIdentity,
    gameId: state.play.gameId,
    gameInfo: state.play.gameInfo,
    challenges: state.play.allChallenges,
    currentChallengeIndex: state.play.currentChallengeIndex,
    gamePoints: state.play.gamePoints
  }
}

class CongratsPage extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      userPoints: 0
    };
  }

  componentDidMount() {
    let earnedPoints = this.props.gamePoints + Math.ceil(this.props.gameInfo.rewardPoints/this.props.challenges.length) + 500;
    this.props.setGamePoints(earnedPoints);
    
    fetch(`${config.localhost}/api/user/findUserPoints/?userId=${1}`)
    .then(response => response.json())
    .then(data => this.setState({userPoints: data.rewardPoints}))
    .then(() => {
      fetch(`${config.localhost}/api/user/updateRewardPoints/`,
        {
          method: 'POST',
          headers: {"Content-type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({userId: 1,
          rewardPoints: this.props.gamePoints + this.state.userPoints})
        })
    })
    .catch(err => console.error(err))
  }

  handleClick(route) {
    if(route === 'homepage') {
      Actions.homepage({type: 'reset'})
      // this.props.getGameId(null);
      // this.props.getAllGameChallenges([]);
      // this.props.setCurrentChallengeIndex(0);
      // this.props.setGamePoints(0);
      // this.props.getGameInfo({});
    }
    else if(route === 'leaderboard') {Actions.leaderboard({type: 'reset'})};
  }

  render() {
    return(
      <View style={styles.container}>
      <Text style={styles.welcome}>You Won! You Earned A Total Of:</Text>
      <Text style={styles.points}>{this.props.gamePoints}</Text>
      <Text style={styles.welcome}>Points From This Game!!!</Text>
      <Text onPress={() => this.handleClick('homepage')}>Back to Home</Text>
      <Text onPress={() => this.handleClick('joingame')}>Play Another</Text>
      <Text onPress={() => this.handleClick('leaderboard')}>Leaderboard</Text>
    </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006400',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
  points: {
    fontSize: 40,
    textAlign: 'center',
    color: '#00008B'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CongratsPage);