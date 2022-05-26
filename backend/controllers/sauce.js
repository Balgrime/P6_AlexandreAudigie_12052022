const Sauce = require('../models/Sauce');

const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };



/*exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};*/



exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

/*exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};*/

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };




/*exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).json({
                    error: new Error('Sauce non trouvée')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error('Requête non autorisée ! (unauthorized user)')
                });
            }
            Sauce.deleteOne({_id: req.params.id}).then(
                () => {
                  res.status(200).json({
                    message: 'Deleted!'
                  });
                }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
        }
    );
};*/

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };



exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};









exports.changeLike = (req, res, next) => {
  console.log('la route like fonctionne');
    let currentId =  req.body.userId;
    let currentLike = req.body.like;
  console.log(currentLike);

   let intCurrentLike = parseInt(currentLike);



  
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        res.status(201).json({ message: 'Like modifié !'})
        if (intCurrentLike === 1){
        addLiking(sauce, currentId);

      } else if (intCurrentLike === 0){
        removeLiking(sauce, currentId);

      } else if (intCurrentLike === -1){
        addDisliking(sauce, currentId);

      };
    })
    .catch(error => res.status(400).json({ error }));
  };



function addLiking(sauce, currentId){
  if(sauce.usersLiked === [] || sauce.usersLiked.indexOf(currentId) === -1){
    sauce.likes += 1;
      console.log(sauce.likes);
    sauce.usersLiked.push(currentId);
      console.log(currentId);
      console.log(sauce.usersLiked);
    sauce.save();
  };
};


function addDisliking(sauce, currentId){
  if(sauce.usersDisliked === [] || sauce.usersDisliked.indexOf(currentId) === -1){
    sauce.dislikes += 1;
      console.log(sauce.dislikes);
    sauce.usersDisliked.push(currentId);
      console.log(currentId);
      console.log(sauce.usersDisliked);
    sauce.save();
  };
};

function removeLiking(sauce, currentId){
  if(sauce.usersLiked.indexOf(currentId) !== -1){
    sauce.likes -= 1;
    let positionUser = sauce.usersLiked.indexOf(currentId);
    sauce.usersLiked.splice(positionUser, 1);
    sauce.save();
  } else if (sauce.usersDisliked.indexOf(currentId) !== -1){
    sauce.dislikes -= 1;
    let positionUser = sauce.usersDisliked.indexOf(currentId);
    sauce.usersDisliked.splice(positionUser, 1);
    sauce.save();
  };
};