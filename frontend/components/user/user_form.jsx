import React from 'react';
import { withRouter, Redirect } from 'react-router';
import { Link } from 'react-router';

class UserForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  componentDidMount(){
    let {name} = this.props.params;
    if (name) {
      this.guestLogin(name);
    }
  }
  componentWillReceiveProps(nextProps){
    // debugger;
    let {name} = nextProps.params;
    let path = this.props.location.pathname;
    let newPath = nextProps.location.pathname;
    let toLogin = (nextProps.formType === 'logIn');
    if (Boolean(name) && (path !== newPath) && toLogin ) {
      this.guestLogin(name);
    }
  }
  update(property) {
    return (e) => ( this.setState({ [property]: e.target.value }));
  }
  handleSubmit() {
    return (e) => {
      e.preventDefault();
      let user = this.state;
      this.props.processForm(user).then(() => this.redirect() );
    };
  }
  redirect() {
    this.props.router.push("/");
  }
  guestLogin(name){
    const callback = (arr, time) => {
      if (arr.length > 0) {
        let newState = Object.assign({}, this.state);
        let letter = arr.shift();
        newState.password += letter;
        newState.username += letter;
        this.setState(newState);
        setTimeout(callback.bind(this), time, arr, time);
      } else {
        setTimeout(() => (document.getElementsByName("submit")[0].click()), 500);
      }
    };
    let arr = name.split('');
    let milisecTime = 100;
    setTimeout(callback.bind(this), milisecTime, arr, milisecTime);
  }
  render(){
    let { username, password } = this.state;
    let { formType } = this.props;
    let buttonTxt, otherPlace, guestLink;
    if (formType === 'signUp') {
      buttonTxt = 'Sign Up';
      otherPlace = ["/login", "Log In"];
    } else {
      buttonTxt = "Log In";
      otherPlace = ["/signup", "Sign Up"];
      guestLink = (<Link onClick={() => this.guestLogin.call(this, "Guesty")} className='button login'>Guest Login</Link>);
    }

    let { errors } = this.props;
    if (errors) {
      errors = errors.map( (error, i) => <li key={i}>{error}</li>);
      errors = (<ul className='error'>{errors}</ul>);
    }
    return (
      <form className='userform'>
        <h2>{buttonTxt}</h2>
        {errors}
        <label htmlFor='username'>Username
          <input type='text' name='username'
            value={username}
            onChange={this.update('username')} ></input>
          </label>
          <label>Password
          <input type='password' name='password'
            value={password}
            onChange={this.update('password')} ></input>
          </label>
        {guestLink}
        <button name='submit' onClick={this.handleSubmit()}>{buttonTxt}</button>
        <br/><br/>
        <Link to={otherPlace[0]}>{otherPlace[1]}</Link>
      </form>
    );
  }
}

export default withRouter(UserForm);