import React, {useContext, useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {AuthContext} from '../context/auth'
import {UseForm} from '../util/hooks'


function Register(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = UseForm(registerUser, {
        username: '',
        email : '',
        password: '',
        confirmPassword : ''
    } )

    const[addUser , {loading}] = useMutation(REGISTER_USER, { 

        update(_,{data:{ register: userData}}){
            context.login(userData)
            props.history.push('/')
        
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        
            
        }, 
        variables: values
    })
   

    function registerUser() {
        addUser()
    }




    return (
    <div className='form-ui'>
        <Form  onSubmit={onSubmit} noValidate className={loading ? "loading" : ""} >
            <h1>Register</h1>
            <Form.Input label='username' placeholder='Username..' name='username' value={values.username} error={errors.username ? true : false} onChange={onChange}/>
            <Form.Input label='Email' placeholder='Email..' name='email' value={values.email} error={errors.email ? true : false} onChange={onChange}/>
            <Form.Input type='password' label='Password' placeholder='Password..' name='password' error={errors.password ? true : false} value={values.password} onChange={onChange}/>
            <Form.Input type='password' label='Confirm Password' placeholder='Conform Password..' name='confirmPassword' error={errors.confirmPassword ? true : false} value={values.confirmPassword} onChange={onChange}/>
            <Button type='submit' primary >
                Register
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
const REGISTER_USER = gql`
    mutation register(
        $username : String!
        $email : String!
        $password : String!
        $confirmPassword : String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword : $confirmPassword
            }
        ){
            id email username createdAt token 
        }
    }
`

export default Register; 