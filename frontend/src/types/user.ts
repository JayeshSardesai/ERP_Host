// Standardized User Interfaces for consistent data handling

export interface UserName {
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
}

export interface UserContact {
  primaryPhone: string;
  secondaryPhone?: string;
  whatsappNumber?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UserAddress {
  permanent: {
    street: string;
    area?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    landmark?: string;
  };
  current?: {
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    landmark?: string;
  };
  sameAsPermanent?: boolean;
}

export interface UserIdentity {
  aadharNumber?: string;
  panNumber?: string;
  voterIdNumber?: string;
  drivingLicenseNumber?: string;
  passportNumber?: string;
}

export interface StudentDetails {
  currentClass: string;
  currentSection: string;
  rollNumber?: string;
  admissionNumber?: string;
  admissionDate?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  religion?: string;
  caste?: string;
  category?: string;
  
  // Family Information
  fatherName: string;
  fatherPhone?: string;
  fatherEmail?: string;
  fatherOccupation?: string;
  fatherAnnualIncome?: number;
  
  motherName: string;
  motherPhone?: string;
  motherEmail?: string;
  motherOccupation?: string;
  motherAnnualIncome?: number;
  
  // Guardian if different from parents
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  
  // Previous School
  previousSchoolName?: string;
  previousBoard?: string;
  lastClass?: string;
  tcNumber?: string;
  
  // Transportation
  transportMode?: string;
  busRoute?: string;
  pickupPoint?: string;
  
  // Financial
  feeCategory?: string;
  concessionType?: string;
  concessionPercentage?: number;
  
  // Banking
  bankName?: string;
  bankAccountNo?: string;
  bankIFSC?: string;
  
  // Medical
  medicalConditions?: string;
  allergies?: string;
  specialNeeds?: string;
}

export interface TeacherDetails {
  employeeId: string;
  subjects: string[];
  qualification: string;
  experience: number;
  joiningDate?: string;
  
  // Professional Details
  specialization?: string;
  previousExperience?: string;
  trainingCompleted?: string[];
  
  // Personal Details
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  religion?: string;
  
  // Banking Information
  bankName?: string;
  bankAccountNo?: string;
  bankIFSC?: string;
  panNumber?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
}

export interface AdminDetails {
  employeeId: string;
  designation: string;
  joiningDate?: string;
  
  // Personal Details
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  
  // Professional Details
  qualification: string;
  experience: number;
  previousExperience?: string;
  
  // Banking Information
  bankName?: string;
  bankAccountNo?: string;
  bankIFSC?: string;
  panNumber?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
}

export interface User {
  _id: string;
  userId: string; // Generated ID like "SB-S-0001"
  schoolCode: string;
  
  // Basic Information
  name: UserName;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  
  // Contact & Address
  contact: UserContact;
  address: UserAddress;
  identity?: UserIdentity;
  
  // Profile Image
  profileImage?: string;
  profilePicture?: string;
  
  // Role-specific details
  studentDetails?: StudentDetails;
  teacherDetails?: TeacherDetails;
  adminDetails?: AdminDetails;
  
  // System fields
  isActive: boolean;
  passwordChangeRequired?: boolean;
  createdAt: string;
  updatedAt?: string;
  
  // School access
  schoolAccess?: {
    joinedDate: string;
    status: string;
    accessLevel: string;
  };
}

// Form data interfaces for adding/editing users
export interface BaseFormData {
  // Basic Information
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  
  // Contact Information
  primaryPhone: string;
  secondaryPhone?: string;
  whatsappNumber?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  
  // Address Information
  permanentStreet: string;
  permanentArea?: string;
  permanentCity: string;
  permanentState: string;
  permanentCountry: string;
  permanentPincode: string;
  permanentLandmark?: string;
  
  currentStreet?: string;
  currentArea?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  currentPincode?: string;
  currentLandmark?: string;
  sameAsPermanent: boolean;
  
  // Identity Information
  aadharNumber?: string;
  panNumber?: string;
  
  // Password Management
  useGeneratedPassword: boolean;
  customPassword?: string;
}

export interface StudentFormData extends BaseFormData {
  role: 'student';
  
  // Academic Information
  currentClass: string;
  currentSection: string;
  rollNumber?: string;
  admissionNumber?: string;
  admissionDate?: string;
  
  // Personal Information
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  religion?: string;
  caste?: string;
  category?: string;
  
  // Family Information - Father
  fatherName: string;
  fatherPhone?: string;
  fatherEmail?: string;
  fatherOccupation?: string;
  fatherAnnualIncome?: number;
  
  // Family Information - Mother
  motherName: string;
  motherPhone?: string;
  motherEmail?: string;
  motherOccupation?: string;
  motherAnnualIncome?: number;
  
  // Guardian Information
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  
  // Previous School
  previousSchoolName?: string;
  previousBoard?: string;
  lastClass?: string;
  tcNumber?: string;
  
  // Transportation
  transportMode?: string;
  busRoute?: string;
  pickupPoint?: string;
  
  // Financial Information
  feeCategory?: string;
  concessionType?: string;
  concessionPercentage?: number;
  
