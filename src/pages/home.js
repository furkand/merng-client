import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import PostCard from '../components/postCard'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'


function Home() {
  const { user } = useContext(AuthContext);


  const query = useQuery(FETCH_POSTS_QUERY)
  if(query.data){
    const {
        loading,
        data: { getPosts: posts }
      } = query
      console.log(posts);
      return (
       
        <Grid columns={3}>
          <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
          </Grid.Row>
          <Grid.Row>
            {user && (
              <Grid.Column>
                <PostForm />
              </Grid.Column>
            )}
              <Transition.Group>
                {posts &&
                  posts.map((post) => (
                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))}
              </Transition.Group>
            
          </Grid.Row>
        </Grid>
      );
      
  }else {
      return(<h1>Loading posts..</h1>)
  }
  


}

export default Home;