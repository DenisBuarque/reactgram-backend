const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  mongoose = require('mongoose');

const genereteToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d"});
}

const register = async (req, res) => {

    const { name, email, password } = req.body;

    const user = await User.findOne({email: email});
    if(user){
        res.status(422).json({errors: ['O e-mail já esta sendo ultilizado!']});
        return;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const createUser = new User({
        name, 
        email,
        password: passwordHash
    });

    if(!createUser) {
        res.status(402).json({errors: ["Ocorreu algum erro, tente mais tarde!"]});
        return;
    }

    try {
        const newUser = await createUser.save();
 
        res.status(201).json({
            _id: newUser._id,
            token: genereteToken(newUser._id),
        });

        return;

    } catch (error) {
        res.status(422).json({ errors: error});
    }  
}

const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({email});
    if(!user) {
        res.status(404).json({errors: ["Usuário não encontrado!"]});
        return;
    }

    const matchePassword = await bcrypt.compare(password, user.password);
    if(!matchePassword) {
        res.status(422).json({errors: ["Senha inválida!"]});
        return;
    }

    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: genereteToken(user._id),
    });
    
}

const getCurrentUser = async (req, res) => {
    const user = req.user;
    res.status(200).json(user);
}

const upload = async (req, res) => {
    
    const { name, bio, password } = req.body;

    let profileImage = null;

    if(req.file) {
        profileImage = req.file.filename;
    }

    const user = await User.findById(new mongoose.Types.ObjectId(req.user._id)).select("-password");

    if(name) {
        user.name = name;
    }

    if(password){
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
    }

    if(profileImage) {
        user.profileImage = profileImage;
    }

    if(bio) {
        user.bio = bio;
    }

    await user.save();

    res.status(200).json(user);
}

const getUserById = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password");
        if(!user) {
            res.status(404).json({ errors: ["Usuário não encontrado!"]});
            return;
        }

        res.status(200).json(user);
        
    } catch (error) {
        res.status(404).json({ errors : ["Usuário desconhecido..."]});
    }
}

module.exports = {register, login, getCurrentUser, upload, getUserById};
