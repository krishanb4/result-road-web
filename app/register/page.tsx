"use client";
import { useState } from "react";
import {
  Upload,
  User,
  Users,
  FileText,
  Heart,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Import your Firebase instances
import { auth, db } from "@/lib/firebase";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Initialize storage
const storage = getStorage();

interface FormData {
  // Auth fields
  emailAddress: string;
  password: string;
  confirmPassword: string;

  // Client Details
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [formData, setFormData] = useState<FormData>({
    emailAddress: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
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

  const totalSteps = 6;

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateAuth = (): boolean => {
    const newErrors: Record<string, boolean | string> = {};
    let isValid = true;

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (authMode === "signup") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuth = async () => {
    if (!validateAuth()) return;

    setIsSubmitting(true);
    try {
      let userCredential;

      if (authMode === "signup") {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.emailAddress,
          formData.password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.emailAddress,
          formData.password
        );
      }

      setCurrentUser(userCredential.user);
      setIsAuthenticated(true);
      setCurrentStep(1);
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "Authentication failed";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }

      setErrors({ auth: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean | string> = {};
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
    if (currentStep === 0) {
      handleAuth();
      return;
    }

    if (validateStep(currentStep) && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file || !currentUser) return null;

    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${timestamp}-${file.name}`;

      // Create storage reference
      const fileRef = ref(storage, `ndis-plans/${currentUser.uid}/${fileName}`);

      // Upload file
      const snapshot = await uploadBytes(fileRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !currentUser) return;

    setIsSubmitting(true);
    try {
      // Upload file if present
      let fileUrl = null;
      if (formData.fileUpload) {
        fileUrl = await uploadFile(formData.fileUpload);
      }

      // Prepare user data for Firestore
      const userData = {
        // Personal Information
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        email: formData.emailAddress,
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
        },
        physicalInfo: {
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
        },

        // Representative Information (if provided)
        representative: formData.repFirstName
          ? {
              firstName: formData.repFirstName,
              lastName: formData.repLastName,
              phone: formData.repPhoneNumber,
              email: formData.repEmail,
              address: {
                street: formData.repStreetAddress,
                city: formData.repCity,
                state: formData.repState,
                postcode: formData.repPostcode,
              },
            }
          : null,

        // NDIS Information
        ndis: {
          planType: formData.planType,
          planManagerName: formData.planManagerName,
          planManagerAgency: formData.planManagerAgency,
          ndisNumber: formData.ndisNumber,
          availableFunding: formData.availableFunding,
          planStartDate: formData.planStartDate,
          planReviewDate: formData.planReviewDate,
          goals: formData.clientGoals,
          planDocumentUrl: fileUrl,
        },

        // Referrer Information
        referrer: {
          firstName: formData.referrerFirstName,
          lastName: formData.referrerLastName,
          agency: formData.referrerAgency,
          role: formData.referrerRole,
          email: formData.referrerEmail,
          phone: formData.referrerPhone,
          consentObtained: formData.consentObtained,
        },

        // Referral Information
        referral: {
          type: formData.referralType,
          medicalInformation: formData.medicalInformation,
        },

        // User role and metadata
        role: "participant",
        registrationStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save to Firestore users collection
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, userData);

      // Create initial care plan document
      const carePlanData = {
        participantId: currentUser.uid,
        goals: formData.clientGoals,
        medicalInfo: formData.medicalInformation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
      };

      const carePlanRef = doc(db, "carePlans", currentUser.uid);
      await setDoc(carePlanRef, carePlanData);

      setSuccessMessage(
        "Registration completed successfully! You will be contacted soon by our team to schedule your initial assessment."
      );
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      setErrors({
        submit:
          error.message || "Failed to submit registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Validate file size (10MB limit)
    if (file && file.size > 10 * 1024 * 1024) {
      setErrors({ fileUpload: "File size must be less than 10MB" });
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (file && !allowedTypes.includes(file.type)) {
      setErrors({
        fileUpload: "Please upload a PDF, DOC, DOCX, JPG, or PNG file",
      });
      return;
    }

    handleInputChange("fileUpload", file);
  };

  const stepTitles = [
    "Account Setup",
    "Client Details",
    "Representative Details",
    "NDIS Information",
    "Referrer Details",
    "Referral Information",
  ];

  const stepIcons = [User, User, Users, Shield, Heart, FileText];

  const renderError = (field: string) => {
    const error = errors[field];
    if (!error) return null;

    return (
      <p className="mt-1 text-sm text-red-500 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {typeof error === "string" ? error : "This field is required"}
      </p>
    );
  };

  if (successMessage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Registration Complete!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {successMessage}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      <div className="py-12 px-6 mt-12">
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
                const stepNumber = index;
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
                    width: `${(currentStep / (totalSteps - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {/* Step 0: Authentication */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <User
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    Account Setup
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Create an account or sign in to continue with registration
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${
                        authMode === "signup"
                          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${
                        authMode === "signin"
                          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Sign In
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) =>
                        handleInputChange("emailAddress", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.emailAddress
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {renderError("emailAddress")}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      }`}
                    />
                    {renderError("password")}
                  </div>

                  {authMode === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                          errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                        }`}
                      />
                      {renderError("confirmPassword")}
                    </div>
                  )}

                  {errors.auth && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.auth}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    {renderError("firstName")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("lastName")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
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
                    {renderError("dateOfBirth")}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
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
                    {renderError("phoneNumber")}
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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
                  {renderError("streetAddress")}
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("city")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("state")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("postcode")}
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
                    Representative Details (Optional)
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    If applicable, provide details for the client's
                    representative
                  </p>
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
                    NDIS Information
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Plan Type <span className="text-red-500">*</span>
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
                  {renderError("planType")}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      NDIS Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("ndisNumber")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Available Funding
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
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
                    {renderError("planStartDate")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Review Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
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
                    {renderError("planReviewDate")}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Client Goals (As stated in NDIS plan){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.clientGoals}
                    onChange={(e) =>
                      handleInputChange("clientGoals", e.target.value)
                    }
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors ${
                      errors.clientGoals
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    }`}
                    placeholder="Describe the client's goals as outlined in their NDIS plan..."
                  />
                  {renderError("clientGoals")}
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
                    Referrer Details
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("referrerFirstName")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                    {renderError("referrerLastName")}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
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
                    {renderError("referrerEmail")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
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
                    {renderError("referrerPhone")}
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
                        this referral and provide details.{" "}
                        <span className="text-red-500">*</span>
                      </span>
                      {renderError("consentObtained")}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Referral Information */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <FileText
                      className="w-6 h-6 mr-3"
                      style={{ color: seasonalColors.primary }}
                    />
                    Referral Information
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
                  {renderError("referralType")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Relevant Medical Information{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
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
                  {renderError("medicalInformation")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    File Upload (NDIS Plan Document)
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
                      {renderError("fileUpload")}
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
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-4">
                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg flex items-center"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    {isSubmitting && currentStep === 0 ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {authMode === "signup"
                          ? "Creating Account..."
                          : "Signing In..."}
                      </>
                    ) : currentStep === 0 ? (
                      authMode === "signup" ? (
                        "Create Account"
                      ) : (
                        "Sign In"
                      )
                    ) : (
                      "Next Step"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg flex items-center"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </button>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
