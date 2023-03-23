import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { Button, Card, Grid, Container, Image, Modal } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import ModalComp from '../components/ModalComp';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, 'users'),
      snapshot => {
        let list = [];
        snapshot.docs.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUsers(list);
        setLoading(false);
      },
      error => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  const handleModal = item => {
    setOpen(true);
    setUser(item);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delet this User?')) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, 'users', id));
        setUser(user.filter(u => u.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container>
      <Card.Group>
        <Grid columns="2" stackable>
          {users &&
            users.map(ur => (
              <Grid.Column key={ur.id}>
                <Card>
                  <Card.Content>
                    <Image
                      src={ur.img}
                      size="medium"
                      style={{
                        height: '150px',
                        width: '150px',
                        borderRadius: '15%',
                      }}
                    />
                    <Card.Header style={{ marginTop: '10px' }}>
                      {ur.name}
                    </Card.Header>
                    <Card.Description>{ur.info}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div>
                      <Button
                        color="green"
                        onClick={() => navigate(`/update/${ur.id}`)}
                      >
                        Update
                      </Button>
                      <Button color="blue" onClick={() => handleModal(ur)}>
                        View
                      </Button>

                      {open && (
                        <ModalComp
                          open={open}
                          setOpen={setOpen}
                          handleDelete={handleDelete}
                          {...user}
                        />
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
        </Grid>
      </Card.Group>
    </Container>
  );
};
export default Home;
