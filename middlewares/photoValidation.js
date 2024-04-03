const { body } = require("express-validator");

const photoValidation = () => {
    return [
        body("title")
        .not()
        .equals("undefined")
        .withMessage("O título indefinido!")
        .isString()
        .withMessage("O título é obrigatório!")
        .isLength({ min: 3})
        .withMessage("O título precisar ter pelo menos 3 caracteres!"),
        body("image").custom((value, {req}) => {
            if(!req.file) {
                throw new Error("Adicione uma imagem para continuar!");
            }
            return true;
        }),
    ];
}

const photoUpdateValidation = () => {
    return [
        body("title")
        .optional()
        .isString()
        .withMessage("O título é obrigatório!")
        .isLength({ min: 3})
        .withMessage("O título precisar ter pelo menos 3 caracteres!"),
    ];
};

const commentValidation = () => {
    return [
        body("comment")
        .isString()
        .withMessage("O comentário é obrigatório!")
        .isLength({ min: 3})
        .withMessage("O comentário precisar ter pelo menos 3 caracteres!"),
    ]
}

module.exports = { photoValidation, photoUpdateValidation, commentValidation };