"use client";
import { useState } from "react";

const steps = [
  "Despre afacerea ta",
  "Procese interne și operaționale",
  "Digitalizare și inovație",
  "Colaborare și interes pentru viitor",
];

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for step 1 fields
  const [activity, setActivity] = useState("");
  const [activityOther, setActivityOther] = useState("");
  const [employees, setEmployees] = useState("");
  const [hasWebsite, setHasWebsite] = useState("");
  const [websitePlatform, setWebsitePlatform] = useState("");

  // State for step 2 fields
  const [timeConsuming, setTimeConsuming] = useState<string[]>([]);
  const [timeConsumingOther, setTimeConsumingOther] = useState("");
  const [usesAutomation, setUsesAutomation] = useState("");
  const [automationTools, setAutomationTools] = useState("");

  // State for step 3 fields
  const [usefulSolutions, setUsefulSolutions] = useState<string[]>([]);
  const [otherSolution, setOtherSolution] = useState("");
  const [digitalChallenges, setDigitalChallenges] = useState("");

  // State for step 4 fields
  const [interested, setInterested] = useState("");
  const [contactMethods, setContactMethods] = useState<string[]>([]);

  // Progress percentage
  const progress = ((step + 1) / steps.length) * 100;

  // Navigation handlers
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Helper for checkbox group
  const handleTimeConsumingChange = (option: string) => {
    if (timeConsuming.includes(option)) {
      setTimeConsuming(timeConsuming.filter((item) => item !== option));
    } else {
      setTimeConsuming([...timeConsuming, option]);
    }
  };

  const handleUsefulSolutionsChange = (option: string) => {
    if (usefulSolutions.includes(option)) {
      setUsefulSolutions(usefulSolutions.filter((item) => item !== option));
    } else {
      setUsefulSolutions([...usefulSolutions, option]);
    }
  };

  const handleContactMethodsChange = (option: string) => {
    if (contactMethods.includes(option)) {
      setContactMethods(contactMethods.filter((item) => item !== option));
    } else {
      setContactMethods([...contactMethods, option]);
    }
  };

  // Validation logic for required fields
  const isStepValid = () => {
    if (step === 0) {
      return (
        activity &&
        (activity !== "Altul" || activityOther.trim()) &&
        employees &&
        hasWebsite
      );
    }
    if (step === 1) {
      return (
        timeConsuming.length > 0 &&
        (!timeConsuming.includes("Altul") || timeConsumingOther.trim()) &&
        usesAutomation &&
        (usesAutomation !== "Da" || automationTools.trim())
      );
    }
    if (step === 2) {
      return (
        usefulSolutions.length > 0 &&
        (!usefulSolutions.includes("Alte idei") || otherSolution.trim())
        // digitalChallenges is optional
      );
    }
    if (step === 3) {
      return (
        interested &&
        contactMethods.length > 0
      );
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    // Gather all form data
    const payload = {
      activity: activity === 'Altul' ? activityOther : activity,
      employees,
      hasWebsite,
      websitePlatform: hasWebsite === 'Da' ? websitePlatform : '',
      timeConsuming: timeConsuming.includes('Altul')
        ? [...timeConsuming.filter((v) => v !== 'Altul'), timeConsumingOther]
        : timeConsuming,
      usesAutomation,
      automationTools: usesAutomation === 'Da' ? automationTools : '',
      usefulSolutions: usefulSolutions.includes('Alte idei')
        ? [...usefulSolutions.filter((v) => v !== 'Alte idei'), otherSolution]
        : usefulSolutions,
      digitalChallenges,
      interested,
      contactMethods,
    };
    try {
      const res = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'A apărut o eroare la trimitere.');
      }
    } catch {
      setError('A apărut o eroare la trimitere.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {submitted ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="mb-4 flex items-center justify-center">
            <span
              className="flex items-center justify-center w-14 h-14 rounded-full border-4"
              style={{
                borderColor: 'white',
                background: 'white',
                boxShadow: '0 0 0 4px #3028b2',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </span>
          </div>
          <div className="text-center text-lg font-semibold text-black dark:text-white">
            Trimis cu succes. Vă mulțumim pentru timpul dumneavoastră!
          </div>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-center mb-2">
              <div
                className="text-2xl font-bold transition-colors text-center"
                style={{ minHeight: '2.5rem', color: 'white' }}
              >
                {steps[step]}
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
              <div
                className="h-2 bg-blue-600 dark:bg-blue-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8 min-h-[200px]">
            {step === 0 && (
              <div className="space-y-8">
                {/* Domeniul principal de activitate */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Care este domeniul principal de activitate al afacerii tale?
                  </label>
                  <div className="space-y-2">
                    {[
                      "Horeca",
                      "E-commerce (produse fizice)",
                      "Servicii medicale / estetice",
                      "Agricultură / produse agro",
                      "Servicii profesionale (avocatură, evaluare, curățenie etc)",
                      "Turism",
                      "Altul",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`activity-${option}`}
                          name="activity"
                          value={option}
                          checked={activity === option}
                          onChange={() => setActivity(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded-full border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`activity-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                        {option === "Altul" && activity === "Altul" && (
                          <input
                            type="text"
                            placeholder="Specifică domeniul"
                            value={activityOther}
                            onChange={e => setActivityOther(e.target.value)}
                            className="ml-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3028b2]"
                            style={{ minWidth: 180 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Câte persoane lucrează în compania ta? */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Câte persoane lucrează în compania ta?
                  </label>
                  <div className="space-y-2">
                    {[
                      "1-3",
                      "4-10",
                      "11-25",
                      "26-50",
                      "51+",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`employees-${option}`}
                          name="employees"
                          value={option}
                          checked={employees === option}
                          onChange={() => setEmployees(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded-full border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`employees-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ai deja un website realizat de Website Factory? */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Ai deja un website activ?
                  </label>
                  <div className="space-y-2">
                    {[
                      "Da",
                      "Nu",
                      "În curs de dezvoltare",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`website-${option}`}
                          name="hasWebsite"
                          value={option}
                          checked={hasWebsite === option}
                          onChange={() => setHasWebsite(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded-full border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`website-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platforma pe care e construit website-ul (optional) */}
                {hasWebsite === "Da" && (
                  <div>
                    <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                      Platforma pe care e construit website-ul <span className="text-xs text-gray-500">(opțional)</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        "Wordpress / WooCommerce",
                        "Magento",
                        "Prestashop",
                        "OpenCart",
                        "Shopify",
                        "Custom",
                      ].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`platform-${option}`}
                            name="websitePlatform"
                            value={option}
                            checked={websitePlatform === option}
                            onChange={() => setWebsitePlatform(option)}
                            className="accent-[#3028b2] w-4 h-4 rounded-full border-gray-300 dark:border-gray-600"
                          />
                          <label htmlFor={`platform-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {step === 1 && (
              <div className="space-y-8">
                {/* Cele mai consumatoare de timp activități */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Care sunt cele mai consumatoare de timp activități administrative sau repetitive în afacerea ta? <span className="text-xs text-gray-500">(bifează tot ce se aplică)</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      "Gestionarea comenzilor",
                      "Comunicarea cu clienții",
                      "Emiterea facturilor / plăților",
                      "Stocuri / aprovizionare",
                      "Progrămări / rezervări",
                      "Răspunsuri pe social media / email",
                      "Gestiune angajați / programări / pontaje",
                      "Altul",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`timeConsuming-${option}`}
                          name="timeConsuming"
                          value={option}
                          checked={timeConsuming.includes(option)}
                          onChange={() => handleTimeConsumingChange(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`timeConsuming-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                        {option === "Altul" && timeConsuming.includes("Altul") && (
                          <input
                            type="text"
                            placeholder="Specifică activitatea"
                            value={timeConsumingOther}
                            onChange={e => setTimeConsumingOther(e.target.value)}
                            className="ml-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3028b2]"
                            style={{ minWidth: 180 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Folosești în prezent vreun tool pentru automatizare? */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Folosești în prezent vreun tool pentru automatizare? <span className="text-xs text-gray-500">(ex: facturare automată, CRM, ERP, chatbot, platforme de programări etc.)</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      "Da",
                      "Nu",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`usesAutomation-${option}`}
                          name="usesAutomation"
                          value={option}
                          checked={usesAutomation === option}
                          onChange={() => setUsesAutomation(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded-full border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`usesAutomation-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                        {option === "Da" && usesAutomation === "Da" && (
                          <input
                            type="text"
                            placeholder="Ce tool-uri folosești?"
                            value={automationTools}
                            onChange={e => setAutomationTools(e.target.value)}
                            className="ml-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3028b2]"
                            style={{ minWidth: 180 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-8">
                {/* Ce tip de soluții ai considera utile */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Ce tip de soluții ai considera utile pentru afacerea ta? <span className="text-xs text-gray-500">(bifează ce ți s-ar părea valoros)</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      "Automatizare comenzi/facturi",
                      "Notificări automate prin email sau SMS",
                      "Platformă centralizată pentru clienți și comenzi",
                      "Programări online integrate în website",
                      "Generare de rapoarte automate",
                      "CRM simplu pentru clienți și lead-uri",
                      "Integrare cu Facebook / Instagram / Google pentru comenzi/mesaje",
                      "Alte idei",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`usefulSolutions-${option}`}
                          name="usefulSolutions"
                          value={option}
                          checked={usefulSolutions.includes(option)}
                          onChange={() => handleUsefulSolutionsChange(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`usefulSolutions-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                        {option === "Alte idei" && usefulSolutions.includes("Alte idei") && (
                          <input
                            type="text"
                            placeholder="Specifică alte idei"
                            value={otherSolution}
                            onChange={e => setOtherSolution(e.target.value)}
                            className="ml-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3028b2]"
                            style={{ minWidth: 180 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care sunt cele mai mari provocări digitale */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Care sunt cele mai mari provocări digitale cu care te confrunți acum?
                  </label>
                  <textarea
                    placeholder="Răspunsul tău..."
                    value={digitalChallenges}
                    onChange={e => setDigitalChallenges(e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3028b2] resize-vertical"
                  />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-8">
                {/* Ai fi interesat să testezi GRATUIT... */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Ai fi interesat să testezi GRATUIT un instrument digital personalizat pentru afacerea ta?
                  </label>
                  <div className="space-y-2">
                    {[
                      "Da",
                      "Nu",
                      "Poate, dacă e relevant pentru nevoile mele",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`interested-${option}`}
                          name="interested"
                          value={option}
                          checked={interested === option}
                          onChange={() => setInterested(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded-full border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`interested-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cum preferi să fii contactat... */}
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Cum preferi să fii contactat pentru idei sau propuneri de tool-uri?
                  </label>
                  <div className="space-y-2">
                    {[
                      "Email",
                      "WhatsApp",
                      "Telefon",
                      "Nu doresc să fiu contactat",
                    ].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`contactMethods-${option}`}
                          name="contactMethods"
                          value={option}
                          checked={contactMethods.includes(option)}
                          onChange={() => handleContactMethodsChange(option)}
                          className="accent-[#3028b2] w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor={`contactMethods-${option}`} className="text-gray-800 dark:text-gray-200 text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0 || submitting}
              className="px-6 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Înapoi
            </button>
            <button
              type="button"
              onClick={step === steps.length - 1 ? handleSubmit : nextStep}
              disabled={!isStepValid() || submitting}
              className="px-6 py-2 rounded-xl border border-gray-300 bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {submitting && step === steps.length - 1 ? 'Se trimite...' : step === steps.length - 1 ? "Trimite" : "Înainte"}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-center text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
} 