const User = require("../models/User");
const Photo = require("../models/Photo");
const { unlink } = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const user = await User.findById(req.user.id);

  const createPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  if (!createPhoto) {
    res.status(422).json({ errors: ["Houve um problema ao inserir a photo."] });
    return;
  }

  res.status(201).json(createPhoto);
};

const deletePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] });
      return;
    }

    if (!photo.userId.equals(req.user._id)) {
      res
        .status(404)
        .json({ errors: ["Foto não encontrada para esse usuário!"] });
      return;
    }

    // remove photo in folder
    const removePhoto = path.resolve(`uploads/photos/${photo.image}`);
    await unlink(removePhoto);

    await Photo.findByIdAndDelete(photo._id);

    return res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso!" });
  } catch (error) {
    res.status(422).json({ errors: ["Ocorreu um error ao excluir a foto!"] });
    return;
  }
};

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

const getUserPhotos = async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  return res.status(200).json(photo);
};

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] });
      return;
    }

    if (!photo.userId.equals(req.user._id)) {
      res
        .status(422)
        .json({ errors: ["Você não pode alterar o foto que não é sua."] });
      return;
    }

    if (title) {
      photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
  } catch (error) {
    res.status(404).json({ errors: ["Ocorreu um erro, tente mais tarde!"] });
  }
};

const likePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] });
      return;
    }

    if (photo.likes.includes(req.user._id)) {
      res.status(422).json({ errors: ["Você já curtiu essa foto!"] });
      return;
    }

    await photo.likes.push(req.user._id);

    await photo.save();

    res.status(200).json({
      photoId: id,
      userId: req.user._id,
      message: "Obrigado pelo like na foto.",
    });
  } catch (error) {
    res.status(402).json({ errors: ["Ocorreu um erro tente mais tarde!"] });
  }
};

const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] });
      return;
    }

    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    res
      .status(200)
      .json({
        comment: userComment,
        message: "Comentário adicionado com sucesso!",
      });
  } catch (error) {
    res.status(422).json({ errors: ["Ocorreu um error, tente mais tarde!"] });
  }
};

const searchPhoto = async (req, res) => {

    const { q } = req.query;

    const photos = await Photo.find({title: new RegExp(q, 'i')}).exec();

    res.status(200).json(photos);
}

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhoto
};
