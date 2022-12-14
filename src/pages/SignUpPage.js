import {Component} from "react";
import axios from "axios";

class SignUpPage extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
        apiProgress: false,
        signUpSuccess: false
    }
    onChange = (event) => {
        const {id, value} = event.target;
        this.setState({
            [id]: value
        });
    }
    submit = async (event) => {
        event.preventDefault();
        const {username, email, password} = this.state;
        const body = {
            username, email, password
        }
        this.setState({apiProgress: true});
        try {
            await axios.post("/api/1.0/users", body);
            this.setState({signUpSuccess: true})
        } catch(error) {};
    }

    render() {
        let disabled = true;
        const {password, passwordRepeat, apiProgress, signUpSuccess} = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat;
        }
        return (
           <div className={"col-lg-6 offset-lg-3 offset-md-2 col-md-8"}>
               {!signUpSuccess && ( <form className={"card mt-5"} data-testid = "form-sign-up">
                    <div className={"card-header"}>
                        <h1 className={"text-center"}>Sign Up</h1>
                    </div>
                    <div className={"card-body"}>
                        <div className={"mb-3"}>
                            <label htmlFor="username" className={"form-label"}>Username</label>
                            <input id="username" className={"form-control"} onChange={this.onChange}/>
                        </div>
                        <div className={"mb-3"}>
                            <label className={"form-label"} htmlFor="email">E-mail</label>
                            <input className={"form-control"} id="email" onChange={this.onChange}/>
                        </div>
                        <div className={"mb-3"}>
                            <label className={"form-label"} htmlFor="password">Password</label>
                            <input className={"form-control"} type="password" id="password" onChange={this.onChange}/>
                        </div>
                        <div className={"mb-3"}>
                            <label className={"form-label"} htmlFor="passwordRepeat">Password Repeat</label>
                            <input className={"form-control"} type="password" id="passwordRepeat"
                                   onChange={this.onChange}/>
                        </div>
                        <div className={"text-center"}>
                            <button
                                className={"btn btn-primary"}
                                disabled={disabled || apiProgress}
                                onClick={this.submit}
                            >
                                {apiProgress && <span className="spinner-border spinner-border-sm" role="status"
                                      aria-hidden="true"></span>}
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>)}
                {signUpSuccess && <div className="alert alert-success mt-3" role="alert">
                    Please check you email to activate your account
                </div>}
            </div>
        )
    }
}

export default SignUpPage;
