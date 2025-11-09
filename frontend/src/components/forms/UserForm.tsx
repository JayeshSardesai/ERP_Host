import React, { useState, useEffect } from 'react';
import { UserFormData, StudentFormData, TeacherFormData, AdminFormData, getDefaultFormData } from '../../types/user';
import { useSchoolClasses } from '../../hooks/useSchoolClasses';

interface UserFormProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  formErrors: Record<string, string>;
  setFormErrors: (errors: Record<string, string>) => void;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  formData, 
  setFormData, 
  formErrors, 
  setFormErrors, 
  isEditing = false 
}) => {
  
  // Use the school classes hook
  const { 
    classesData, 
    loading: classesLoading, 
    error: classesError,
    getClassOptions,
    getSectionsByClass 
  } = useSchoolClasses();

  // State for sections based on selected class
  const [availableSections, setAvailableSections] = useState<any[]>([]);
  
  // Load sections when class data is available and form has a class selected
  useEffect(() => {
    if (formData.role === 'student' && (formData as StudentFormData).currentClass && classesData) {
      const sections = getSectionsByClass((formData as StudentFormData).currentClass);
      setAvailableSections(sections);
    }
  }, [formData.role, (formData as StudentFormData).currentClass, classesData, getSectionsByClass]);
  
  const handleInputChange = (field: string, value: any) => {
    // Special handling for class selection - update sections
    if (field === 'currentClass' && formData.role === 'student') {
      const sections = getSectionsByClass(value);
      setAvailableSections(sections);
      
      // Clear section if class changes
      setFormData({
        ...formData,
        [field]: value,
        currentSection: '' // Clear section when class changes
      } as UserFormData);
    } else {
      setFormData({
        ...formData,
        [field]: value
      } as UserFormData);
    }
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ''
      });
    }
  };

  const handleRoleChange = (newRole: 'student' | 'teacher' | 'admin') => {
    if (isEditing) return; // Don't allow role change during editing
    
    const newFormData = getDefaultFormData(newRole);
    // Preserve basic information if it exists
    newFormData.firstName = formData.firstName;
    newFormData.middleName = formData.middleName;
    newFormData.lastName = formData.lastName;
    newFormData.email = formData.email;
    newFormData.primaryPhone = formData.primaryPhone;
    
    setFormData(newFormData);
    setFormErrors({});
  };

  const handleAddressToggle = () => {
    const newSameAsPermanent = !formData.sameAsPermanent;
    setFormData({
      ...formData,
      sameAsPermanent: newSameAsPermanent,
      ...(newSameAsPermanent ? {
        currentStreet: '',
        currentArea: '',
        currentCity: '',
        currentState: '',
        currentCountry: '',
        currentPincode: '',
        currentLandmark: ''
      } : {})
    } as UserFormData);
  };

  const subjectOptions = [
    'Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Kannada',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education',
    'Art', 'Music', 'History', 'Geography', 'Economics', 'Political Science'
  ];

  // Get dynamic class and section options
  const dynamicClassOptions = getClassOptions();
  const hasDynamicClasses = dynamicClassOptions.length > 0;
  
  // Fallback to default options if no classes are configured
  const fallbackClassOptions = [
    'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];
  const fallbackSectionOptions = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">User Role</h3>
        <div className="flex gap-6">
          {['student', 'teacher', 'admin'].map((role) => (
            <label key={role} className="flex items-center">
              <input
                type="radio"
                name="role"
                value={role}
                checked={formData.role === role}
                onChange={(e) => handleRoleChange(e.target.value as 'student' | 'teacher' | 'admin')}
                disabled={isEditing}
                className="mr-2"
              />
              <span className="capitalize font-medium">{role}</span>
            </label>
          ))}
        </div>
        {formErrors.role && <p className="text-red-600 text-sm mt-1">{formErrors.role}</p>}
      </div>

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter first name"
            />
            {formErrors.firstName && <p className="text-red-600 text-sm mt-1">{formErrors.firstName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
            <input
              type="text"
              value={formData.middleName || ''}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter middle name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter last name"
            />
            {formErrors.lastName && <p className="text-red-600 text-sm mt-1">{formErrors.lastName}</p>}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter email address"
            />
            {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone *</label>
            <input
              type="tel"
              value={formData.primaryPhone}
              onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${formErrors.primaryPhone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter phone number"
            />
            {formErrors.primaryPhone && <p className="text-red-600 text-sm mt-1">{formErrors.primaryPhone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
            <input
              type="tel"
              value={formData.secondaryPhone || ''}
              onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter secondary phone"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={formData.whatsappNumber || ''}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter WhatsApp number"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
            <input
              type="text"
              value={formData.emergencyContactName || ''}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter contact name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <input
              type="text"
              value={formData.emergencyContactRelation || ''}
              onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter relationship"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
            <input
              type="tel"
              value={formData.emergencyContactPhone || ''}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter emergency phone"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Address Information</h3>
        
        {/* Permanent Address */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-2">Permanent Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.permanentStreet}
                onChange={(e) => handleInputChange('permanentStreet', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter street address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
              <input
                type="text"
                value={formData.permanentArea || ''}
                onChange={(e) => handleInputChange('permanentArea', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter area"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.permanentCity}
                onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData.permanentState}
                onChange={(e) => handleInputChange('permanentState', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter state"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
              <input
                type="text"
                value={formData.permanentPincode}
                onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter pin code"
              />
            </div>
          </div>
        </div>

        {/* Current Address Toggle */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.sameAsPermanent}
              onChange={handleAddressToggle}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Current address is same as permanent address</span>
          </label>
        </div>

        {/* Current Address (only if different) */}
        {!formData.sameAsPermanent && (
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Current Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.currentStreet || ''}
                  onChange={(e) => handleInputChange('currentStreet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                <input
                  type="text"
                  value={formData.currentArea || ''}
                  onChange={(e) => handleInputChange('currentArea', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter area"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.currentCity || ''}
                  onChange={(e) => handleInputChange('currentCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.currentState || ''}
                  onChange={(e) => handleInputChange('currentState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={formData.currentPincode || ''}
                  onChange={(e) => handleInputChange('currentPincode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter pin code"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Identity Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Identity Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
            <input
              type="text"
              value={formData.aadharNumber || ''}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Aadhar number"
              maxLength={12}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              value={formData.panNumber || ''}
              onChange={(e) => handleInputChange('panNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter PAN number"
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* Role-specific sections */}
      {formData.role === 'student' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Student Information</h3>
          
          {/* Academic Information */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-800 mb-2">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                {classesLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading classes...
                  </div>
                ) : (
                  <select
                    value={(formData as StudentFormData).currentClass || ''}
                    onChange={(e) => handleInputChange('currentClass', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.currentClass ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Class</option>
                    {hasDynamicClasses ? (
                      dynamicClassOptions.map(cls => (
                        <option key={cls.value} value={cls.value}>{cls.label}</option>
                      ))
                    ) : (
                      fallbackClassOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))
                    )}
                  </select>
                )}
                {classesError && <p className="text-yellow-600 text-sm mt-1">⚠️ Using default classes (Super Admin hasn't configured classes yet)</p>}
                {formErrors.currentClass && <p className="text-red-600 text-sm mt-1">{formErrors.currentClass}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                <select
                  value={(formData as StudentFormData).currentSection || ''}
                  onChange={(e) => handleInputChange('currentSection', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.currentSection ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={!((formData as StudentFormData).currentClass)}
                >
                  <option value="">Select Section</option>
                  {(formData as StudentFormData).currentClass ? (
                    availableSections.length > 0 ? (
                      availableSections.map(sec => (
                        <option key={sec.value} value={sec.value}>{sec.label}</option>
                      ))
                    ) : (
                      fallbackSectionOptions.map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))
                    )
                  ) : (
                    <option value="" disabled>Select a class first</option>
                  )}
                </select>
                {formErrors.currentSection && <p className="text-red-600 text-sm mt-1">{formErrors.currentSection}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={(formData as StudentFormData).rollNumber || ''}
                  onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter roll number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                <input
                  type="text"
                  value={(formData as StudentFormData).admissionNumber || ''}
                  onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter admission number"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-800 mb-2">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={(formData as StudentFormData).dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{formErrors.dateOfBirth}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={(formData as StudentFormData).gender || 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  value={(formData as StudentFormData).bloodGroup || ''}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-800 mb-2">Family Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Father's Information */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700">Father's Information</h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
                  <input
                    type="text"
                    value={(formData as StudentFormData).fatherName || ''}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter father's name"
                  />
                  {formErrors.fatherName && <p className="text-red-600 text-sm mt-1">{formErrors.fatherName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Phone</label>
                  <input
                    type="tel"
                    value={(formData as StudentFormData).fatherPhone || ''}
                    onChange={(e) => handleInputChange('fatherPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter father's phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    value={(formData as StudentFormData).fatherOccupation || ''}
                    onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter father's occupation"
                  />
                </div>
              </div>

              {/* Mother's Information */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700">Mother's Information</h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
                  <input
                    type="text"
                    value={(formData as StudentFormData).motherName || ''}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.motherName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter mother's name"
                  />
                  {formErrors.motherName && <p className="text-red-600 text-sm mt-1">{formErrors.motherName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Phone</label>
                  <input
                    type="tel"
                    value={(formData as StudentFormData).motherPhone || ''}
                    onChange={(e) => handleInputChange('motherPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter mother's phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                  <input
                    type="text"
                    value={(formData as StudentFormData).motherOccupation || ''}
                    onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter mother's occupation"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {formData.role === 'teacher' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Teacher Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={(formData as TeacherFormData).employeeId || ''}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Auto-generated if empty"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                value={(formData as TeacherFormData).dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{formErrors.dateOfBirth}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
              <input
                type="text"
                value={(formData as TeacherFormData).qualification || ''}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.qualification ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter highest qualification"
              />
              {formErrors.qualification && <p className="text-red-600 text-sm mt-1">{formErrors.qualification}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={(formData as TeacherFormData).experience || 0}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter years of experience"
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {subjectOptions.map(subject => (
                <label key={subject} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(formData as TeacherFormData).subjects?.includes(subject) || false}
                    onChange={(e) => {
                      const subjects = (formData as TeacherFormData).subjects || [];
                      if (e.target.checked) {
                        handleInputChange('subjects', [...subjects, subject]);
                      } else {
                        handleInputChange('subjects', subjects.filter(s => s !== subject));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{subject}</span>
                </label>
              ))}
            </div>
            {formErrors.subjects && <p className="text-red-600 text-sm mt-1">{formErrors.subjects}</p>}
          </div>
        </div>
      )}

      {formData.role === 'admin' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Admin Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={(formData as AdminFormData).employeeId || ''}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Auto-generated if empty"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
              <input
                type="text"
                value={(formData as AdminFormData).designation || ''}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.designation ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter designation"
              />
              {formErrors.designation && <p className="text-red-600 text-sm mt-1">{formErrors.designation}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                value={(formData as AdminFormData).dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{formErrors.dateOfBirth}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
              <input
                type="text"
                value={(formData as AdminFormData).qualification || ''}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.qualification ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter highest qualification"
              />
              {formErrors.qualification && <p className="text-red-600 text-sm mt-1">{formErrors.qualification}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={(formData as AdminFormData).experience || 0}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter years of experience"
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Password Section (only for new users) */}
      {!isEditing && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Password Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="passwordOption"
                  checked={formData.useGeneratedPassword}
                  onChange={() => handleInputChange('useGeneratedPassword', true)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Generate automatic password</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                {formData.role === 'student' 
                  ? 'Password will be generated from date of birth'
                  : 'A secure random password will be generated'
                }
              </p>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="passwordOption"
                  checked={!formData.useGeneratedPassword}
                  onChange={() => handleInputChange('useGeneratedPassword', false)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Set custom password</span>
              </label>
            </div>
            
            {!formData.useGeneratedPassword && (
              <div className="ml-6">
                <input
                  type="password"
                  value={formData.customPassword || ''}
                  onChange={(e) => handleInputChange('customPassword', e.target.value)}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter custom password"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;