  // Banking Information
  bankName?: string;
  bankAccountNo?: string;
  bankIFSC?: string;
  
  // Medical Information
  medicalConditions?: string;
  allergies?: string;
  specialNeeds?: string;
}

export interface TeacherFormData extends BaseFormData {
  role: 'teacher';
  
  // Professional Information
  employeeId?: string; // Auto-generated if not provided
  subjects: string[];
  qualification: string;
  experience: number;
  joiningDate?: string;
  specialization?: string;
  previousExperience?: string;
  
  // Personal Information
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  religion?: string;
  
  // Banking Information
  bankName?: string;
  bankAccountNo?: string;
  bankIFSC?: string;
}

export interface AdminFormData extends BaseFormData {
  role: 'admin';
  
  // Professional Information
  employeeId?: string; // Auto-generated if not provided
  designation: string;
  qualification: string;
  experience: number;
  joiningDate?: string;
  previousExperience?: string;
  
  // Personal Information
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  
  // Banking Information
  bankName?: string;
  bankAccountNo?: string;
  bankIFSC?: string;
}

// Union type for form data
export type UserFormData = StudentFormData | TeacherFormData | AdminFormData;

// Default form data
export const getDefaultFormData = (role: 'student' | 'teacher' | 'admin'): UserFormData => {
  const baseData: BaseFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role,
    primaryPhone: '',
    secondaryPhone: '',
    whatsappNumber: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    permanentStreet: '',
    permanentArea: '',
    permanentCity: '',
    permanentState: '',
    permanentCountry: 'India',
    permanentPincode: '',
    permanentLandmark: '',
    currentStreet: '',
    currentArea: '',
    currentCity: '',
    currentState: '',
    currentCountry: 'India',
    currentPincode: '',
    currentLandmark: '',
    sameAsPermanent: true,
    aadharNumber: '',
    panNumber: '',
    useGeneratedPassword: true,
    customPassword: ''
  };

  switch (role) {
    case 'student':
      return {
        ...baseData,
        role: 'student',
        currentClass: '',
        currentSection: '',
        rollNumber: '',
        admissionNumber: '',
        admissionDate: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: '',
        nationality: 'Indian',
        religion: '',
        caste: '',
        category: '',
        fatherName: '',
        fatherPhone: '',
        fatherEmail: '',
        fatherOccupation: '',
        fatherAnnualIncome: 0,
        motherName: '',
        motherPhone: '',
        motherEmail: '',
        motherOccupation: '',
        motherAnnualIncome: 0,
        guardianName: '',
        guardianRelationship: '',
        guardianPhone: '',
        guardianEmail: '',
        previousSchoolName: '',
        previousBoard: '',
        lastClass: '',
        tcNumber: '',
        transportMode: '',
        busRoute: '',
        pickupPoint: '',
        feeCategory: '',
        concessionType: '',
        concessionPercentage: 0,
        bankName: '',
        bankAccountNo: '',
        bankIFSC: '',
        medicalConditions: '',
        allergies: '',
        specialNeeds: ''
      } as StudentFormData;

    case 'teacher':
      return {
        ...baseData,
        role: 'teacher',
        employeeId: '',
        subjects: [],
        qualification: '',
        experience: 0,
        joiningDate: '',
        specialization: '',
        previousExperience: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: '',
        nationality: 'Indian',
        religion: '',
        bankName: '',
        bankAccountNo: '',
        bankIFSC: ''
      } as TeacherFormData;

    case 'admin':
      return {
        ...baseData,
        role: 'admin',
        employeeId: '',
        designation: '',
        qualification: '',
        experience: 0,
        joiningDate: '',
        previousExperience: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: '',
        nationality: 'Indian',
        bankName: '',
        bankAccountNo: '',
        bankIFSC: ''
      } as AdminFormData;

    default:
      throw new Error(`Invalid role: ${role}`);
  }
};

