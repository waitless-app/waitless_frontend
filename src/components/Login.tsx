interface LoginProps {
    token: string;
}

const Login: React.FC<LoginProps> = (props) => <h1>Hello, {props.token}</h1>

export default Login;