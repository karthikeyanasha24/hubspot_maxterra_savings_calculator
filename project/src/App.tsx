import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Building,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';

const getHubSpotCookie = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name === 'hubspotutk') {
      return rest.join('='); // preserves '=' inside value, if any
    }
  }
  return null;
};

// Mapping of internal competitor keys to HubSpot's expected values
const HUBSPOT_PRODUCT_MAP: Record<string, string> = {
  structocrete: 'Structo-Crete',
  exacor: 'Exacor',
  megaboard: 'Megaboard',
  dragonboard: 'Dragonboard',
  nocom: 'NOCOM',
};

const SavingsCalculator = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [projectSize, setProjectSize] = useState<number | ''>('');
  const [competitorType, setCompetitorType] = useState('structocrete'); // Default to first option
  const [results, setResults] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showFullReport, setShowFullReport] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [company, setCompany] = useState('');
  const [streetAddress, setStreetAddress] = useState('');



  const competitorData = {
    structocrete: {
      name: 'STRUCTO-CRETE',
      maxterraCost: 4.76,
      competitorCost: 7.46,
      savings: 2.70,
      spacingNote: 'Both products rated for 24" O.C.',
      additionalBenefits: [
        '44-50% material cost savings',
        'No premium pricing without performance benefit',
        'Quartz silica-free formulation',
      ],
    },
    exacor: {
      name: 'EXACOR',
      maxterraCost: 2.95,
      competitorCost: 4.32,
      savings: 1.37,
      spacingNote: 'MAXTERRA 24" O.C. vs EXACOR 16" O.C. (maximum approved spacing)',
      constructionNote: 'Based on wood open web truss construction',
      additionalBenefits: [
        'Works with 24" O.C. vs 16" O.C. (50% fewer joists)',
        'Compatible with common wood species (S.G. ≥ 0.42)',
        'Non-combustible E136-22 certification',
      ],
    },
    megaboard: {
      name: 'MEGABOARD',
      maxterraCost: 3.20,
      competitorCost: 4.48,
      savings: 1.28,
      spacingNote: 'Both products rated for 24" O.C.',
      additionalBenefits: [
        'No complex installation requirements',
        'Works with standard CFS member sizes',
        'No additional strapping requirements',
      ],
    },
    dragonboard: {
      name: 'DragonBoard',
      maxterraCost: 3.20,
      competitorCost: 4.48,
      savings: 1.28,
      spacingNote: 'MAXTERRA 24" O.C. vs DragonBoard 19.2" O.C. (maximum approved spacing)',
      constructionNote: 'Based on CFS open web truss construction',
      additionalBenefits: [
        'ICC-ESR certified vs no certification',
        'Complete diaphragm testing with design equations',
        'Non-combustible E136-22 certification',
      ],
    },
    nocom: {
      name: 'NOCOM',
      maxterraCost: 1.76,
      competitorCost: 2.35,
      savings: 0.59,
      spacingNote: 'Both products at 24" O.C.',
      constructionNote: 'Based on CFS cantilever configuration',
      additionalBenefits: [
        'ICC-ESR certified vs no certification',
        'Third-party validated performance',
        'Complete wet performance testing',
      ],
    },
  };

  const gypcreteData = {
    current: { osb: 0.70, gypcrete: 2.875, total: 3.575, process: 'Multi-trade, wet installation' },
    maxterra: { osb: 0.70, underlayment: 1.21, total: 1.91, process: 'Single trade, dry installation' },
  };
  const handleProjectTypeSelect = (type: 'gypcrete' | 'subfloor') => {
    setProjectType(type);
  
    // Reset dependent state when switching
    if (type === 'gypcrete') {
      setCompetitorType('structocrete'); // safe default, unused in gypcrete
    }
  };
  

  const calculateSavings = () => {
    const size = Number(projectSize);
    if (isNaN(size) || size <= 0) {
      return null;
    }
    if (projectType === 'gypcrete') {
      const currentCost = gypcreteData.current.total * size;
      const maxterraCost = gypcreteData.maxterra.total * size;
      const savings = currentCost - maxterraCost;
      const percentSavings = (savings / currentCost) * 100;
      return {
        type: 'gypcrete',
        savings: Math.round(savings),
        percentSavings: Math.round(percentSavings),
        currentCost: Math.round(currentCost),
        maxterraCost: Math.round(maxterraCost),
        currentCostPerSF: gypcreteData.current.total,
        maxterraCostPerSF: gypcreteData.maxterra.total,
        additionalBenefits: [
          'Eliminates 7+ day curing time',
          'Single trade installation vs multi-trade',
          'No moisture introduced into building',
          'Meets code requirements without sound mats',
        ],
      };
    } else {
      const competitor = competitorData[competitorType];
      
      if (!competitor) {
        console.error('Competitor not found:', competitorType);
        return null;
      }
      
      const currentCost = competitor.competitorCost * size;
      const maxterraCost = competitor.maxterraCost * size;
      const savings = currentCost - maxterraCost;
      const percentSavings = (savings / currentCost) * 100;
      return {
        type: 'subfloor',
        competitorName: competitor.name,
        savings: Math.round(savings),
        percentSavings: Math.round(percentSavings),
        currentCost: Math.round(currentCost),
        maxterraCost: Math.round(maxterraCost),
        currentCostPerSF: competitor.competitorCost,
        maxterraCostPerSF: competitor.maxterraCost,
        additionalBenefits: competitor.additionalBenefits,
        spacingNote: competitor.spacingNote,
        constructionNote: competitor.constructionNote,
      };
    }
  };

  const handleCalculate = () => {
    if (!projectSize || projectSize <= 0 || !buildingType) {
      alert('Please enter Project Size and select Building Type');
      return;
    }

    if (projectType === 'subfloor' && !competitorType) {
      alert('Please select Current Subfloor Product');
      return;
    }
    
    if (projectType === 'subfloor' && !HUBSPOT_PRODUCT_MAP[competitorType]) {
      console.error('Invalid competitorType:', competitorType);
      alert('Invalid product selection. Please try again.');
      return;
    }

    const r = calculateSavings();
    setResults(r);
    setStep(3);
  };

  const handleGetFullReport = () => {
    if (email) setShowFullReport(true);
  };

  const isContactFormValid = () => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      phone.trim() &&
      streetAddress.trim() &&
      city.trim() &&
      state.trim() &&
      zipCode.trim()
    );
  };

  const handleFormSubmit = async () => {
    if (!isContactFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const hubspotData = {
        firstName,
        lastName,
        email,
        phone,
        streetAddress,
        city,
        state,
        zipCode,
        company,
        calculator_type: projectType === 'gypcrete' ? 'Gypsum Replacement' : 'Structural Floor Replacement',
        square_footage: projectSize,
        building_type: buildingType,
        current_product: projectType === 'gypcrete'
          ? 'Wet-Laid Gypsum'
          : HUBSPOT_PRODUCT_MAP[competitorType],
        calculatedSavings: results.savings,
        pageUri: window.location.href,
        pageName: document.title,
        hutk: getHubSpotCookie(),
      };

      const response = await fetch('/.netlify/functions/submit-hubspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hubspotData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'HubSpot submission failed');
      }

      // ✅ ONLY runs when HubSpot accepts the data
      setShowThankYou(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-3">
            Thank you for your sample request.
          </h2>


          <button
            onClick={() => {
              if (window.self !== window.top) {
                // If inside iframe, redirect parent window
                window.parent.location.href =
                  'https://nexgenbp.com/skip-the-gyp-calculator';
              } else {
                // Normal redirect
                window.location.href =
                  'https://nexgenbp.com/skip-the-gyp-calculator';
              }
            }}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  // STEP 1
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-12">
          <div className="text-center mb-8">
            <img src="/image copy.png" alt="Calculator with dollar sign" className="w-22 h-20 mx-auto mb-4" />
            <h2 className="font-manrope font-semibold text-[36px] leading-[56px] tracking-[-0.03em] text-center text-gray-900 mb-2">
              What are you looking to replace?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => handleProjectTypeSelect('gypcrete')}
              className={`p-8 border-2 rounded-2xl transition-all duration-200 text-left hover:shadow-lg relative ${projectType === 'gypcrete' ? 'border-selectedOrange bg-white shadow-lg' : 'border-unselectedGray bg-white'
                }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-4 rounded-l-2xl ${projectType === 'gypcrete'
                  ? 'bg-selectedOrange'
                  : projectType === 'subfloor'
                    ? 'bg-unselectedGray'
                    : 'bg-customBlue'
                  }`}
              />
              <h4 className="text-lg font-bold text-darkGray mb-4 leading-[39px] tracking-[-0.01em]">Wet Gypsum Underlayment</h4>
              <p className="font-medium text-sm leading-[20px] tracking-normal text-darkGray mb-3">
                Replace OSB + Wet Gypsum with <span className="font-bold text-darkGray">MAXTERRA® MgO Fire- And Water-Resistant Underlayment</span>
              </p>
            </button>
            <button
              onClick={() => handleProjectTypeSelect('subfloor')}
              className={`p-8 border-2 rounded-2xl transition-all duration-200 text-left hover:shadow-lg relative ${projectType === 'subfloor' ? 'border-selectedOrange bg-white shadow-lg' : 'border-unselectedGray bg-white'
                }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-4 rounded-l-2xl ${projectType === 'subfloor'
                  ? 'bg-selectedOrange'
                  : projectType === 'gypcrete'
                    ? 'bg-unselectedGray'
                    : 'bg-customDarkBlue'
                  }`}
              />
              <h3 className="text-lg font-bold text-darkGray mb-4 leading-[39px] tracking-[-0.01em]">Entire Subfloor System</h3>
              <p className="font-medium text-sm leading-[20px] tracking-normal text-darkGray mb-3">
                Replace subfloor with <span className="font-bold text-darkGray">MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels</span>
              </p>
            </button>
          </div>
          {projectType && (
            <div className="text-center mt-12">
              <button
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 2
  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to project type
            </button>
          </div>
          <div className="text-center mb-8">
            <img src="/image copy.png" alt="Calculator with dollar sign" className="w-22 h-20 mx-auto mb-4" />
            <h2 className="font-manrope font-semibold text-[36px] leading-[56px] tracking-[-0.03em] text-center text-black mb-2">
              Project Details
            </h2>
            <p className="font-manrope font-normal text-gray-600">Tell us about your project for accurate savings calculations</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2 leading-[39px] tracking-[-0.01em]">Project Size (sq ft)</label>
              <input
                type="number"
                required
                value={projectSize}
                onChange={(e) =>
                  setProjectSize(e.target.value ? parseInt(e.target.value, 10) : '')
                }
                className="w-full px-4 py-3 border border-borderLightGray rounded-[7px] focus:border-orange-500 focus:outline-none text-lg leading-[39px] tracking-[-0.01em] text-center"
                min="100"
                step="100"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2 leading-[39px] tracking-[-0.01em]">Building Type</label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full px-4 py-3 border border-borderLightGray rounded-[7px] focus:border-orange-500 focus:outline-none text-lg leading-[39px] tracking-[-0.01em] text-center"
              >
                <option value="">Select building type...</option>
                <option value="Multi-Family Residential">Multi-Family Residential</option>
                <option value="Hotel/Hospitality">Hotel/Hospitality</option>
                <option value="Commerical">Commerical</option>
                <option value="Industrial">Industrial</option>
                <option value="Single-Family Residential">Single-Family Residential</option>
                <option value="Data Center">Data Center</option>
                <option value="Health Care">Health Care</option>
                <option value="Education">Education</option>
              </select>
            </div>
            {projectType === 'subfloor' && (
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2 leading-[39px] tracking-[-0.01em]">Current Subfloor Product</label>
                <select
                  value={competitorType}
                  onChange={(e) => setCompetitorType(e.target.value)}
                  className="w-full px-4 py-3 border border-borderLightGray rounded-[7px] focus:border-orange-500 focus:outline-none text-lg leading-[39px] tracking-[-0.01em] text-center"
                >
                  <option value="structocrete">Structo-Crete</option>
<option value="exacor">Exacor</option>
<option value="megaboard">Megaboard</option>
<option value="dragonboard">Dragonboard</option>
<option value="nocom">NOCOM</option>

                </select>
              </div>
            )}
            <div className="text-center pt-4">
              <button
                onClick={handleCalculate}
                disabled={
                  !projectSize ||
                  projectSize <= 0 ||
                  !buildingType ||
                  (projectType === 'subfloor' && !competitorType)
                }
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calculate My Savings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3 (summary)
  if (step === 3 && !showFullReport) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <button
              onClick={() => setStep(2)}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to project details
            </button>
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4 w-12 h-12">
              <span className="font-manrope font-bold text-4xl text-[#23C45F]">$</span>
            </div>
            <h2 className="font-manrope font-semibold text-[36px] leading-[56px] tracking-[-0.03em] text-gray-900 mb-2">
              Your Potential Savings
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8 px-[25px]">
            <div className="min-h-[180px] rounded-xl p-6 flex flex-col"
              style={{ background: 'linear-gradient(100.32deg, #22C35F 1.27%, #049769 98.73%)' }}>
              <h3 className="font-manrope font-bold text-[18px] leading-[24px] tracking-[-0.01em] text-white mb-3">
                Total Project Savings
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="font-manrope font-bold text-[32px] leading-9 text-white">$</span>
                <span className="font-manrope font-bold text-[32px] leading-9 text-white">
                  {results.savings.toLocaleString()}
                </span>
              </div>
              <p className="text-white font-manrope font-medium text-[14px] leading-[20px]">
                That's {results.percentSavings}% less than {results.competitorName || 'gypcrete'}!
              </p>
            </div>

            <div className="min-h-[180px] rounded-xl p-6 flex flex-col"
              style={{ background: 'linear-gradient(103.15deg, #1AA9E2 3.09%, #0F6D92 121.14%)' }}>
              <h3 className="font-manrope font-bold text-[18px] leading-[24px] tracking-[-0.01em] text-white mb-3">
                Cost Savings per SF
              </h3>
              <div className="flex items-baseline mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2" style={{ marginBottom: '4px' }}>
                  <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="white"/>
                </svg>
                <span className="font-manrope font-bold text-[32px] leading-9 text-white">
                  ${(results.currentCostPerSF - results.maxterraCostPerSF).toFixed(2)}
                </span>
              </div>
              <p className="text-white font-manrope font-medium text-[14px] leading-[20px]">
                ${results.maxterraCostPerSF.toFixed(2)} vs ${results.currentCostPerSF.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="font-manrope font-semibold text-2xl leading-8 tracking-[-0.01em] text-[#212121]">Cost Breakdown</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8 px-[25px]">
  <div className="bg-costBreakdownCurrentBg rounded-xl border border-gray-200 p-6 flex flex-col h-full">
    <h4 className="font-manrope font-medium text-base leading-[18px] tracking-[-0.01em] text-[#212121] -mb-1 min-h-[40px] flex items-center">
      {results.type === 'gypcrete' ? 'Current System (OSB + Gypcrete)' : `Current System (${results.competitorName})`}
    </h4>
    <div className="">
      <div className="font-manrope font-extrabold text-[28px] leading-8 tracking-[-0.01em] text-[#212121]">${results.currentCost.toLocaleString()}</div>
      <div className="font-manrope font-medium text-sm leading-5 tracking-[0.01em] text-[#25647D] mt-1">${results.currentCostPerSF.toFixed(2)}/sq ft</div>
    </div>
  </div>
  <div className="bg-[#22C25533] rounded-lg p-6 flex flex-col h-full">
    <h4 className="font-manrope font-medium text-base leading-[18px] tracking-[-0.01em] text-[#212121] -mb-1 min-h-[40px] flex items-center">
      {results.type === 'gypcrete' ? 'MAXTERRA System (OSB + Underlayment)' : 'MAXTERRA Subfloor'}
    </h4>
    <div className="">
      <div className="font-manrope font-extrabold text-[28px] leading-8 tracking-[-0.01em] text-green-600">${results.maxterraCost.toLocaleString()}</div>
      <div className="font-manrope font-medium text-sm leading-5 tracking-[0.01em] text-[#22C255] mt-1">${results.maxterraCostPerSF.toFixed(2)}/sq ft</div>
    </div>
  </div>
</div>
          <div className="mt-4 text-center">
            <p className="font-manrope text-sm text-gray-500 italic">
              Cost estimates based on average national pricing; material and labor costs vary by region.
              Contact us to discuss pricing for your specific market.
            </p>
          </div>

          {results.type === 'subfloor' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Calculation Details</h4>
              <div className="text-gray-600 text-sm space-y-1">
                {competitorData[competitorType]?.spacingNote && (
                  <p>• {competitorData[competitorType].spacingNote}</p>
                )}
                {competitorData[competitorType]?.constructionNote && (
                  <p>• {competitorData[competitorType].constructionNote}</p>
                )}
                <p>• For different framing or construction approaches, contact us for customized analysis</p>
              </div>
            </div>
          )}
          <div className="text-center">
            <h3 className="font-manrope font-bold text-xl leading-[39px] tracking-[-0.01em] text-center text-textDarkBlack mb-4">
              You've seen the numbers. Now see the product that delivers the savings!
            </h3>
            <p className="font-manrope font-normal text-sm leading-[20px] tracking-normal text-center text-darkGray mb-6">
              Request a free sample and experience MAXTERRA® for yourself.
            </p>
            <div className="max-w-2xl mx-auto mb-6">
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal mb-4"
              />
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter your company name (optional)"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
              </div>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Street address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal mb-4"
              />
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Zip code"
                  className="px-4 py-3 border-2 border-gray-200 rounded-[7px] focus:border-orange-500 focus:outline-none placeholder-placeholderGray font-manrope font-normal text-sm leading-[20px] tracking-normal"
                />
              </div>
              <button
                onClick={handleFormSubmit}
                disabled={!isContactFormValid() || isSubmitting}
                className="bg-gradient-to-r from-gradientOrangeStart to-gradientOrangeEnd text-white px-12 py-3 rounded-[7px] font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3 (full report)
  if (step === 3 && showFullReport) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <button
              onClick={() => setShowFullReport(false)}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to savings summary
            </button>
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Savings Analysis</h2>
            <p className="text-gray-600">Detailed comparison and benefits analysis</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <img src="/image.png" alt="Dollar sign icon" className="w-10 h-10 mb-4" />
              <div className="text-3xl font-bold mb-2">{results.savings.toLocaleString()}</div>
              <h3 className="text-lg font-semibold">Total Savings</h3>
              <p className="text-green-100 text-sm">{results.percentSavings}% cost reduction</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
              <Clock className="w-10 h-10 mb-4" />
              <div className="text-3xl font-bold mb-2">{results.type === 'gypcrete' ? '7+' : 'Faster'}</div>
              <h3 className="text-lg font-semibold">{results.type === 'gypcrete' ? 'Days Saved' : 'Installation'}</h3>
              <p className="text-blue-100 text-sm">
                {results.type === 'gypcrete' ? 'No curing time required' : 'Streamlined process'}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <Building className="w-10 h-10 mb-4" />
              <div className="text-3xl font-bold mb-2">ICC-ESR</div>
              <h3 className="text-lg font-semibold">Certified</h3>
              <p className="text-purple-100 text-sm">Third-party validated performance</p>
            </div>
          </div>
          <div className="bg-white rounded-xl text-center text-sm text-gray-500">
            <p>
              *Calculations based on documented cost analysis using maximum approved spacing for optimal performance comparison.
              Actual savings may vary by project and location.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SavingsCalculator;
