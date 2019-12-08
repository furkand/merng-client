import React, {useContext, useState} from 'react'
import gql from 'graphql-tag'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { Grid , Button, Card, Image, Form, Icon, Label} from 'semantic-ui-react';
import moment from 'moment'
import {AuthContext} from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'



function SinglePost (props) {
    let postMarkup;
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext)
    const [comment, setComment] = useState('')
    console.log(postId);
    
    const {loading,error,data} = useQuery(FETCH_POST_QUERY, {variables : {postId}})
    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('')
        },
        variables : {
            postId,
            body : comment
        }
    })
    function deleteButtonCallback() {
        props.history.push('/')
    }
    console.log('my data')
    console.log(data)
    if(data){
        console.log('data after the if clouse')
        console.log(data)
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
          } = data.getPost
          console.log('single post is here: ' )
          console.log(body)
          postMarkup = (
            <Grid>
                <div style={{margin:'auto', marginTop: 20}}>
                <Grid.Row >
                    <Grid.Column width={2}>
                         <Image 
                             src='https://react.semantic-ui.com/images/avatar/large/molly.png' 
                             size='small'
                             float='right'
                             style={{ borderRadius: 81, margin: 'auto', marginBottom:30}}
                         />
                    </Grid.Column>
                    <Grid.Column width={10}>
                         <Card fluid >
                             <Card.Content>
                                 <Card.Header>{username}</Card.Header>
                                 <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                 <Card.Description>{body}</Card.Description>
                                 <Card.Content extra >
                                     <LikeButton user={user} post={{id, likeCount, likes}}  />
                                     <Button as='div' labelPosition='right' onClick={ ()=> {console.log('commented')}}>
                                         <Button basic color='blue'>
                                             <Icon name='comments'/>
                                         </Button>
                                         <Label basic color='blue' pointing='left'>
                                             {commentCount} 
                                         </Label>
                                     </Button>
                                     {user&&user.username === username && (<DeleteButton postId={id} callback={deleteButtonCallback} />)}
                                 </Card.Content>
                             </Card.Content>
                         </Card>
                         {user && (
                             <Card fluid >
                                <Card.Content>
                                    <p> Post a comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <input type='text' placeholder='Comment..' value={comment} name='comment' onChange={ event=> setComment(event.target.value)} />
                                            <button type='submit'  disabled= {comment.trim() === ''} onClick={submitComment} >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                             </Card>
                         )}
                         {comments.map( comment => (
                             <Card fluid key={comment.id} >
                                 <Card.Content>
                                     {user&& user.username === comment.username && (
                                         <DeleteButton postId={id} commentId={comment.id} />
                                     )}
                                    <Card.Header> {comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                 </Card.Content>
                             </Card>
                         ))}
                    </Grid.Column>
                    
                </Grid.Row>
                </div>
            </Grid>
        )
        return postMarkup

    } else {
        postMarkup = <p>Post Loading </p>
        return postMarkup
    }
    
    
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!) {
        createComment(postId : $postId, body:$body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id 
            body 
            createdAt 
            username 
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id 
                username 
                createdAt 
                body
            }
        }
    }
`

export default SinglePost