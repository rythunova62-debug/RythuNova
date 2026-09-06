// Flat key -> {en, te} dictionary. Deliberately not per-page nested objects —
// keeping every string in one place makes it easy to see what's translated
// and what isn't, and avoids import sprawl across ~30 page files.
export const translations = {
  "home.title": { en: "RythuNova", te: "రైతునోవా" },
  "home.tagline": {
    en: "Drone-based crop spraying, connecting West Godavari farmers with trained drone pilots.",
    te: "డ్రోన్ ఆధారిత పంట పిచికారీ — పశ్చిమ గోదావరి రైతులను శిక్షణ పొందిన డ్రోన్ పైలట్లతో కలుపుతుంది.",
  },
  "home.pilotSignup": { en: "Pilot Signup", te: "పైలట్ నమోదు" },
  "home.pilotLogin": { en: "Pilot Login", te: "పైలట్ లాగిన్" },
  "home.providerSignup": { en: "Drone Provider Signup", te: "డ్రోన్ ప్రొవైడర్ నమోదు" },

  "common.email": { en: "Email", te: "ఇమెయిల్" },
  "common.password": { en: "Password", te: "పాస్‌వర్డ్" },
  "common.confirmPassword": { en: "Confirm password", te: "పాస్‌వర్డ్ నిర్ధారించండి" },
  "common.name": { en: "Full name", te: "పూర్తి పేరు" },
  "common.phone": { en: "Phone (10 digits)", te: "ఫోన్ (10 అంకెలు)" },
  "common.village": { en: "Village", te: "గ్రామం" },
  "common.mandal": { en: "Mandal", te: "మండలం" },
  "common.district": { en: "District", te: "జిల్లా" },
  "common.pincode": { en: "Pincode", te: "పిన్‌కోడ్" },
  "common.address": { en: "Address", te: "చిరునామా" },
  "common.backHome": { en: "Back to home", te: "హోమ్‌కి తిరిగి వెళ్ళండి" },
  "common.loading": { en: "Loading...", te: "లోడ్ అవుతోంది..." },
  "common.save": { en: "Save", te: "సేవ్ చేయండి" },
  "common.saving": { en: "Saving...", te: "సేవ్ అవుతోంది..." },
  "common.logout": { en: "Logout", te: "లాగ్ అవుట్" },
  "common.signingOut": { en: "Signing out...", te: "లాగ్ అవుట్ అవుతోంది..." },
  "common.continue": { en: "Continue", te: "కొనసాగించండి" },
  "common.signIn": { en: "Sign in", te: "సైన్ ఇన్" },
  "common.signingIn": { en: "Signing in...", te: "సైన్ ఇన్ అవుతోంది..." },
  "common.accountCreated": {
    en: "Account created successfully. Please log in.",
    te: "ఖాతా విజయవంతంగా సృష్టించబడింది. దయచేసి లాగిన్ అవ్వండి.",
  },

  "pilotLogin.title": { en: "Pilot Login", te: "పైలట్ లాగిన్" },
  "pilotLogin.subtitle": { en: "Welcome back", te: "తిరిగి స్వాగతం" },
  "pilotLogin.newPilot": { en: "New pilot? Sign up", te: "కొత్త పైలట్? నమోదు చేసుకోండి" },
  "pilotLogin.forgotPassword": { en: "Forgot password?", te: "పాస్‌వర్డ్ మర్చిపోయారా?" },

  "pilotSignup.title": { en: "Pilot Signup", te: "పైలట్ నమోదు" },
  "pilotSignup.step1": {
    en: "Step 1 of 3 — Registration details and documents.",
    te: "3లో 1వ దశ — నమోదు వివరాలు మరియు పత్రాలు.",
  },
  "pilotSignup.licence": { en: "Drone driving licence", te: "డ్రోన్ డ్రైవింగ్ లైసెన్స్" },
  "pilotSignup.licenceHint": {
    en: "Upload a clear photo of the licence document",
    te: "లైసెన్స్ పత్రం యొక్క స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి",
  },
  "pilotSignup.photo": { en: "Your photo", te: "మీ ఫోటో" },
  "pilotSignup.photoHint": {
    en: "A clear face photo, used to confirm your identity",
    te: "మీ గుర్తింపు నిర్ధారించడానికి స్పష్టమైన ముఖ ఫోటో",
  },
  "pilotSignup.addDocument": { en: "+ Add document", te: "+ పత్రం జోడించండి" },
  "pilotSignup.tapToChange": { en: "Tap to change", te: "మార్చడానికి నొక్కండి" },
  "pilotSignup.uploading": { en: "Uploading...", te: "అప్‌లోడ్ అవుతోంది..." },
  "pilotSignup.alreadyHaveAccount": { en: "Already have an account? Log in", te: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి" },

  "checkEmail.title": { en: "Check Your Email", te: "మీ ఇమెయిల్ చూడండి" },
  "checkEmail.sentTo": {
    en: "We sent a verification link to",
    te: "ధృవీకరణ లింక్ పంపబడింది",
  },
  "checkEmail.instructions": {
    en: "Click the link in that email to continue. It expires in 30 minutes.",
    te: "కొనసాగించడానికి ఆ ఇమెయిల్‌లోని లింక్‌ని క్లిక్ చేయండి. ఇది 30 నిమిషాల్లో గడువు ముగుస్తుంది.",
  },
  "checkEmail.resend": { en: "Resend verification email", te: "ధృవీకరణ ఇమెయిల్ మళ్ళీ పంపండి" },
  "checkEmail.resendIn": { en: "Resend in", te: "మళ్ళీ పంపడానికి" },
  "checkEmail.resent": { en: "A new verification email has been sent.", te: "కొత్త ధృవీకరణ ఇమెయిల్ పంపబడింది." },
  "checkEmail.linkError": {
    en: "That verification link was invalid or has expired. Please register again or resend below.",
    te: "ఆ ధృవీకరణ లింక్ చెల్లదు లేదా గడువు ముగిసింది. దయచేసి మళ్ళీ నమోదు చేయండి లేదా కింద మళ్ళీ పంపండి.",
  },

  "credentials.title": { en: "Set Your Password", te: "మీ పాస్‌వర్డ్ సెట్ చేయండి" },
  "credentials.titleWithUsername": { en: "Create Your Credentials", te: "మీ లాగిన్ వివరాలు సృష్టించండి" },
  "credentials.subtitleWithUsername": {
    en: "Set a username and password to finish signup.",
    te: "నమోదు పూర్తి చేయడానికి యూజర్‌నేమ్ మరియు పాస్‌వర్డ్ సెట్ చేయండి.",
  },
  "credentials.newPassword": { en: "New password", te: "కొత్త పాస్‌వర్డ్" },
  "credentials.createAccount": { en: "Create account", te: "ఖాతా సృష్టించండి" },
  "credentials.creatingAccount": { en: "Creating account...", te: "ఖాతా సృష్టిస్తోంది..." },

  "pilotDashboard.editProfile": { en: "Edit Profile", te: "ప్రొఫైల్ మార్చండి" },
  "pilotDashboard.editProfileHint": { en: "Update your details", te: "మీ వివరాలను నవీకరించండి" },
  "pilotDashboard.orders": { en: "Orders", te: "ఆర్డర్లు" },
  "pilotDashboard.ordersHint": { en: "View and complete assigned orders", te: "కేటాయించిన ఆర్డర్లను చూసి పూర్తి చేయండి" },
  "pilotDashboard.ordersLocked": { en: "Available once your account is verified", te: "మీ ఖాతా ధృవీకరించబడిన తర్వాత అందుబాటులో ఉంటుంది" },
  "pilotDashboard.statusPending": { en: "Pending Verification", te: "ధృవీకరణ పెండింగ్‌లో ఉంది" },
  "pilotDashboard.statusVerified": { en: "Verified / Active", te: "ధృవీకరించబడింది / యాక్టివ్" },
  "pilotDashboard.statusRejected": { en: "Rejected", te: "తిరస్కరించబడింది" },
  "pilotDashboard.messagePending": {
    en: "Your profile is awaiting admin review. We're checking your drone licence against records — you'll be notified the moment you're verified.",
    te: "మీ ప్రొఫైల్ అడ్మిన్ సమీక్ష కోసం వేచి ఉంది. మేము మీ డ్రోన్ లైసెన్స్‌ని రికార్డులతో సరిపోల్చి చూస్తున్నాం — ధృవీకరించిన వెంటనే మీకు తెలియజేస్తాం.",
  },
  "pilotDashboard.messageVerified": {
    en: "You're verified and active. Orders will start appearing here.",
    te: "మీరు ధృవీకరించబడ్డారు మరియు యాక్టివ్‌గా ఉన్నారు. ఆర్డర్లు ఇక్కడ కనిపించడం మొదలవుతుంది.",
  },
  "pilotDashboard.messageRejected": {
    en: "Your licence could not be verified.",
    te: "మీ లైసెన్స్‌ని ధృవీకరించలేకపోయాం.",
  },
  "pilotDashboard.rating": { en: "rating", te: "రేటింగ్" },
  "pilotDashboard.reason": { en: "Reason", te: "కారణం" },

  "orders.myOrders": { en: "My Orders", te: "నా ఆర్డర్లు" },
  "orders.dashboard": { en: "Dashboard", te: "డాష్‌బోర్డ్" },
  "orders.total": { en: "Total orders", te: "మొత్తం ఆర్డర్లు" },
  "orders.pending": { en: "Pending", te: "పెండింగ్‌లో" },
  "orders.completed": { en: "Completed", te: "పూర్తయింది" },
  "orders.acresSprayed": { en: "Acres sprayed", te: "పిచికారీ చేసిన ఎకరాలు" },
  "orders.none": { en: "No orders assigned yet.", te: "ఇంకా ఆర్డర్లు కేటాయించలేదు." },
  "orders.uploadProof": { en: "Upload proof video (~7-8 seconds) to complete", te: "పూర్తి చేయడానికి రుజువు వీడియో (~7-8 సెకన్లు) అప్‌లోడ్ చేయండి" },
  "orders.viewProof": { en: "View submitted proof video", te: "సమర్పించిన రుజువు వీడియో చూడండి" },
  "orders.scheduled": { en: "Scheduled", te: "షెడ్యూల్ చేయబడింది" },
  "orders.uploading": { en: "Uploading...", te: "అప్‌లోడ్ అవుతోంది..." },
  "orders.notAvailableTitle": { en: "Not yet available", te: "ఇంకా అందుబాటులో లేదు" },
  "orders.notAvailableBody": {
    en: "Orders appear here once an admin verifies your account. Check your dashboard for your current status.",
    te: "మీ ఖాతాను అడ్మిన్ ధృవీకరించిన తర్వాత ఆర్డర్లు ఇక్కడ కనిపిస్తాయి. మీ ప్రస్తుత స్థితి కోసం డాష్‌బోర్డ్ చూడండి.",
  },

  "providerLogin.title": { en: "Provider Login", te: "ప్రొవైడర్ లాగిన్" },
  "providerLogin.subtitle": { en: "Manage your drone fleet and pilot team.", te: "మీ డ్రోన్ ఫ్లీట్ మరియు పైలట్ టీమ్‌ని నిర్వహించండి." },
  "providerLogin.username": { en: "Username", te: "యూజర్‌నేమ్" },
  "providerLogin.newProvider": { en: "New provider? Register", te: "కొత్త ప్రొవైడర్? నమోదు చేసుకోండి" },
  "providerLogin.forgotPassword": { en: "Forgot password? (use your registered email)", te: "పాస్‌వర్డ్ మర్చిపోయారా? (మీ నమోదిత ఇమెయిల్ వాడండి)" },

  "providerRegister.title": { en: "Drone Provider Registration", te: "డ్రోన్ ప్రొవైడర్ నమోదు" },
  "providerRegister.subtitle": { en: "Register your fleet and pilot team with RythuNova.", te: "మీ ఫ్లీట్ మరియు పైలట్ టీమ్‌ని రైతునోవాతో నమోదు చేసుకోండి." },
  "providerRegister.companyName": { en: "Company / Provider name", te: "కంపెనీ / ప్రొవైడర్ పేరు" },
  "providerRegister.alreadyRegistered": { en: "Already registered? Log in", te: "ఇప్పటికే నమోదు అయిందా? లాగిన్ అవ్వండి" },
  "providerRegister.sendingOtp": { en: "Sending OTP...", te: "OTP పంపుతోంది..." },

  "providerDashboard.orders": { en: "Orders", te: "ఆర్డర్లు" },
  "providerDashboard.ordersHint": { en: "View and complete assigned orders", te: "కేటాయించిన ఆర్డర్లను చూసి పూర్తి చేయండి" },
  "providerDashboard.fleetPricing": { en: "Fleet & Pricing", te: "ఫ్లీట్ & ధరలు" },
  "providerDashboard.pilotRoster": { en: "Pilot Roster", te: "పైలట్ జాబితా" },

  "forgotPassword.title": { en: "Forgot Password", te: "పాస్‌వర్డ్ మర్చిపోయారా" },
  "forgotPassword.subtitle": {
    en: "Enter your registered email and we'll send you a reset link.",
    te: "మీ నమోదిత ఇమెయిల్ నమోదు చేయండి, మేము మీకు రీసెట్ లింక్ పంపుతాము.",
  },
  "forgotPassword.send": { en: "Send reset link", te: "రీసెట్ లింక్ పంపండి" },
  "forgotPassword.sending": { en: "Sending...", te: "పంపుతోంది..." },
  "forgotPassword.sent": {
    en: "If that email is registered, a password reset link has been sent.",
    te: "ఆ ఇమెయిల్ నమోదైతే, పాస్‌వర్డ్ రీసెట్ లింక్ పంపబడింది.",
  },

  "resetPassword.title": { en: "Set New Password", te: "కొత్త పాస్‌వర్డ్ సెట్ చేయండి" },
  "resetPassword.subtitle": { en: "Choose a new password for your account.", te: "మీ ఖాతా కోసం కొత్త పాస్‌వర్డ్ ఎంచుకోండి." },
  "resetPassword.reset": { en: "Reset password", te: "పాస్‌వర్డ్ రీసెట్ చేయండి" },
  "resetPassword.missingToken": { en: "This reset link is missing its token.", te: "ఈ రీసెట్ లింక్‌లో టోకెన్ లేదు." },
  "resetPassword.requestNew": { en: "Request a new link", te: "కొత్త లింక్ కోరండి" },

  "profileCompletion.title": { en: "Complete Your Profile", te: "మీ ప్రొఫైల్ పూర్తి చేయండి" },
  "profileCompletion.subtitle": {
    en: "Confirm your details so admins can review and verify your account.",
    te: "అడ్మిన్‌లు మీ ఖాతాను సమీక్షించి ధృవీకరించడానికి మీ వివరాలను నిర్ధారించండి.",
  },
  "profileCompletion.saveSubmit": { en: "Save & Submit", te: "సేవ్ చేసి సమర్పించండి" },
} as const;

export type TranslationKey = keyof typeof translations;
export type Locale = "en" | "te";
