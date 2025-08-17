"use client";

import { useEffect, useState } from "react";
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";

// Firebase
import app, { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "participant",
    label: "Participant",
    description: "Join fitness programs and track your progress",
    icon: "🏃‍♂️",
  },
  {
    value: "instructor",
    label: "Instructor",
    description: "Lead sessions and support participants",
    icon: "👨‍🏫",
  },
  {
    value: "support_worker",
    label: "Support Worker",
    description: "Provide guidance and assistance to participants",
    icon: "🤝",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    description: "Manage care plans and staff coordination",
    icon: "🏢",
  },
  {
    value: "fitness_partner",
    label: "Fitness Partner",
    description: "Provide facilities and resources",
    icon: "🏋️‍♀️",
  },
];

interface FormData {
  // Auth
  emailAddress: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  role: UserRole;

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

  // Representative
  repFirstName: string;
  repLastName: string;
  repPhoneNumber: string;
  repEmail: string;
  repStreetAddress: string;
  repCity: string;
  repState: string;
  repPostcode: string;

  // NDIS
  planType: string;
  planManagerName: string;
  planManagerAgency: string;
  ndisNumber: string;
  availableFunding: string;
  planStartDate: string;
  planReviewDate: string;
  clientGoals: string;

  // Referrer
  referrerFirstName: string;
  referrerLastName: string;
  referrerAgency: string;
  referrerRole: string;
  referrerEmail: string;
  referrerPhone: string;
  consentObtained: boolean;

  // Referral
  referralType: string;
  medicalInformation: string;
  fileUpload: File | null;

  // Terms
  acceptedTerms: boolean;
}

