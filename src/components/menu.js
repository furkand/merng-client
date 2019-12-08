import React, { useState, useContext } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/auth'

function MenuBar() {
  const {user, logout} =  useContext (AuthContext)
  const pathName = window.location.pathname 
  const path = pathName === '/' ? 'home' : pathName.substr(1) // substr ile birden sonrasını al demiş oluyoruz
  const [activeItem, setActiveItem] = useState(path);

   
   
  const handleItemClick = (e, { name }) => setActiveItem(name);
  

  const menuBar = user ? (
    <Menu pointing secondary size ='massive' color='teal'>
    <Menu.Item
      name={user.username}
      active
      as = {Link}
      to = '/'
    />
    <Menu.Menu position='right'>
    <Menu.Item
      name='Logout'
      onClick={logout}
      as = {Link}
      to = '/login'
    />
    </Menu.Menu>
  </Menu>

  ) : (
    <Menu pointing secondary size ='massive' color='teal'>
    <Menu.Item
      name='home'
      active={activeItem === 'home'}
      onClick={handleItemClick}
      as = {Link}
      to = '/'
    />
    <Menu.Item
      name='register'
      active={activeItem === 'register'}
      onClick={handleItemClick}
      as = {Link}
      to = '/register'

    />
    <Menu.Item
      name='login'
      active={activeItem === 'login'}
      onClick={handleItemClick}
      as = {Link}
      to = '/login'
    />

  </Menu>

  )

    return menuBar;
  }


export default MenuBar