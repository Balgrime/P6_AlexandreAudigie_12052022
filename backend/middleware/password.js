const passwordValidator = require("password-validator");



const passwordSchema = new passwordValidator();


passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(19)                                  // Maximum length 19
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Password']); // Blacklist these values


module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        let test = passwordSchema.validate(req.body.password, { list: true });
        let errorMessage = [];
        if (test.includes("min"))
            errorMessage.push(["Le mot de passe doit contenir au moins 8 caractères."]);
        if (test.includes("uppercase"))
            errorMessage.push(["Le mot de passe doit contenir au moins 1 majuscule."]);
        if (test.includes("lowercase"))
            errorMessage.push(["Le mot de passe doit contenir au moins 1 minuscule."]);
        if (test.includes("digits"))
            errorMessage.push(["Le mot de passe doit contenir au moins 2 chiffres."]);
        if (test.includes("spaces"))
            errorMessage.push(["Le mot de passe ne doit pas contenir d'espaces."]);
        if (test.includes("max"))
            errorMessage.push(["Le mot de passe ne doit pas contenir plus de 19 caractères."]);
        if (test.includes("oneOf"))
            errorMessage.push(["Le mot de passe ne peut pas être trop évident comme \"Password\"."]);
        return res.status(400)
        .json({ message : errorMessage.join(" ")});
    }
}