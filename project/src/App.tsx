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

const SavingsCalculator = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [projectSize, setProjectSize] = useState<number | ''>('');
  const [competitorType, setCompetitorType] = useState('');
  const [results, setResults] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showFullReport, setShowFullReport] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [company, setCompany] = useState('');

  const handleProjectTypeSelect = (type: string) => setProjectType(type);

  const competitorData: any = {
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
      calculatorType: projectType === 'gypcrete'
        ? 'Gypsum Replacement'
        : 'Structural Floor Replacement',
      squareFootage: projectSize,
      buildingType,
      currentProduct: projectType === 'gypcrete'
        ? 'Wet Gypsum'
        : results.competitorName,
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
                window.parent.postMessage('close-iframe', '*');
              } else {
                window.close();
              }
            }}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg"
          >
            Close Window
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
              className={`p-8 border-2 rounded-2xl transition-all duration-200 text-left hover:shadow-lg relative ${
                projectType === 'gypcrete' ? 'border-selectedOrange bg-white shadow-lg' : 'border-unselectedGray bg-white'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-4 rounded-l-2xl ${
                  projectType === 'gypcrete'
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
              className={`p-8 border-2 rounded-2xl transition-all duration-200 text-left hover:shadow-lg relative ${
                projectType === 'subfloor' ? 'border-selectedOrange bg-white shadow-lg' : 'border-unselectedGray bg-white'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-4 rounded-l-2xl ${
                  projectType === 'subfloor'
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
                <option value="multifamily">Multi-family Residential</option>
                <option value="hotel">Hotel/Hospitality</option>
                <option value="commercial">Commercial Office</option>
                <option value="retail">Retail/Mixed-use</option>
                <option value="singlefamily">Single-family Residential</option>
                <option value="datacenter">Data center</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
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
                  <option value="">Select current product...</option>
                  <option value="structocrete">STRUCTO-CRETE</option>
                  <option value="exacor">EXACOR</option>
                  <option value="megaboard">MEGABOARD</option>
                  <option value="dragonboard">DragonBoard</option>
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
            <div className="inline-flex items-center justify-center mb-4">
              <svg width="30" height="53" viewBox="0 0 30 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                <path d="M12.6664 50.776V45.16H17.6824V50.776H12.6664ZM12.6664 12.304V6.664H17.6824V12.304H12.6664ZM15.4264 46.72C13.0264 46.72 10.8824 46.288 8.99438 45.424C7.10638 44.56 5.55438 43.336 4.33838 41.752C3.13838 40.152 2.35438 38.264 1.98638 36.088L6.95438 35.296C7.43438 37.344 8.45838 38.976 10.0264 40.192C11.5944 41.392 13.4744 41.992 15.6664 41.992C17.8424 41.992 19.6104 41.472 20.9704 40.432C22.3464 39.392 23.0344 38.064 23.0344 36.448C23.0344 35.296 22.6824 34.36 21.9784 33.64C21.2904 32.92 20.1624 32.312 18.5944 31.816L10.4824 29.32C5.68238 27.832 3.28238 24.952 3.28238 20.68C3.28238 18.664 3.76238 16.912 4.72238 15.424C5.69838 13.936 7.06638 12.784 8.82638 11.968C10.5864 11.152 12.6424 10.744 14.9944 10.744C17.2504 10.776 19.2504 11.192 20.9944 11.992C22.7544 12.792 24.2104 13.944 25.3624 15.448C26.5304 16.952 27.3384 18.76 27.7864 20.872L22.6744 21.784C22.4504 20.552 21.9784 19.464 21.2584 18.52C20.5544 17.576 19.6584 16.84 18.5704 16.312C17.4984 15.784 16.2904 15.512 14.9464 15.496C13.6824 15.464 12.5464 15.664 11.5384 16.096C10.5464 16.512 9.75438 17.104 9.16238 17.872C8.58638 18.624 8.29838 19.48 8.29838 20.44C8.29838 21.496 8.70638 22.392 9.52238 23.128C10.3384 23.864 11.6264 24.496 13.3864 25.024L19.7464 26.872C22.6584 27.736 24.7624 28.896 26.0584 30.352C27.3544 31.808 28.0024 33.744 28.0024 36.16C28.0024 38.272 27.4744 40.12 26.4184 41.704C25.3784 43.272 23.9144 44.504 22.0264 45.4C20.1384 46.28 17.9384 46.72 15.4264 46.72Z" fill="#23C45F"/>
                <rect x="12" y="6" width="6" height="45" fill="#23C45F"/>
              </svg>
            </div>
            <h2 className="font-manrope font-semibold text-[36px] leading-[56px] tracking-[-0.03em] text-gray-900 mb-2">
              Your Potential Savings
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-gradientGreenStart to-gradientGreenEnd rounded-xl p-6 text-white">
              <div className="flex items-center mb-2">
                <img src="/image.png" alt="Dollar sign icon" className="w-10 h-14 mr-2" />
                <div className="text-4xl font-bold">{results.savings.toLocaleString()}</div>
              </div>
              <h3 className="text-lg font-bold mb-2">Total Project Savings</h3>
              <p className="font-medium text-sm">
                That's {results.percentSavings}% less than {results.competitorName || 'gypcrete'}!
              </p>
            </div>
            <div className="bg-gradient-to-r from-gradientBlueStart to-gradientBlueEnd rounded-xl p-6 text-white">
              <div className="flex items-center mb-2">
                <img src="/trend.png" alt="Upward trend arrow" className="w-12 h-9 mr-2" />
                <div className="text-4xl font-bold">{(results.currentCostPerSF - results.maxterraCostPerSF).toFixed(2)}</div>
              </div>
              <h3 className="text-lg font-bold mb-2">Cost Savings per SF</h3>
              <p className="font-medium text-sm">
                ${results.maxterraCostPerSF.toFixed(2)} vs ${results.currentCostPerSF.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-costBreakdownCurrentBg rounded-xl border border-gray-200 p-6">
                <h3 className="font-manrope font-medium text-base leading-[18px] tracking-[-0.01em] text-[#212121] mb-6">Cost Breakdown</h3>
                <h4 className="text-base font-medium text-gray-600 mb-2">
                  {results.type === 'gypcrete' ? 'Current System (OSB + Gypcrete)' : `Current System (${results.competitorName})`}
                </h4>
                <div className="font-manrope font-extrabold text-[28px] leading-[18px] tracking-[-0.01em] text-[#212121] mb-1">${results.currentCost.toLocaleString()}</div>
                <div className="font-manrope font-medium text-sm leading-[20px] tracking-[0.01em] text-costBreakdownGray opacity-60">${results.currentCostPerSF.toFixed(2)}/sq ft</div>
              </div>
              <div className="bg-maxterraCardBackground rounded-xl p-6">
                <h4 className="font-manrope font-bold text-base leading-[20px] tracking-[-0.01em] text-[#212121] mb-2">
                  {results.type === 'gypcrete' ? 'MAXTERRA System (OSB + Underlayment)' : 'MAXTERRA Subfloor'}
                </h4>
                <div className="font-manrope font-extrabold text-[28px] leading-[18px] tracking-[-0.01em] text-green-600 mb-1">${results.maxterraCost.toLocaleString()}</div>
                <div className="font-manrope font-medium text-sm leading-[20px] tracking-[0.01em] text-costBreakdownGray opacity-60">${results.maxterraCostPerSF.toFixed(2)}/sq ft</div>
              </div>
            </div>
          </div>
          {results.type === 'subfloor' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Calculation Details</h4>
              <div className="text-gray-600 text-sm space-y-1">
                <p>• {competitorData[competitorType]?.spacingNote}</p>
                {competitorData[competitorType]?.constructionNote && <p>• {competitorData[competitorType].constructionNote}</p>}
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