export default function RegisterPage() {
  const seasonalColors = useSeasonalColors();
  const { signUp, signIn } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    emailAddress: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "participant",
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
    acceptedTerms: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      if (u) {
        setFormData((prev) => ({
          ...prev,
          emailAddress: prev.emailAddress || u.email || "",
          displayName: prev.displayName || u.displayName || "",
        }));
      }
    });
    return () => unsub();
  }, []);

  const totalSteps = 6;

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateAuth = (): boolean => {
    const newErrors: Record<string, boolean | string> = {};
    let isValid = true;

    if (authMode === "signup") {
      if (!formData.displayName.trim()) {
        newErrors.displayName = "Full name is required";
        isValid = false;
      }
      if (!formData.acceptedTerms) {
        newErrors.acceptedTerms = "You must accept the Privacy Policy";
        isValid = false;
      }
    }

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
      if (authMode === "signup") {
        await signUp(
          formData.emailAddress,
          formData.password,
          formData.role,
          formData.displayName
        );
        if (auth.currentUser && formData.displayName) {
          await updateProfile(auth.currentUser, {
            displayName: formData.displayName,
          });
        }
      } else {
        await signIn(formData.emailAddress, formData.password);
      }
      setCurrentStep(1);
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrors({ auth: error?.message || "Authentication failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean | string> = {};
    let isValid = true;

    switch (step) {
      case 1: {
        const required: (keyof FormData)[] = [
          "firstName",
          "lastName",
          "dateOfBirth",
          "phoneNumber",
          "streetAddress",
          "city",
          "state",
          "postcode",
        ];
        required.forEach((f) => {
          if (!formData[f]) {
            newErrors[f] = true;
            isValid = false;
          }
        });
        break;
      }
      case 3: {
        const required: (keyof FormData)[] = [
          "planType",
          "ndisNumber",
          "planStartDate",
          "planReviewDate",
          "clientGoals",
        ];
        required.forEach((f) => {
          if (!formData[f]) {
            newErrors[f] = true;
            isValid = false;
          }
        });
        break;
      }
      case 4: {
        const required: (keyof FormData)[] = [
          "referrerFirstName",
          "referrerLastName",
          "referrerEmail",
          "referrerPhone",
        ];
        required.forEach((f) => {
          if (!formData[f]) {
            newErrors[f] = true;
            isValid = false;
          }
        });
        if (!formData.consentObtained) {
          newErrors["consentObtained"] = true;
          isValid = false;
        }
        break;
      }
      case 5: {
        const required: (keyof FormData)[] = [
          "referralType",
          "medicalInformation",
        ];
        required.forEach((f) => {
          if (!formData[f]) {
            newErrors[f] = true;
            isValid = false;
          }
        });
        break;
      }
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
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file || !currentUser) return null;
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    const fileRef = ref(storage, `ndis-plans/${currentUser.uid}/${fileName}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !currentUser) return;
    setIsSubmitting(true);

    try {
      // Upload file if provided
      let fileUrl: string | null = null;
      if (formData.fileUpload) fileUrl = await uploadFile(formData.fileUpload);

      // USERS/{uid}
      const userData = {
        uid: currentUser.uid,
        role: formData.role,
        email: formData.emailAddress,
        displayName: formData.displayName || currentUser.displayName || "",
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
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
        ndis: {
          planType: formData.planType,
          planManagerName: formData.planManagerName || null,
          planManagerAgency: formData.planManagerAgency || null,
          ndisNumber: formData.ndisNumber,
          availableFunding: formData.availableFunding || null,
          planStartDate: formData.planStartDate,
          planReviewDate: formData.planReviewDate,
          goals: formData.clientGoals,
          planDocumentUrl: fileUrl,
        },
        referrer: {
          firstName: formData.referrerFirstName,
          lastName: formData.referrerLastName,
          agency: formData.referrerAgency || null,
          role: formData.referrerRole || null,
          email: formData.referrerEmail,
          phone: formData.referrerPhone,
          consentObtained: formData.consentObtained,
        },
        referral: {
          type: formData.referralType,
          medicalInformation: formData.medicalInformation,
        },
        registrationStatus: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", currentUser.uid), userData, {
        merge: true,
      });

      // CAREPLANS/{uid}
      const carePlanData = {
        participantId: currentUser.uid,
        goals: formData.clientGoals,
        medicalInfo: formData.medicalInformation,
        planDocumentUrl: fileUrl,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "carePlans", currentUser.uid), carePlanData, {
        merge: true,
      });

      setSuccessMessage(
        "Registration completed successfully! You will be contacted soon by our team to schedule your initial assessment."
      );
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      setErrors({
        submit:
          error?.message || "Failed to submit registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.size > 10 * 1024 * 1024) {
      setErrors({ fileUpload: "File size must be less than 10MB" });
      return;
    }

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (file && !allowed.includes(file.type)) {
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

          {/* Progress */}
          <div className="mb-12">
            <div className="relative flex items-center justify-between mb-4">
              {stepTitles.map((title, index) => {
                const IconComponent = stepIcons[index];
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
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

          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {/* Step 0 */}
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
                  {authMode === "signup" && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) =>
                            handleInputChange("displayName", e.target.value)
                          }
                          className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors.displayName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-slate-200 dark:border-slate-600"
                          }`}
                          style={
                            !errors.displayName
                              ? ({
                                  "--tw-ring-color": seasonalColors.primary,
                                } as React.CSSProperties)
                              : undefined
                          }
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      {renderError("displayName")}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) =>
                          handleInputChange("emailAddress", e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                          errors.emailAddress
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                        style={
                          !errors.emailAddress
                            ? ({
                                "--tw-ring-color": seasonalColors.primary,
                              } as React.CSSProperties)
                            : undefined
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    {renderError("emailAddress")}
                  </div>

                  {authMode === "signup" && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        I am a...
                      </label>
                      <div className="relative">
                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            handleInputChange(
                              "role",
                              e.target.value as UserRole
                            )
                          }
                          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent appearance-none"
                          style={
                            {
                              "--tw-ring-color": seasonalColors.primary,
                            } as React.CSSProperties
                          }
                        >
                          {roles.map((role) => (
                            <option
                              key={role.value}
                              value={role.value}
                              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                              {role.icon} {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p
                        className="mt-2 text-sm p-3 rounded-lg border"
                        style={{
                          backgroundColor: `${seasonalColors.primary}10`,
                          borderColor: `${seasonalColors.primary}30`,
                          color: seasonalColors.primary,
                        }}
                      >
                        <span className="font-medium">
                          {
                            roles.find((r) => r.value === formData.role)
                              ?.description
                          }
                        </span>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                        style={
                          !errors.password
                            ? ({
                                "--tw-ring-color": seasonalColors.primary,
                              } as React.CSSProperties)
                            : undefined
                        }
                        placeholder={
                          authMode === "signup"
                            ? "Create a password"
                            : "Enter your password"
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        style={{
                          color: showPassword
                            ? seasonalColors.primary
                            : undefined,
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {renderError("password")}
                  </div>

                  {authMode === "signup" && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-200 dark:border-slate-600"
                            }`}
                            style={
                              !errors.confirmPassword
                                ? ({
                                    "--tw-ring-color": seasonalColors.primary,
                                  } as React.CSSProperties)
                                : undefined
                            }
                            placeholder="Confirm your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            style={{
                              color: showConfirmPassword
                                ? seasonalColors.primary
                                : undefined,
                            }}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {renderError("confirmPassword")}
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={formData.acceptedTerms}
                          onChange={(e) =>
                            handleInputChange("acceptedTerms", e.target.checked)
                          }
                          className="w-4 h-4 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded mt-1"
                          style={{ accentColor: seasonalColors.primary }}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          I agree to the{" "}
                          <a
                            href="#"
                            className="font-medium"
                            style={{ color: seasonalColors.primary }}
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {renderError("acceptedTerms")}
                    </>
                  )}

                  {errors.auth && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.auth}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1 */}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.firstName
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.lastName
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.dateOfBirth
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.phoneNumber
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    />
                    {renderError("phoneNumber")}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
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
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
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
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.streetAddress
                        ? "border-red-500 ring-2 ring-red-500"
                        : "border-slate-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.city
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.state
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.postcode
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    />
                    {renderError("postcode")}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
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
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.repPhoneNumber}
                      onChange={(e) =>
                        handleInputChange("repPhoneNumber", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Street
                    </label>
                    <input
                      type="text"
                      value={formData.repStreetAddress}
                      onChange={(e) =>
                        handleInputChange("repStreetAddress", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
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
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.ndisNumber
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.planStartDate
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.planReviewDate
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    />
                    {renderError("planReviewDate")}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Manager Name
                    </label>
                    <input
                      type="text"
                      value={formData.planManagerName}
                      onChange={(e) =>
                        handleInputChange("planManagerName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Plan Manager Agency
                    </label>
                    <input
                      type="text"
                      value={formData.planManagerAgency}
                      onChange={(e) =>
                        handleInputChange("planManagerAgency", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
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
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.clientGoals
                        ? "border-red-500 ring-2 ring-red-500"
                        : "border-slate-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    placeholder="Describe the client's goals as outlined in their NDIS plan..."
                  />
                  {renderError("clientGoals")}
                </div>
              </div>
            )}

            {/* Step 4 */}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.referrerFirstName
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.referrerLastName
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.referrerEmail
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.referrerPhone
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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

            {/* Step 5 */}
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
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.medicalInformation
                        ? "border-red-500 ring-2 ring-red-500"
                        : "border-slate-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
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

            {/* Nav buttons */}
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
