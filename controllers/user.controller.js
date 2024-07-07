import bcrypt from 'bcryptjs'
import User from '../model/user.model.js'

/** Fetching all users */
export const getAllUser = async(req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        return next(error);
    }

    if(!users || (Array.isArray(users) && users.length === 0)) {
        return res.status(404).json({message: "users not found"});
    }

    return res.status(200).json({users});
}

/** Registering new users */
export const signUp = async (req, res, next) => {
    const {name, email, password} = req.body;

    let existingUsers;
    try {
        existingUsers = await User.findOne({email});
    } catch (error) {
        return next(error);
    }

    if(existingUsers) {
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = bcrypt.hashSync(password);

    const userInfo = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });

    try {
        await userInfo.save();
    } catch (error) {
        return next(error);
    }

    return res.status(201).json({message: "Successfully registered new user", userInfo});
}

/** Signin users */
export const signIn = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return next(error);
    }

    if(!existingUser) {
        return res.status(404).json({message: "No user found with given credentials"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(400).json({message: "Incorrect credentials"});
    }

    return res.status(200).json({existingUser});
}