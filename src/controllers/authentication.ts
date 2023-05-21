import express from 'express';
import { createUser, getUserByEmail } from 'db/users';
import { authentication, random } from 'helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // get the user input from the request body
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('Missing fields');
    }

    // check if the user already exists in the database
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).send('User already exists');
    }

    // create the user
    const salt = random();
    const newUser = await createUser({
      email,
      username,
      password: authentication(salt, password),
    });

    // send the user object back to the client
    res.status(201).json(newUser).end();
  } catch (error) {
    console.log(error);
    res.send(400);
  }
};
