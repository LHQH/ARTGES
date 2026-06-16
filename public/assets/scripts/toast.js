function showToast(message, isError = false) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: isError ? "#e74c3c" : "#2ecc71",
        },
    }).showToast();
}

// Affichage des toasts selon les paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);

const errorMessages = {
    id_failed: "Identifiant ou mot de passe invalide",
    add_failed: "Un problème est survenue lors de la création",
    assign_failed: "Échec de l'assignation",
    update_failed: "Échec de la modification",
    delete_failed: "Échec de la suppression",
    validate_failed: "Échec de la validation",
    register_failed: "Un problème est survenue pendant la création",
    invalid_lastName:"Le nom renseigné est invalide",
    invalid_name: "Le prénom renseigné est invalide",
    invalid_mail: "L'email renseigné est invalide",
    invalid_number: "Le numéro de telephone renseigné est invalide",
    invalid_street: "L'adresse renseignée est invalide",
    invalid_postCode: "Le code postal renseigné est invalide",
    invalid_city: "La ville renseignée est invalide",
    invalid_siret: "Le SIRET renseigné est invalide",
    invalid_socialReason: "La raison social renseignée est invalide",
    invalid_password:"Le mot de passe doit contenir 8 caractére minimum, 1 MAJUSCULE, un nombre et 1 caractére special" 

};

const successMessages = {
    craftman_Added: "Entreprise enregistrée avec succès",
    client_added: "Client ajouté avec succès",
    client_updated: "Client modifié avec succès",
    client_deleted: "Client supprimé avec succès",
    construct_added: "Chantier ajouté avec succès",
    construct_updated: "Chantier modifié avec succès",
    construct_deleted: "Chantier supprimé avec succès",
    estimate_added: "Devis crée avec succès",
    estimate_deleted: "Devis supprimé avec succès",
    estimate_assigned: "Devis assigné avec succès",
    estimate_validated: "Devis validé avec succès"
};


const errorKey = urlParams.get("error");
const successKey = urlParams.get("success");

if (errorKey && errorMessages[errorKey]) {
    showToast(errorMessages[errorKey], true);
}

if (successKey && successMessages[successKey]) {
    showToast(successMessages[successKey], false);
}

if (errorKey || successKey) {
    window.history.replaceState({}, document.title, window.location.pathname);
}