// Utility functions for data transformation
export const transformUserToFormData = (user: User): UserFormData => {
  const baseData = {
    firstName: user.name.firstName,
    middleName: user.name.middleName || '',
    lastName: user.name.lastName,
    email: user.email,
    role: user.role as 'student' | 'teacher' | 'admin',
    primaryPhone: user.contact.primaryPhone,
    secondaryPhone: user.contact.secondaryPhone || '',
    whatsappNumber: user.contact.whatsappNumber || '',
    emergencyContactName: user.contact.emergencyContact?.name || '',
    emergencyContactRelation: user.contact.emergencyContact?.relationship || '',
    emergencyContactPhone: user.contact.emergencyContact?.phone || '',
    permanentStreet: user.address.permanent.street,
    permanentArea: user.address.permanent.area || '',
    permanentCity: user.address.permanent.city,
    permanentState: user.address.permanent.state,
    permanentCountry: user.address.permanent.country,
    permanentPincode: user.address.permanent.pincode,
    permanentLandmark: user.address.permanent.landmark || '',
    currentStreet: user.address.current?.street || '',
    currentArea: user.address.current?.area || '',
    currentCity: user.address.current?.city || '',
    currentState: user.address.current?.state || '',
    currentCountry: user.address.current?.country || '',
    currentPincode: user.address.current?.pincode || '',
    currentLandmark: user.address.current?.landmark || '',
    sameAsPermanent: user.address.sameAsPermanent || false,
    aadharNumber: user.identity?.aadharNumber || '',
    panNumber: user.identity?.panNumber || '',
    useGeneratedPassword: true,
    customPassword: ''
  };

  // Add role-specific data based on user type
  switch (user.role) {
    case 'student':
      if (user.studentDetails) {
        return {
          ...baseData,
          role: 'student',
          currentClass: user.studentDetails.currentClass,
          currentSection: user.studentDetails.currentSection,
          rollNumber: user.studentDetails.rollNumber || '',
          admissionNumber: user.studentDetails.admissionNumber || '',
          admissionDate: user.studentDetails.admissionDate || '',
          dateOfBirth: user.studentDetails.dateOfBirth,
          gender: user.studentDetails.gender,
          bloodGroup: user.studentDetails.bloodGroup || '',
          nationality: user.studentDetails.nationality,
          religion: user.studentDetails.religion || '',
          caste: user.studentDetails.caste || '',
          category: user.studentDetails.category || '',
          fatherName: user.studentDetails.fatherName,
          fatherPhone: user.studentDetails.fatherPhone || '',
          fatherEmail: user.studentDetails.fatherEmail || '',
          fatherOccupation: user.studentDetails.fatherOccupation || '',
          fatherAnnualIncome: user.studentDetails.fatherAnnualIncome || 0,
          motherName: user.studentDetails.motherName,
          motherPhone: user.studentDetails.motherPhone || '',
          motherEmail: user.studentDetails.motherEmail || '',
          motherOccupation: user.studentDetails.motherOccupation || '',
          motherAnnualIncome: user.studentDetails.motherAnnualIncome || 0,
          guardianName: user.studentDetails.guardianName || '',
          guardianRelationship: user.studentDetails.guardianRelationship || '',
          guardianPhone: user.studentDetails.guardianPhone || '',
          guardianEmail: user.studentDetails.guardianEmail || '',
          previousSchoolName: user.studentDetails.previousSchoolName || '',
          previousBoard: user.studentDetails.previousBoard || '',
          lastClass: user.studentDetails.lastClass || '',
          tcNumber: user.studentDetails.tcNumber || '',
          transportMode: user.studentDetails.transportMode || '',
          busRoute: user.studentDetails.busRoute || '',
          pickupPoint: user.studentDetails.pickupPoint || '',
          feeCategory: user.studentDetails.feeCategory || '',
          concessionType: user.studentDetails.concessionType || '',
          concessionPercentage: user.studentDetails.concessionPercentage || 0,
          bankName: user.studentDetails.bankName || '',
          bankAccountNo: user.studentDetails.bankAccountNo || '',
          bankIFSC: user.studentDetails.bankIFSC || '',
          medicalConditions: user.studentDetails.medicalConditions || '',
          allergies: user.studentDetails.allergies || '',
          specialNeeds: user.studentDetails.specialNeeds || ''
        } as StudentFormData;
      }
      break;

    case 'teacher':
      if (user.teacherDetails) {
        return {
          ...baseData,
          role: 'teacher',
          employeeId: user.teacherDetails.employeeId,
          subjects: user.teacherDetails.subjects,
          qualification: user.teacherDetails.qualification,
          experience: user.teacherDetails.experience,
          joiningDate: user.teacherDetails.joiningDate || '',
          specialization: user.teacherDetails.specialization || '',
          previousExperience: user.teacherDetails.previousExperience || '',
          dateOfBirth: user.teacherDetails.dateOfBirth,
          gender: user.teacherDetails.gender,
          bloodGroup: user.teacherDetails.bloodGroup || '',
          nationality: user.teacherDetails.nationality,
          religion: user.teacherDetails.religion || '',
          bankName: user.teacherDetails.bankName || '',
          bankAccountNo: user.teacherDetails.bankAccountNo || '',
          bankIFSC: user.teacherDetails.bankIFSC || ''
        } as TeacherFormData;
      }
      break;

    case 'admin':
      if (user.adminDetails) {
        return {
          ...baseData,
          role: 'admin',
          employeeId: user.adminDetails.employeeId,
          designation: user.adminDetails.designation,
          qualification: user.adminDetails.qualification,
          experience: user.adminDetails.experience,
          joiningDate: user.adminDetails.joiningDate || '',
          previousExperience: user.adminDetails.previousExperience || '',
          dateOfBirth: user.adminDetails.dateOfBirth,
          gender: user.adminDetails.gender,
          bloodGroup: user.adminDetails.bloodGroup || '',
          nationality: user.adminDetails.nationality,
          bankName: user.adminDetails.bankName || '',
          bankAccountNo: user.adminDetails.bankAccountNo || '',
          bankIFSC: user.adminDetails.bankIFSC || ''
        } as AdminFormData;
      }
      break;
  }

  // Fallback: return default form data for the role
  return getDefaultFormData(user.role as 'student' | 'teacher' | 'admin');
};
