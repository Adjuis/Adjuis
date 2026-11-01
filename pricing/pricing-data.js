/* ==========================================================================
   Adjuis -- shared pricing data, added 2026-11-02.

   This file is loaded by BOTH the Pricing page and the Client
   Questionnaire (see the <script src="pricing-data.js"> tag near the top
   of each one's <body>). PRICING and CATEGORIES used to live inside the
   Pricing page only -- they've been moved out here so both pages read the
   exact same numbers. Edit a price below and reopen either page and it's
   already there, no copying between files needed.

   This file itself still lives in four places, same as every tool page:
     /home/claude/pricing-data.js
     repo-build/adjuis/pricing/pricing-data.js
     repo-build/adjuis/questionnaire/pricing-data.js
     /mnt/user-data/outputs/pricing-data.js
   Each one needs to stay byte-identical to the others -- same as
   pricing-tool.html / questionnaire.html themselves -- or the two pages
   will drift apart again. Just tell Claude what to change and it'll keep
   all four in sync.
   ========================================================================= */

/* =========================================================================
   PRICING -- edit these numbers any time, the calculator recomputes from
   them, and the Questionnaire's investment-range options (further down in
   this file, see INVESTMENT_TIERS) are derived from the same numbers.
   ========================================================================= */
var PRICING = {
  /* your hourly rate by project type — Design covers Deck Design and
     Brand Guidelines */
  hourlyRates: {
    logoDesign: 110,
    artDirection: 110,
    creativeDirection: 130,
    design: 95
  },
  logoDesign: {
    /* NOTE: updated 2026-10-20 after a time-estimate check-in. Old numbers
       (4.5 hrs for the first concept + research, 4 hrs per extra concept,
       1 hr per revision, and no charge at all for file wrap-up) were
       undercounting real time spent, so this round raised the base and
       per-unit hours and folded in a flat file-wrap pass (see NOTE below).
       Hourly rate stayed at $110. Example at 3 logos / 2 revisions /
       2 colors / primary mark only: was $1,820, now $3,025 (+66%). Tune
       further anytime, same as the other NOTE blocks below. */
    /* minimum = ~7 hrs first concept + research ($770) + the flat 3.5-hr
       file wrap-up pass below ($385) = $1,155. Every project includes one
       wrap-up pass no matter how many concepts were explored (see the NOTE
       on hoursPerExtraLockupPiece), so it lives in the floor here rather
       than as a separate always-on line item. */
    minimum: 1155,
    hoursPerExtraLogo: 5.5, // each logo beyond the first
    hoursPerRevision: 2,    // every revision round, billed from the first one
    hoursPerColorOption: 1, // every color option, billed from the first one
    /* NOTE: file wrap-up (cleanup, organizing, naming conventions, and
       exporting final files), added 2026-10-20. This is one flat pass at
       the end (3.5 hrs, already folded into minimum above), not tied to
       how many concepts were explored. What DOES scale it is how many
       pieces are in the final logo system (a secondary mark, a tertiary
       lockup, etc.) -- each one beyond the primary mark adds this many
       extra hours to that same wrap-up pass. See fileWrapFee() and the
       "logo system pieces" question/state.lockupPieces. */
    hoursPerExtraLockupPiece: 1.5,
    unlimitedFlatFee: 15000, // flat "work until it's right" price, for revisions or colors
    turnaround: {
      /* NOTE: rush-fee model, v2. Every rush job gets the flat per-week fee
         below (so a small, simple project still shows a big % upcharge).
         On top of that, once a project has MORE than crunchLogoThreshold
         logo concepts, each extra logo adds its own per-week-faster fee —
         this is what makes a big, rushed project (9 logos in 1 week) cost
         noticeably more than a small rushed one, instead of the same flat
         $ either way. Example at 1 week turnaround: 1 logo (3 logos or
         fewer, no crunch) -> +$450 flat rush. 9 logos -> +$450 flat +
         (9-3 extra logos x 3 weeks faster x $60) = +$1,530 total. Tune
         every number here to match your real rate card. */
      normalWeeks: 4,              // standard, no-rush turnaround
      minWeeks: 1,                 // fastest you'll ever commit to
      perWeekFee: 150,             // flat $ added per week faster than normal, any project size
      crunchLogoThreshold: 3,      // 3 or fewer logo concepts never trigger the extra crunch fee below
      crunchFeePerExtraLogoPerWeek: 60 // per logo beyond the threshold, per week faster than normal
    },
    /* NOTE: revision-capacity cap, first pass. You said you can only turn
       around about 1 revision round per week once a project has more than
       3 logo concepts in it — below that, there's enough slack that
       revisions aren't limited by the timeline at all. So: 3 logos or
       fewer -> no cap, pick any revision count. More than 3 logos -> max
       revision rounds = turnaround weeks x revisionsPerWeek (at least 1).
       Example: 9 logos + 1 week -> max 1 revision. 9 logos + 4 weeks (the
       standard timeline) -> max 4. Tune noCapLogos / revisionsPerWeek to
       match how you actually work. */
    revisionCapacity: {
      noCapLogos: 3,
      revisionsPerWeek: 1
    }
  },
  brandGuidelines: {
    /* NOTE: $110/page is the flat rate from your own example math (20 pages
       = $2,200). At the $95/hr Design rate that works out to about 1.16
       hrs/page, not a clean number — let me know if you'd rather tie this
       to actual hours instead of a flat per-page price. */
    perPage: 110
  },
  /* NOTE: Design section, added 2026-10-21 (briefly removed and restored
     the next day per Corey -- that was a miscommunication, not a real
     change of mind). First-pass flat prices, loosely anchored to the
     $110/hr Logo Design rate (so they're defensible, not arbitrary) but
     rounded to clean numbers since these are meant to read as quick,
     simple, flat-rate pieces -- tune any of them anytime, same as
     everything else in this file. bundleDiscount is the 15% off this
     whole section when the client is ALSO getting Logo Design or a
     Branding Package (self-reported via the toggle in the Design view).
     businessCard and flyer are also reused directly by the Branding
     Package (see rawTotal() below), so don't rename those two keys. */
  design: {
    businessCard: 165,     // ~1.5 hrs
    favicon: 75,            // ~0.5-0.75 hr
    youtubeHeader: 125,     // ~1 hr
    socialPost: 125,        // ~1 hr, one template
    flyer: 220,              // ~2 hrs
    emailSignature: 85,     // ~0.75 hr
    bundleDiscount: 0.15
  },
  /* NOTE: Branding Package, added 2026-10-21. Not its own separate
     calculator -- it's the same Logo Design pricing (concepts/revisions/
     colors/lockup/turnaround) plus a Brand Guidelines booklet (see
     brandGuidelines.perPage above) plus a Business Card and a Flyer
     (design.businessCard / design.flyer), all added together and then
     given a slight reduction, per Corey: "slight" vs. the full 15%
     bundleDiscount on standalone Design add-ons above. */
  brandingPackage: {
    packageDiscount: 0.05
  },
  /* NOTE: retainer tiers, added 2026-10-21, first pass. Rates as given:
     $110/hr Art Direction, $150/hr Creative Direction. Weekly hours are
     Claude's recommendation (one standing weekly check-in + async
     availability, rather than multiple meetings a week, to protect the
     calendar across clients) -- hoursPerMonth = hoursPerWeek x ~4.33
     weeks/month, rounded to a clean number. Discount schedule reads
     Corey's "flat rate for the shorter plan, discount for longer ones"
     note as: 3 months flat (the baseline), discount growing through 12 --
     confirm/adjust the whole schedule, it's a guess at ambiguous shorthand. */
  retainers: {
    artDirection: { hourlyRate: 110, hoursPerWeek: 8, hoursPerMonth: 35 },
    creativeDirection: { hourlyRate: 150, hoursPerWeek: 6, hoursPerMonth: 26 },
    terms: [
      { months: 3, discount: 0 },
      { months: 6, discount: 0.05 },
      { months: 9, discount: 0.10 },
      { months: 12, discount: 0.15 }
    ]
  }
};

