import React from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import {UseForm} from '../util/hooks'
import gql from 'graphql-tag'
import {FETCH_POSTS_QUERY} from '../util/graphql'

function PostForm(){
    const {values, onChange, onSubmit} = UseForm(createPostCallback , {
        body: ''
    });

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        variables: values, 
        update(proxy, result) {
            const data = proxy.readQuery({
            query : FETCH_POSTS_QUERY
        })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY, 
                data : {getPosts : [result.data.createPost, ...data.getPosts ]}
        });
            values.body = '';
        }
    });

    function createPostCallback (){
        createPost()
    }

    return(
    <>
        <Form  onSubmit={onSubmit}>
            <h2>Create a post: </h2>
            <Form.Field>
                <Form.Input
                placeholder='This is first post!'
                name='body'
                onChange={onChange}
                value={values.body}
                error={error ? true : false}
                />
                <Button type='submit' color='teal'>
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {error && (<div className='ui error message' style={{marginBottom:10}} >
            <ul className='list ' > 
                <li>{error.graphQLErrors[0].message}</li>
            </ul>
        </div>)}
    </>
    )
};

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            commentCount
            comments{
                id body username createdAt
            }
        }
    }
`

export default PostForm