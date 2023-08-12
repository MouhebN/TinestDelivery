const magasinierModel = require('../Models/magasinier');

exports.ajouterMagasinier = (req, res) => {
    const magasinierObj = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        agence: req.body.agence,
        telephone: req.body.telephone
    };

    const magasinier = new magasinierModel(magasinierObj);

    magasinier.save()
        .then(createdMagasinier => {
            res.status(200).json({ createdMagasinier });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.modifierMagasinier = (req, res) => {
    const magasinierId = req.params.id;
    const modifiedMagasinier = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        agence: req.body.agence,
        telephone: req.body.telephone
    };

    magasinierModel.findByIdAndUpdate(magasinierId, modifiedMagasinier)
        .then(updatedMagasinier => {
            res.status(200).json({ message: 'Magasinier modifié avec succès' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.supprimerMagasinier = (req, res) => {
    const magasinierId = req.params.id;
    magasinierModel.findByIdAndDelete(magasinierId)
        .then(deletedMagasinier => {
            res.status(200).json({ message: 'Magasinier supprimé avec succès' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.listerMagasiniers = (req, res) => {
    magasinierModel.find({})
        .then(magasiniersList => {
            res.status(200).json({ magasiniersList });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};
