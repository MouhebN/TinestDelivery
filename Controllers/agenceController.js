const agenceModel = require('../Models/agence');

exports.ajouterAgence = (req, res) => {
    const agenceObj = {
        name: req.body.name,
        address: req.body.address,
        stock: req.body.stock,
        livreurs: req.body.livreurs,
        magasiniers: req.body.magasiniers
    };

    const agence = new agenceModel(agenceObj);

    agence.save()
        .then(createdAgence => {
            res.status(200).json({ createdAgence });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.modifierAgence = (req, res) => {
    const agenceId = req.params.id;
    const modifiedAgence = {
        name: req.body.name,
        address: req.body.address,
        stock: req.body.stock,
        livreurs: req.body.livreurs,
        magasiniers: req.body.magasiniers
    };

    agenceModel.findByIdAndUpdate(agenceId, modifiedAgence)
        .then(updatedAgence => {
            res.status(200).json({ message: 'Agence modifiée avec succès' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.supprimerAgence = (req, res) => {
    const agenceId = req.params.id;
    agenceModel.findByIdAndDelete(agenceId)
        .then(deletedAgence => {
            res.status(200).json({ message: 'Agence supprimée avec succès' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.listerAgences = (req, res) => {
    agenceModel.find({})
        .then(agencesList => {
            res.status(200).json({ agencesList });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};
