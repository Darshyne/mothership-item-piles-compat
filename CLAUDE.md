# mothership-item-piles-compat — Contexte module

## Identité

| Élément | Valeur |
|---|---|
| ID technique | `mothership-item-piles-compat` |
| Version actuelle | `1.0.7` |
| Foundry VTT | v13, vérifié `13.351` |
| Système ciblé | `mosh` (testé `0.6.0`) |
| Dépendances | `item-piles` (testé `3.2.32`), système `mosh` |

## Rôle

Couche de compatibilité déclarant à **Item Piles** où lire/écrire les
données MoSh : crédits, prix, quantités, types échangeables/non-empilables,
libellés de catégories traduits.

## Chemins de données déclarés

```js
CREDIT_PATH               = "system.credits.value"
ITEM_PRICE_ATTRIBUTE      = "system.cost"
ITEM_QUANTITY_ATTRIBUTE   = "system.quantity"
ACTOR_CLASS_TYPE          = "character"
UNSTACKABLE_ITEM_TYPES    = ["weapon", "armor"]
ITEM_FILTERS              = [{ path: "type", filters: "skill,class,ability,condition" }]
```

Monnaie affichée : `abbreviation: "{#} cr"` (⚠️ pas juste `"cr"` — sinon les
marchands n'affichent pas le montant, corrigé en v1.0.2).

## Structure

```
mothership-item-piles-compat/
├── module.json
├── scripts/
│   └── mothership-item-piles-compat.js
└── lang/
    ├── fr.json
    └── en.json
```

## Fonctions clés (`scripts/mothership-item-piles-compat.js`)

| Fonction | Rôle |
|---|---|
| `toNumber(value)` | Conversion sûre en nombre, `0` si invalide |
| `buildItemData(item)` | Ajoute `quantity = 1` aux armes/armures sans quantité, force `cost` en nombre |
| `getItemCost(item)` | Lit `system.cost`, retourne un nombre exploitable |
| `registerItemPilesIntegration()` | Enregistre l'intégration via `game.itempiles.API.addSystemIntegration(data, "0.6.0")` |

Hook d'enregistrement : `Hooks.once("item-piles-ready", registerItemPilesIntegration)`.

## Pourquoi ces choix (ne pas revenir dessus sans raison)

- **`ACTOR_CLASS_TYPE: "character"`** — seul type d'acteur MoSh adapté pour les piles/coffres/marchands Item Piles
- **`ITEM_FILTERS` = liste noire, pas liste blanche** — la doc Item Piles indique que ce champ exclut des types, il ne filtre pas positivement
- **`weapon`/`armor` non empilables** — deux armes identiques en apparence peuvent avoir munitions/états/mods différents ; les fusionner perdrait de l'info
- **`cost` forcé en nombre** — certaines données MoSh peuvent être stockées en string, source de bugs de calcul silencieux

## Historique important

- v1.0.0 → v1.0.4 : mise en place + notifications GM sur changement de crédits (ajoutées puis anti-dupliquées)
- v1.0.5 : traductions FR/EN des catégories (`TYPES.Item.*`)
- v1.0.6 : correction du ciblage whisper (uniquement GM actifs)
- **v1.0.7 (actuelle)** : retrait complet des notifications de crédits — le module revient à son rôle de compat pure

⚠️ Ne pas réintroduire les notifications de crédits sans demande explicite —
elles ont été retirées volontairement en v1.0.7. Les anciennes clés de lang
`MIPC.CreditsModifiedTitle`, `MIPC.Character`, `MIPC.Modification`,
`MIPC.ModifiedBy` traînent encore dans les fichiers de langue mais sont mortes.

## Limites connues / améliorations possibles

- Objets déjà présents dans des marchands avant installation du module peuvent nécessiter un retrait/replacement (anciens flags Item Piles)
- Pas de prise en charge dédiée pour `module`, `repair`, `crew` (items liés aux vaisseaux) si besoin futur de loot/marchands spatiaux
- Nettoyage possible des clés de lang mortes
