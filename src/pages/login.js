import React, {useContext, useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {AuthContext} from '../context/auth'
import {UseForm} from '../util/hooks'

function Login(props) {
    
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = UseForm(loginUserCallback, {
        username: '',
        password: ''
    } )
        const[loginUser , {loading}] = useMutation(LOGIN_USER, { 
            update(_,{data: {login:userData}}){
                console.log(userData);
                context.login(userData)
                props.history.push('/') 
            },
            onError(err){
       
                console.log(err.graphQLErrors[0].extensions.exception.errors);
                setErrors(err.graphQLErrors[0].extensions.exception.errors);
            
                
            }, 
            variables: values
        })
    

        function loginUserCallback() {
            loginUser ()
        }

      


    return (
    <div className='form-ui login-container' >
        <Form className='form-ui' onSubmit={onSubmit} noValidate className={loading ? "loading" : ""} >
            <h1>Login</h1>
            <Form.Input label='username' placeholder='Username..' name='username' value={values.username} error={errors.username ? true : false} onChange={onChange}/>
            <Form.Input type='password' label='Password' placeholder='Password..' name='password' error={errors.password ? true : false} value={values.password} onChange={onChange}/>
            <Button type='submit' primary >
                Login
            </Button>
        </Form>
       {Object.keys(errors).length > 0 && (
            <div className='ui error message'>
            <ul className='list'>
                {Object.values(errors).map(value=>(
                <li key={value}>{value}</li>
                ))}
            </ul>
        </div>
       )}
    </div>
    )
}

//firs define data type 
//second define register input and asign the variables which you defined at first step
//third return callback
const LOGIN_USER = gql`
    mutation login(
        $username : String!
        $password : String!
    ){
        login(
            
                username: $username
                password: $password
            
        ){
            id email username createdAt token 
        }
    }
`

export default Login; 