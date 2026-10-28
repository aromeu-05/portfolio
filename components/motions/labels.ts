import type { ProjectSlug } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

// Textes des motions destinés au visiteur : description pour les lecteurs d'écran (aria)
// et repère orange du geste clé (cue). Les écrans des produits, eux, restent en français.
export type MotionText = { aria: string; cue: string };

export const motionText: Record<Locale, Record<ProjectSlug, MotionText>> = {
  fr: {
    athos: {
      aria: "Animation : l'IA d'ATHOS lit le devis, remplit les champs du cadre, détecte une incohérence d'adresse entre devis et facture, puis l'instructeur valide le point.",
      cue: "À vous : validez le point",
    },
    rgc: {
      aria: "Animation du planning des départs de Rosie : l'accueil ouvre la partie de 07h40 sur La Mer, ajoute une joueuse proposée parmi les proches des joueurs déjà inscrits, règle son green-fee avec le carnet d'un partenaire et envoie le reste en caisse, puis la partie apparaît complète au planning.",
      cue: "À vous : encaissez la partie",
    },
    opportunity: {
      aria: "Animation de l'éditeur de scénarios d'Opportunity : un bloc Email est glissé sur la branche France, ses sorties possibles apparaissent aussitôt, puis une relance SMS est ajoutée sur la sortie « Aucune interaction ».",
      cue: "À vous : branchez la relance SMS",
    },
    vidal: {
      aria: "Animation : l'application Vidal Ma Santé scanne le code Datamatrix d'une boîte de médicament, affiche la fiche Spasfon avec les alertes liées au profil, puis l'utilisateur ajoute le médicament à son traitement.",
      cue: "À vous : ajoutez-le au traitement",
    },
  },
  en: {
    athos: {
      aria: "Animation: ATHOS's AI reads the quote, fills in the form fields, detects an address mismatch between quote and invoice, then the reviewer approves the flag.",
      cue: "Your turn: approve the flag",
    },
    rgc: {
      aria: "Animation of Rosie's tee sheet: the front desk opens the 7:40 tee time on La Mer, adds a player suggested from the registered players' contacts, pays her green fee with a partner's voucher book and sends the rest to the till, then the tee time shows as full.",
      cue: "Your turn: take the payment",
    },
    opportunity: {
      aria: "Animation of Opportunity's scenario editor: an Email block is dropped on the France branch, its possible outputs appear right away, then an SMS follow-up is added to the “No interaction” output.",
      cue: "Your turn: connect the SMS follow-up",
    },
    vidal: {
      aria: "Animation: the Vidal Ma Santé app scans a medicine box's Datamatrix code, shows the Spasfon drug page with profile-based alerts, then the user adds the medicine to their treatment.",
      cue: "Your turn: add it to the treatment",
    },
  },
};
