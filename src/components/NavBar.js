import { Menu, Container, Button, Image } from 'semantic-ui-react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import React from 'react';

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <Menu
      inverted
      borderless
      style={{ padding: '0.3rem', marginBottom: '20px' }}
      attached
    >
      <Container>
        <Menu.Item name="home">
          <Link to="/">
            <Image size="mini" icon="home"></Image>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <h2>React CRUD APP with upload image</h2>
        </Menu.Item>
        <Menu.Item position="right">
          <Button size="mini" primary onClick={() => navigate('/add')}>
            Add user
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
export default NavBar;