/* category grid on the Pricing page, and the option list for the Client
   Questionnaire's "What kind of project is this?" question -- add a
   category here and it shows up on both. */
var CATEGORIES = [
  { key:'design', title:'Design', copy:'Quick-turn pieces at flat rates: business cards, favicons, flyers, and more.', ready:true },
  { key:'logo-design', title:'Logo Design', copy:'A new logo, or a redesign of one you already have.', ready:true },
  { key:'branding', title:'Brand Design', copy:'Logo Design plus a brand guide, business card, and flyer, bundled with a discount.', ready:true },
  { key:'pitch-deck', title:'Pitch Deck Design', copy:'Clean, on-brand decks for pitching a show, series, or your business.', ready:false },
  { key:'art-direction', title:'Art Direction', copy:'An extra set of eyes and hands on a project already underway. Monthly retainer.', ready:true },
  { key:'creative-direction', title:'Creative Direction', copy:'Ongoing creative leadership for a campaign, redesign, or your team. Monthly retainer.', ready:true },
  { key:'consultation', title:'Consultation', copy:"A fresh set of eyes on a project you're too close to see clearly.", ready:false },
  { key:'web-design', title:'Web Design', copy:'A visual or experience refresh for your most front-facing tool.', ready:false }
];

/* =========================================================================
   INVESTMENT_TIERS -- added 2026-11-02, for the Client Questionnaire's
   "What investment range have you set aside for this project?" question.
   Per Corey's request, that question now offers exactly 3 picks per
   project type instead of free text: the minimum, a middle range, and an
   open-ended top option. Whichever category the client picked on the
   Project Type question looks itself up here by its `key` (matching
   CATEGORIES above).

   For the 5 categories with a real calculator above (logo-design,
   branding, design, art-direction, creative-direction) the minimum comes
   straight from PRICING, with the reasoning noted on each -- change a
   number in PRICING and these are worth revisiting, they aren't
   recalculated live off of it. For the 3 "Coming soon" categories
   (pitch-deck, consultation, web-design) there's no calculator built yet,
   so these are placeholder numbers only -- marked placeholder:true below,
   worth a real pass once those calculators exist.
   ========================================================================= */
