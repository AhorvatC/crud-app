import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Loader } from 'semantic-ui-react';
import { storage, db } from 'C:/Users/Andrei/my-curd-app/src/Firebase.js';
import { useParams, useNavigate } from 'react-router-dom';

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const UserForms = {
  name: '',
  email: '',
  info: '',
  contact: '',
  website: '',
};

const User = () => {
  const [data, setData] = useState(UserForms);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setError] = useState({});
  const [isSubmit, setisSumit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('Uploade is paused');
              break;
            case 'running':
              console.log('Upload Running');
            default:
              break;
          }
        },
        error => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
            setData(prev => ({ ...prev, img: downloadUrl }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const { name, email, info, contact, website } = data;

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = 'Name is required!';
    }
    if (!email) {
      errors.email = 'Email is required!';
    }
    if (!contact) {
      errors.contact = 'Contact is required!';
    }
    if (!website) {
      errors.website = 'Website is required!';
    }
    return errors;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setError(errors);
    setisSumit(true);
    if (!id) {
      try {
        await addDoc(collection(db, 'users'), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, 'users', id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }

    navigate('/');
  };
  return (
    <div>
      <Grid
        centered
        verticalAlign="middle"
        columns="3"
        style={{ height: '60vh' }}
      >
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active inline="centered" size="huge" />
              ) : (
                <>
                  <h2>{id ? 'Update User' : 'Add User'}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="Name"
                      error={errors.name ? { content: errors.name } : null}
                      placeholder="Enter Name"
                      name="name"
                      onChange={handleChange}
                      value={name}
                      autoFocus
                    ></Form.Input>
                    <Form.Input
                      label="Website"
                      error={
                        errors.website ? { content: errors.website } : null
                      }
                      placeholder="Enter Website"
                      name="website"
                      onChange={handleChange}
                      value={website}
                      autoFocus
                    ></Form.Input>
                    <Form.Input
                      label="Email"
                      error={errors.email ? { content: errors.email } : null}
                      placeholder="Enter Email"
                      name="email"
                      onChange={handleChange}
                      value={email}
                      autoFocus
                    ></Form.Input>
                    <Form.TextArea
                      label="Info"
                      placeholder="Enter Info"
                      name="info"
                      onChange={handleChange}
                      value={info}
                    ></Form.TextArea>
                    <Form.Input
                      label="Contact"
                      error={
                        errors.contact ? { content: errors.contact } : null
                      }
                      placeholder="Enter contact"
                      name="contact"
                      onChange={handleChange}
                      value={contact}
                      autoFocus
                    ></Form.Input>
                    <Form.Input
                      label="Upload"
                      type="file"
                      onChange={e => setFile(e.target.files[0])}
                    ></Form.Input>
                    <Button
                      primary
                      type="submit"
                      disabled={progress !== null && progress < 100}
                    >
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};
export default User;
