"use client";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import {
  Calendar,
  Upload,
  User,
  Users,
  FileText,
  Heart,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface FormData {
  // Client Details
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  emailAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
  height: string;
  weight: string;

  // Client Representative Details
  repFirstName: string;
  repLastName: string;
  repPhoneNumber: string;
  repEmail: string;
  repStreetAddress: string;
  repCity: string;
  repState: string;
  repPostcode: string;

  // NDIS Details
  planType: string;
  planManagerName: string;
  planManagerAgency: string;
  ndisNumber: string;
  availableFunding: string;
  planStartDate: string;
  planReviewDate: string;
  clientGoals: string;

  // Referrer Details
  referrerFirstName: string;
  referrerLastName: string;
  referrerAgency: string;
  referrerRole: string;
  referrerEmail: string;
  referrerPhone: string;
  consentObtained: boolean;

  // Reason for Referral
  referralType: string;
  medicalInformation: string;
  fileUpload: File | null;
}

export default function RegisterPage() {
  const seasonalColors = useSeasonalColors();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    emailAddress: "",
    streetAddress: "",
    city: "",
    state: "",
    postcode: "",
    height: "",
    weight: "",
    repFirstName: "",
    repLastName: "",
    repPhoneNumber: "",
    repEmail: "",
    repStreetAddress: "",
    repCity: "",
    repState: "",
    repPostcode: "",
    planType: "",
    planManagerName: "",
    planManagerAgency: "",
    ndisNumber: "",
    availableFunding: "",
    planStartDate: "",
    planReviewDate: "",
    clientGoals: "",
    referrerFirstName: "",
    referrerLastName: "",
    referrerAgency: "",
    referrerRole: "",
    referrerEmail: "",
    referrerPhone: "",
    consentObtained: false,
    referralType: "",
    medicalInformation: "",
    fileUpload: null,
  });

  const totalSteps = 5;

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    switch (step) {
      case 1:
        const step1Required = [
          "firstName",
          "lastName",
          "dateOfBirth",
          "phoneNumber",
          "streetAddress",
          "city",
          "state",
          "postcode",
        ];
        step1Required.forEach((field) => {
          if (!formData[field as keyof FormData]) {
            newErrors[field] = true;
            isValid = false;
          }
        });
        break;
      case 2:
        // Representative details are optional
        break;
      case 3:
        const step3Required = [
          "planType",
          "ndisNumber",
          "planStartDate",
          "planReviewDate",
          "clientGoals",
        ];
        step3Required.forEach((field) => {
          if (!formData[field as keyof FormData]) {
            newErrors[field] = true;
            isValid = false;
          }
        });
        break;
      case 4:
        const step4Required = [
          "referrerFirstName",
          "referrerLastName",
          "referrerEmail",
          "referrerPhone",
        ];
        step4Required.forEach((field) => {
          if (!formData[field as keyof FormData]) {
            newErrors[field] = true;
            isValid = false;
          }
        });
        if (!formData.consentObtained) {
          newErrors["consentObtained"] = true;
          isValid = false;
        }
        break;
      case 5:
        const step5Required = ["referralType", "medicalInformation"];
        step5Required.forEach((field) => {
          if (!formData[field as keyof FormData]) {
            newErrors[field] = true;
            isValid = false;
          }
        });
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("fileUpload", file);
  };

  const stepTitles = [
    "Client Details",
    "Representative Details",
    "NDIS Information",
    "Referrer Details",
    "Referral Information",
  ];

  const stepIcons = [User, Users, Shield, Heart, FileText];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Program Registration
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join our inclusive fitness and personal development programs.
              Complete this registration to get started on your journey.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="relative flex items-center justify-between mb-4">
              {stepTitles.map((title, index) => {
                const IconComponent = stepIcons[index];
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive
                          ? "text-white shadow-lg"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? seasonalColors.primary
                          : undefined,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium text-center max-w-20 leading-tight ${
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                );
              })}

              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
          >
            {/* Step 1: Client Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <User
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    Client Details
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.dateOfBirth
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.phoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) =>
                        handleInputChange("emailAddress", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={(e) =>
                      handleInputChange("streetAddress", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                      errors.streetAddress
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    }`}
                  />
                  {errors.streetAddress && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      This field is required
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.city
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.state
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postcode}
                      onChange={(e) =>
                        handleInputChange("postcode", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.postcode
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.postcode && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Representative Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Users
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    Client Representative Details (If Applicable)
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.repFirstName}
                      onChange={(e) =>
                        handleInputChange("repFirstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.repLastName}
                      onChange={(e) =>
                        handleInputChange("repLastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.repPhoneNumber}
                      onChange={(e) =>
                        handleInputChange("repPhoneNumber", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.repEmail}
                      onChange={(e) =>
                        handleInputChange("repEmail", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.repStreetAddress}
                    onChange={(e) =>
                      handleInputChange("repStreetAddress", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.repCity}
                      onChange={(e) =>
                        handleInputChange("repCity", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.repState}
                      onChange={(e) =>
                        handleInputChange("repState", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={formData.repPostcode}
                      onChange={(e) =>
                        handleInputChange("repPostcode", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: NDIS Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Shield
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    NDIS Details
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Plan <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {["Plan Managed", "Self Managed", "Agency Managed"].map(
                      (option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="planType"
                            value={option}
                            checked={formData.planType === option}
                            onChange={(e) =>
                              handleInputChange("planType", e.target.value)
                            }
                            className="mr-3"
                            style={{ accentColor: seasonalColors.primary }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {option}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                  {errors.planType && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Please select a plan type
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Manager Name (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.planManagerName}
                      onChange={(e) =>
                        handleInputChange("planManagerName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Manager Agency (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.planManagerAgency}
                      onChange={(e) =>
                        handleInputChange("planManagerAgency", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      NDIS Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ndisNumber}
                      onChange={(e) =>
                        handleInputChange("ndisNumber", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.ndisNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.ndisNumber && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Available/Remaining Funding for Capacity Building Supports
                    </label>
                    <input
                      type="text"
                      value={formData.availableFunding}
                      onChange={(e) =>
                        handleInputChange("availableFunding", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.planStartDate}
                      onChange={(e) =>
                        handleInputChange("planStartDate", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.planStartDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.planStartDate && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Review Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.planReviewDate}
                      onChange={(e) =>
                        handleInputChange("planReviewDate", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.planReviewDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.planReviewDate && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Client Goals (As stated in the NDIS plan){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.clientGoals}
                      onChange={(e) =>
                        handleInputChange("clientGoals", e.target.value)
                      }
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.clientGoals
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.clientGoals && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Referrer Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Heart
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    Referrer Details (Person Making the Referral)
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.referrerFirstName}
                      onChange={(e) =>
                        handleInputChange("referrerFirstName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.referrerFirstName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.referrerFirstName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.referrerLastName}
                      onChange={(e) =>
                        handleInputChange("referrerLastName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.referrerLastName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.referrerLastName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Agency
                    </label>
                    <input
                      type="text"
                      value={formData.referrerAgency}
                      onChange={(e) =>
                        handleInputChange("referrerAgency", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={formData.referrerRole}
                      onChange={(e) =>
                        handleInputChange("referrerRole", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.referrerEmail}
                      onChange={(e) =>
                        handleInputChange("referrerEmail", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.referrerEmail
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.referrerEmail && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.referrerPhone}
                      onChange={(e) =>
                        handleInputChange("referrerPhone", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.referrerPhone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {errors.referrerPhone && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 ${
                    errors.consentObtained
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                  }`}
                >
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.consentObtained}
                      onChange={(e) =>
                        handleInputChange("consentObtained", e.target.checked)
                      }
                      className="mt-1"
                      style={{ accentColor: seasonalColors.primary }}
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        I have obtained consent from the participant to make
                        this referral and provide Result Road with the
                        participant's personal and medical details.{" "}
                        <span className="text-red-500">*</span>
                      </span>
                      {errors.consentObtained && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          You must provide consent to continue
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Reason for Referral */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <FileText
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    Reason For Referral
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Referred For <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      "Solo Program",
                      "Group Program",
                      "Combat Program",
                      "Other",
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="referralType"
                          value={option}
                          checked={formData.referralType === option}
                          onChange={(e) =>
                            handleInputChange("referralType", e.target.value)
                          }
                          className="mr-3"
                          style={{ accentColor: seasonalColors.primary }}
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.referralType && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Please select a referral type
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Relevant Medical Information{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.medicalInformation}
                    onChange={(e) =>
                      handleInputChange("medicalInformation", e.target.value)
                    }
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                      errors.medicalInformation
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    }`}
                    placeholder="Please provide relevant medical information..."
                  />
                  {errors.medicalInformation && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      This field is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    File Upload (Please attach a copy of the current NDIS plan
                    if possible)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB
                      </p>
                      {formData.fileUpload && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                          File selected: {formData.fileUpload.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-8 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-4">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                    style={{
                      backgroundColor: seasonalColors.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        seasonalColors.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        seasonalColors.primary;
                    }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                    style={{
                      backgroundColor: seasonalColors.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        seasonalColors.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        seasonalColors.primary;
                    }}
                  >
                    Submit Registration
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
