var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  follow: function() {
    this.setState({isLoadingFollowers: true});
    $.post('/follow', function(res) {
      this.props.onFollow();
    }.bind(this));
  },

  render: function() {
    var me = this.props.me;
    var error;
    if (me.amount === 0) {
      if (!me.user.god && me.followerCt >= me.privilege.count) {
        error = 'You have reached the maximum amount of followers. Refer some friends to increase your limit!';
      } else {
        error = 'There aren\'t enough users on the website to get you more followers. Refer your friends to increase your follower count!';
      }
    }

    var me = this.props.me;
    if (error) {
      getFollowers = <p>{error}</p>;
    } else {
      getFollowers = (
        <div>
          <p>Hi {me.user.login}!</p>
          <p>You can get <strong>{me.amount}</strong> more follower{me.amount === 1 ? '' : 's'} by clicking the button below!</p>
          <button id="getFollowers" className="btn btn-primary btn-lg" onClick={this.follow} disabled={this.state.isLoadingFollowers}>{this.state.isLoadingFollowers ? 'Loading...' : 'Get Followers'}</button>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-md-12 text-center">
          <h1 className="page-header">Get followers</h1>
          {getFollowers}
          <a className="btn btn-danger" href="/logout">Logout</a>
        </div>
      </div>
    );
  }
});
