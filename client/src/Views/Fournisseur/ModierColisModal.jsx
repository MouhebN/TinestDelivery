import React from 'react';
import Modal from 'react-modal';
import ModifierColis from './ColisModif';

import '../../App.css';
Modal.setAppElement(document.body);

function ModifierColisModal({ isOpen, colis, onSave, onCancel }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            className="modal-container">
            <ModifierColis colis={colis} onSave={onSave} onCancel={onCancel} />
        </Modal>
    );
}

export default ModifierColisModal;