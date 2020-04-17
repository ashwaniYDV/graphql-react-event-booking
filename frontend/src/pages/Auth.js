import React, { Component, Fragment } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

const { SERVER_URL } = require('../helpers/configs')

class AuthPage extends Component {
  state = {
    isLogin: true,
    isLoading: false,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailElRef = React.createRef();
    this.passwordElRef = React.createRef();
    this.nameElRef = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = async (e) => {
    e.preventDefault();
    const email = this.emailElRef.current.value;
    const password = this.passwordElRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
            user {
              name
              email
            }
          }
        }
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!this.state.isLogin) {
      const name = this.nameElRef.current.value;
      if (name.trim().length === 0) {
        return;
      }
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!, , $name: String!) {
            createUser(userInput: {email: $email, password: $password, name: $name}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
          name: name,
        },
      };
    }

    try {
      this.setState({
        isLoading: true,
      });
      const res = await fetch(SERVER_URL, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      console.log(resData);
      if (resData && resData.data && resData.data.login && resData.data.login.token) {
        const { token, userId, tokenExpiration, user } = resData.data.login;
        this.context.login(token, userId, tokenExpiration, user);
      }
      if (!this.state.isLogin) {
        this.emailElRef.current.value = ''
        this.passwordElRef.current.value = ''
        this.nameElRef.current.value = ''
      }
      this.setState({
        isLoading: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailElRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordElRef} />
        </div>
        {!this.state.isLogin && (
          <Fragment>
            <div className="form-control">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" ref={this.nameElRef} />
            </div>
            <div className="form-actions">
              <button type="submit">Signup</button>
              <button type="button" onClick={this.switchModeHandler}>
                Already have an account
              </button>
            </div>
          </Fragment>
        )}
        {this.state.isLogin && (
          <div className="form-actions">
            <button type="submit">
              Login {isLoading ? <span>...</span> : null}
            </button>
            <button type="button" onClick={this.switchModeHandler}>
              Don't have an account
            </button>
          </div>
        )}
      </form>
    );
  }
}

export default AuthPage;