var INVESTMENT_TIERS = {
  'logo-design': {
    // Minimum is PRICING.logoDesign.minimum itself ($1,155: first concept
    // + research, plus the flat file-wrap pass). The middle tier is sized
    // to comfortably hold a typical multi-concept project -- the NOTE on
    // PRICING.logoDesign gives $3,025 as the example at 3 logos / 2
    // revisions / 2 colors, right in the middle of this range.
    tiers: [
      { label:'$1,155 to $2,500', min:1155, max:2500 },
      { label:'$2,500 to $5,000', min:2500, max:5000 },
      { label:'$5,000+', min:5000, max:null }
    ]
  },
  'branding': {
    // Logo Design's minimum ($1,155) + a lean 10-page Brand Guidelines
    // booklet (10 x PRICING.brandGuidelines.perPage = $1,100, a guess at
    // a minimum page count -- confirm) + a Business Card and Flyer
    // (PRICING.design.businessCard + .flyer = $165 + $220), all at
    // PRICING.brandingPackage.packageDiscount (5%) off:
    // (1,155 + 1,100 + 165 + 220) x 0.95 = $2,508, rounded to $2,500.
    tiers: [
      { label:'$2,500 to $5,000', min:2500, max:5000 },
      { label:'$5,000 to $8,500', min:5000, max:8500 },
      { label:'$8,500+', min:8500, max:null }
    ]
  },
  'design': {
    // This category is a-la-carte (business cards, favicons, flyers,
    // etc.), so there's no single project minimum -- the floor used here
    // is the cheapest individual item, the favicon at $75. Buying nearly
    // everything in the category at once sums to about $795, which sets
    // the top of the middle tier.
    tiers: [
      { label:'$75 to $300', min:75, max:300 },
      { label:'$300 to $800', min:300, max:800 },
      { label:'$800+', min:800, max:null }
    ]
  },
  'art-direction': {
    // Monthly retainer, not a one-time project -- PRICING.retainers.
    // artDirection: $110/hr x 35 hrs/mo = $3,850/mo, the minimum monthly
    // commitment (the shortest, 3-month term carries no discount).
    tiers: [
      { label:'$3,850 to $6,000/mo', min:3850, max:6000 },
      { label:'$6,000 to $9,000/mo', min:6000, max:9000 },
      { label:'$9,000+/mo', min:9000, max:null }
    ]
  },
  'creative-direction': {
    // PRICING.retainers.creativeDirection: $150/hr x 26 hrs/mo = $3,900/mo.
    tiers: [
      { label:'$3,900 to $6,500/mo', min:3900, max:6500 },
      { label:'$6,500 to $10,000/mo', min:6500, max:10000 },
      { label:'$10,000+/mo', min:10000, max:null }
    ]
  },

  /* Placeholder tiers below -- these 3 categories are marked "Coming soon"
     on the Pricing page and have no calculator built yet, so there's
     nothing real to derive a minimum from. Revisit once that pricing
     exists; these numbers are a rough guess only. */
  'pitch-deck': {
    placeholder: true,
    tiers: [
      { label:'$800 to $2,000', min:800, max:2000 },
      { label:'$2,000 to $4,000', min:2000, max:4000 },
      { label:'$4,000+', min:4000, max:null }
    ]
  },
  'consultation': {
    placeholder: true,
    tiers: [
      { label:'$250 to $750', min:250, max:750 },
      { label:'$750 to $1,500', min:750, max:1500 },
      { label:'$1,500+', min:1500, max:null }
    ]
  },
  'web-design': {
    placeholder: true,
    tiers: [
      { label:'$2,500 to $6,000', min:2500, max:6000 },
      { label:'$6,000 to $12,000', min:6000, max:12000 },
      { label:'$12,000+', min:12000, max:null }
    ]
  }
};
