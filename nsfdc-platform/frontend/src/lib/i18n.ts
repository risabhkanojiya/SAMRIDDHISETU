/**
 * Localization dictionary for multi-lingual support.
 * Supports Hindi (hi) and English (en) initially.
 * Will be extended via Bhashini API for more languages.
 */

type Locale = 'en' | 'hi';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.recommender': 'Scheme Finder',
    'nav.calculator': 'EMI Calculator',
    'nav.locator': 'Find Partner',
    'nav.vault': 'My Documents',
    'nav.login': 'Login',

    // Landing Page
    'home.title': 'SamriddhiSetu',
    'home.subtitle': 'Intelligent financial assistance for SC beneficiaries',
    'home.cta.recommender': 'Find Your Scheme',
    'home.cta.vault': 'Upload Documents',

    // Recommender
    'recommend.title': 'AI Scheme Recommender',
    'recommend.project_type': 'Project Type',
    'recommend.cost': 'Estimated Cost (₹)',
    'recommend.income': 'Annual Family Income (₹)',
    'recommend.education': 'Education Status',
    'recommend.submit': 'Find Best Scheme',

    // Calculator
    'calc.title': 'EMI Calculator',
    'calc.amount': 'Loan Amount',
    'calc.rate': 'Interest Rate (%)',
    'calc.tenure': 'Tenure (months)',
    'calc.moratorium': 'Moratorium Period (months)',
    'calc.emi': 'Monthly EMI',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong. Please try again.',
    'common.submit': 'Submit',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.recommender': 'योजना खोजें',
    'nav.calculator': 'EMI कैलकुलेटर',
    'nav.locator': 'पार्टनर खोजें',
    'nav.vault': 'मेरे दस्तावेज़',
    'nav.login': 'लॉगिन',

    // Landing Page
    'home.title': 'समृद्धि सेतु',
    'home.subtitle': 'अनुसूचित जाति लाभार्थियों के लिए बुद्धिमान वित्तीय सहायता',
    'home.cta.recommender': 'अपनी योजना खोजें',
    'home.cta.vault': 'दस्तावेज़ अपलोड करें',

    // Recommender
    'recommend.title': 'AI योजना सिफारिशकर्ता',
    'recommend.project_type': 'परियोजना प्रकार',
    'recommend.cost': 'अनुमानित लागत (₹)',
    'recommend.income': 'वार्षिक पारिवारिक आय (₹)',
    'recommend.education': 'शिक्षा स्थिति',
    'recommend.submit': 'सर्वोत्तम योजना खोजें',

    // Calculator
    'calc.title': 'EMI कैलकुलेटर',
    'calc.amount': 'ऋण राशि',
    'calc.rate': 'ब्याज दर (%)',
    'calc.tenure': 'अवधि (महीने)',
    'calc.moratorium': 'मोहलत अवधि (महीने)',
    'calc.emi': 'मासिक EMI',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    'common.submit': 'जमा करें',
  },
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string): string {
  return translations[currentLocale]?.[key] || translations['en']?.[key] || key;
}

export default translations;
