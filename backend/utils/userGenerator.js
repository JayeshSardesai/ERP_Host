const bcrypt = require('bcryptjs');
const SchoolDatabaseManager = require('./schoolDatabaseManager');
const { ObjectId } = require('mongodb');

class UserGenerator {
  
  /**
   * Generate a unique user ID based on school code and role
   * Format: SCHOOL-ROLE-####
   * Example: NPS-A-0001, NPS-T-0023, NPS-S-0156
   * Uses the same atomic counter system as the main generateSequentialUserId
   */
  static async generateUserId(schoolCode, role) {
    try {
      // Use the same atomic counter system from userController
      const userController = require('../controllers/userController');
      return await userController.generateSequentialUserId(schoolCode, role);
    } catch (error) {
      console.error('Error generating user ID:', error);
      throw error;
    }
  }
  
  /**
   * Generate a random password
   * Format: 8 characters with mix of letters and numbers
   */
  static generateRandomPassword(length = 8) {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }
  
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
  /**
   * Create a new user in the appropriate school collection
   */
  static async createUser(schoolCode, userData) {
    try {
      const connection = await SchoolDatabaseManager.getSchoolConnection(schoolCode);
      
      // Generate user ID and password
      const userId = await this.generateUserId(schoolCode, userData.role);
      const plainPassword = this.generateRandomPassword();
      const hashedPassword = await this.hashPassword(plainPassword);
      
      // Determine collection based on role
      const collectionMap = {
        'admin': 'admins',
        'teacher': 'teachers', 
        'student': 'students',
        'parent': 'parents'
      };
      
      const collectionName = collectionMap[userData.role.toLowerCase()];
      if (!collectionName) {
        throw new Error(`Invalid role: ${userData.role}`);
      }
      
      const collection = connection.collection(collectionName);
      
      // Prepare user document
      const userDocument = {
        userId,
        email: userData.email,
        password: hashedPassword,
        temporaryPassword: plainPassword, // Store plain password for admin access
        role: userData.role.toLowerCase(),
        name: {
          firstName: userData.firstName || userData.name?.firstName || 'User',
          lastName: userData.lastName || userData.name?.lastName || 'Name',
          displayName: userData.displayName || userData.name?.displayName || `${userData.firstName || 'User'} ${userData.lastName || 'Name'}`
        },
        contact: {
          primaryPhone: userData.phone || userData.contact?.primaryPhone || '',
          secondaryPhone: userData.contact?.secondaryPhone || '',
          emergencyContact: userData.contact?.emergencyContact || ''
        },
        address: userData.address || {
          permanent: {
            street: 'Not provided',
            city: 'Not provided',
            state: 'Not provided',
            country: 'India',
            pincode: '000000'
          }
        },
        schoolCode,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userData.createdBy || null,
        loginAttempts: 0,
        lastLogin: null,
        profileImage: userData.profileImage || null
      };
      
      // Add role-specific fields
      if (userData.role.toLowerCase() === 'student') {
        userDocument.academicInfo = {
          class: userData.class || '',
          section: userData.section || '',
          rollNumber: userData.rollNumber || '',
          admissionNumber: userData.admissionNumber || userId,
          admissionDate: userData.admissionDate || new Date(),
          parentIds: userData.parentIds || []
        };
        
        // Karnataka SATS Personal Information
        userDocument.personal = {
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender || 'male',
          bloodGroup: userData.bloodGroup || '',
          nationality: userData.nationality || 'Indian',
          religion: userData.religion || '',
          religionOther: userData.religionOther || '',
          caste: userData.caste || '',
          casteOther: userData.casteOther || '',
          category: userData.category || '',
          categoryOther: userData.categoryOther || '',
          motherTongue: userData.motherTongue || '',
          motherTongueOther: userData.motherTongueOther || '',
          
          // Karnataka SATS Specific Fields
          studentNameKannada: userData.studentNameKannada || '',
          ageYears: userData.ageYears || 0,
          ageMonths: userData.ageMonths || 0,
          socialCategory: userData.socialCategory || '',
          socialCategoryOther: userData.socialCategoryOther || '',
          studentCaste: userData.studentCaste || '',
          studentCasteOther: userData.studentCasteOther || '',
          studentAadhaar: userData.studentAadhaar || '',
          studentCasteCertNo: userData.studentCasteCertNo || '',
          
          // Additional SATS Fields
          specialCategory: userData.specialCategory || '',
          specialCategoryOther: userData.specialCategoryOther || '',
          
          // Economic Status
          belongingToBPL: userData.belongingToBPL || 'No',
          bplCardNo: userData.bplCardNo || '',
          bhagyalakshmiBondNo: userData.bhagyalakshmiBondNo || '',
          
          // Special Needs
          disability: userData.disability || 'Not Applicable',
          disabilityOther: userData.disabilityOther || ''
        };
        
        // Karnataka SATS Family Information
        userDocument.family = {
          father: {
            name: userData.fatherName || '',
            nameKannada: userData.fatherNameKannada || '',
            aadhaar: userData.fatherAadhaar || '',
            caste: userData.fatherCaste || '',
            casteOther: userData.fatherCasteOther || '',
            casteCertNo: userData.fatherCasteCertNo || '',
            occupation: userData.fatherOccupation || '',
            qualification: userData.fatherEducation || '',
            phone: userData.fatherPhone || userData.fatherMobile || '',
            email: userData.fatherEmail || ''
          },
          mother: {
            name: userData.motherName || '',
            nameKannada: userData.motherNameKannada || '',
            aadhaar: userData.motherAadhaar || '',
            caste: userData.motherCaste || '',
            casteOther: userData.motherCasteOther || '',
            casteCertNo: userData.motherCasteCertNo || '',
            occupation: userData.motherOccupation || '',
            qualification: userData.motherEducation || '',
            phone: userData.motherPhone || userData.motherMobile || '',
            email: userData.motherEmail || ''
          },
          guardian: {
            name: userData.guardianName || '',
            relationship: userData.guardianRelation || '',
            phone: userData.emergencyContactPhone || '',
            email: userData.parentEmail || ''
          }
        };
        
        // Banking Information
        userDocument.banking = {
          bankName: userData.bankName || '',
          accountNumber: userData.bankAccountNo || userData.bankAccountNumber || '',
          ifscCode: userData.bankIFSC || userData.ifscCode || '',
          accountHolderName: userData.accountHolderName || ''
        };
      } else if (userData.role.toLowerCase() === 'teacher') {
        userDocument.teachingInfo = {
          subjects: userData.subjects || [],
          classes: userData.classes || [],
          employeeId: userData.employeeId || userId,
          joinDate: userData.joinDate || new Date(),
          qualification: userData.qualification || '',
          experience: userData.experience || 0,
          designation: userData.designation || '',
          department: userData.department || ''
        };
        
        // Teacher Personal Information with "Other" fields
        userDocument.personal = {
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender || 'male',
          bloodGroup: userData.bloodGroup || '',
          nationality: userData.nationality || 'Indian',
          religion: userData.religion || '',
          religionOther: userData.religionOther || '',
          caste: userData.caste || '',
          casteOther: userData.casteOther || '',
          category: userData.category || '',
          categoryOther: userData.categoryOther || '',
          motherTongue: userData.motherTongue || '',
          motherTongueOther: userData.motherTongueOther || '',
          aadhaar: userData.aadhaar || '',
          pan: userData.pan || '',
          
          // Disability information
          disability: userData.disability || 'Not Applicable',
          disabilityOther: userData.disabilityOther || ''
        };
        
        // Teacher Family Information
        userDocument.family = {
          father: {
            name: userData.fatherName || '',
            occupation: userData.fatherOccupation || '',
            caste: userData.fatherCaste || '',
            casteOther: userData.fatherCasteOther || ''
          },
          mother: {
            name: userData.motherName || '',
            occupation: userData.motherOccupation || '',
            caste: userData.motherCaste || '',
            casteOther: userData.motherCasteOther || ''
          },
          spouse: {
            name: userData.spouseName || '',
            occupation: userData.spouseOccupation || ''
          }
        };
      } else if (userData.role.toLowerCase() === 'admin') {
        userDocument.adminInfo = {
          permissions: userData.permissions || ['manage_users', 'view_reports'],
          employeeId: userData.employeeId || userId,
          joinDate: userData.joinDate || new Date(),
          department: userData.department || 'Administration'
        };
        
        // Admin Personal Information with "Other" fields
        userDocument.personal = {
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender || 'male',
          bloodGroup: userData.bloodGroup || '',
          nationality: userData.nationality || 'Indian',
          religion: userData.religion || '',
          religionOther: userData.religionOther || '',
          caste: userData.caste || '',
          casteOther: userData.casteOther || '',
          category: userData.category || '',
          categoryOther: userData.categoryOther || '',
          motherTongue: userData.motherTongue || '',
          motherTongueOther: userData.motherTongueOther || '',
          aadhaar: userData.aadhaar || '',
          pan: userData.pan || '',
          
          // Disability information
          disability: userData.disability || 'Not Applicable',
          disabilityOther: userData.disabilityOther || ''
        };
      } else if (userData.role.toLowerCase() === 'parent') {
        userDocument.parentInfo = {
          children: userData.children || [],
          occupation: userData.occupation || '',
          relationToStudent: userData.relationToStudent || 'Parent'
        };
        
        // Parent Personal Information with "Other" fields
        userDocument.personal = {
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender || 'male',
          bloodGroup: userData.bloodGroup || '',
          nationality: userData.nationality || 'Indian',
          religion: userData.religion || '',
          religionOther: userData.religionOther || '',
          caste: userData.caste || '',
          casteOther: userData.casteOther || '',
          category: userData.category || '',
          categoryOther: userData.categoryOther || '',
          motherTongue: userData.motherTongue || '',
          motherTongueOther: userData.motherTongueOther || '',
          aadhaar: userData.aadhaar || '',
          
          // Disability information
          disability: userData.disability || 'Not Applicable',
          disabilityOther: userData.disabilityOther || ''
        };
      }
      
      // Insert user
      const result = await collection.insertOne(userDocument);
      
      console.log(`👤 Created ${userData.role} user: ${userId} (${userData.email})`);
      
      return {
        success: true,
        user: {
          _id: result.insertedId,
          userId,
          email: userData.email,
          role: userData.role,
          name: userDocument.name,
          schoolCode
        },
        credentials: {
          userId,
          email: userData.email,
          password: plainPassword, // Return plain password for initial communication
          loginUrl: `/login/${schoolCode.toLowerCase()}`
        }
      };
      
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Reset user password
   */
  static async resetUserPassword(schoolCode, userId) {
    try {
      const connection = await SchoolDatabaseManager.getSchoolConnection(schoolCode);
      
      // Find user in appropriate collection
      const collections = ['admins', 'teachers', 'students', 'parents'];
      let user = null;
      let userCollection = null;
      
      for (const collectionName of collections) {
        const collection = connection.collection(collectionName);
        
        // Build query - only use ObjectId if userId is a valid ObjectId format
        const query = { userId: userId };
        
        // Check if userId is a valid ObjectId format (24 character hex string)
        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
          query.$or = [
            { _id: new ObjectId(userId) },
            { userId: userId }
          ];
          delete query.userId;
        }
        
        user = await collection.findOne(query);
        if (user) {
          userCollection = collection;
          break;
        }
      }
      
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Generate new password
      const newPassword = this.generateRandomPassword();
      const hashedPassword = await this.hashPassword(newPassword);
      
      // Update user password
      // Build update query - only use ObjectId if userId is a valid ObjectId format
      const updateQuery = { userId: userId };
      
      // Check if userId is a valid ObjectId format (24 character hex string)
      if (/^[0-9a-fA-F]{24}$/.test(userId)) {
        updateQuery.$or = [
          { _id: new ObjectId(userId) },
          { userId: userId }
        ];
        delete updateQuery.userId;
      }
      
      await userCollection.updateOne(
        updateQuery,
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date(),
            loginAttempts: 0 // Reset login attempts
          }
        }
      );
      
      console.log(`🔑 Password reset for user: ${userId}`);
      
      return {
        success: true,
        credentials: {
          userId,
          email: user.email,
          password: newPassword,
          message: 'Password has been reset successfully'
        }
      };
      
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
  
  /**
   * Get user by ID or email from school database
   */
  static async getUserByIdOrEmail(schoolCode, identifier, includePassword = false) {
    try {
      const connection = await SchoolDatabaseManager.getSchoolConnection(schoolCode);
      const collections = ['admins', 'teachers', 'students', 'parents'];
      const raw = (identifier || '').toString().trim();
      const isObjectId = ObjectId.isValid(raw);
      const looksLikeEmail = raw.includes('@');
      const emailRegex = looksLikeEmail ? new RegExp(`^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') : null;
      
      for (const collectionName of collections) {
        const collection = connection.collection(collectionName);
        const orQueries = [];
        if (isObjectId) orQueries.push({ _id: new ObjectId(raw) });
        if (raw) orQueries.push({ userId: raw });
        if (looksLikeEmail) orQueries.push({ email: emailRegex }); // case-insensitive exact match
        const user = await collection.findOne(orQueries.length ? { $or: orQueries } : {});
        
        if (user) {
          // Determine role from collection name
          const roleMap = {
            'admins': 'admin',
            'teachers': 'teacher',
            'students': 'student',
            'parents': 'parent'
          };
          const role = roleMap[collectionName] || user.role;
          
          // Optionally remove password from return object
          if (includePassword) {
            const result = {
              ...user,
              collection: collectionName,
              role: role, // Explicitly set role
              userId: user.userId // Explicitly preserve userId
            };
            return result;
          } else {
            const { password, ...userWithoutPassword } = user;
            const result = {
              ...userWithoutPassword,
              collection: collectionName,
              role: role, // Explicitly set role
              userId: user.userId // Explicitly preserve userId
            };
            return result;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
  
  /**
   * Get all users from a school by role
   */
  static async getUsersByRole(schoolCode, role) {
    try {
      console.log(`🔍 Getting ${role}s from school_${schoolCode.toLowerCase()}`);
      
      const connection = await SchoolDatabaseManager.getSchoolConnection(schoolCode);
      const collectionMap = {
        'admin': 'admins',
        'teacher': 'teachers',
        'student': 'students', 
        'parent': 'parents'
      };
      
      const collectionName = collectionMap[role.toLowerCase()];
      if (!collectionName) {
        throw new Error(`Invalid role: ${role}`);
      }
      
      console.log(`📂 Accessing collection: ${collectionName} in school_${schoolCode.toLowerCase()}`);
      
      const collection = connection.collection(collectionName);
      const users = await collection.find(
        { _placeholder: { $ne: true } },
        { projection: { password: 0 } } // Exclude hashed password only, keep temporaryPassword
      ).toArray();
      
      console.log(`✅ Found ${users.length} ${role}s in ${collectionName} collection`);
      console.log(`🔑 Sample user fields:`, users.length > 0 ? Object.keys(users[0]) : 'No users');
      
      return users;
    } catch (error) {
      console.error(`❌ Error getting ${role}s from school_${schoolCode.toLowerCase()}:`, error);
      throw error;
    }
  }
  
  /**
   * Update user information
   */
  static async updateUser(schoolCode, userId, updateData) {
    try {
      const connection = await SchoolDatabaseManager.getSchoolConnection(schoolCode);
      const collections = ['admins', 'teachers', 'students', 'parents'];
      
      let userCollection = null;
      for (const collectionName of collections) {
        const collection = connection.collection(collectionName);
        // Try both _id and userId to cover different scenarios
        // Only try ObjectId if userId looks like a valid ObjectId (24 hex chars)
        const query = { userId: userId };
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
          query.$or = [
            { _id: new ObjectId(userId) },
            { userId: userId }
          ];
          delete query.userId;
        }
        
        const user = await collection.findOne(query);
        if (user) {
          userCollection = collection;
          break;
        }
      }
      
      if (!userCollection) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Get the user to determine role
      const updateQuery = { userId: userId };
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        updateQuery.$or = [
          { _id: new ObjectId(userId) },
          { userId: userId }
        ];
        delete updateQuery.userId;
      }
      
      const user = await userCollection.findOne(updateQuery);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Build proper update object with nested structures
      const updateFields = {};
      
      // Handle password update separately
      if (updateData.password && updateData.password.trim()) {
        updateFields.password = await this.hashPassword(updateData.password);
      }
      
      // Update basic name fields
      if (updateData.firstName || updateData.lastName || updateData.middleName) {
        if (updateData.firstName) updateFields['name.firstName'] = updateData.firstName.trim();
        if (updateData.lastName) updateFields['name.lastName'] = updateData.lastName.trim();
        if (updateData.middleName) updateFields['name.middleName'] = updateData.middleName.trim();
        const displayName = `${updateData.firstName || user.name?.firstName || ''} ${updateData.lastName || user.name?.lastName || ''}`.trim();
        if (displayName) updateFields['name.displayName'] = displayName;
      }
      
      // Update email
      if (updateData.email) updateFields.email = updateData.email.trim().toLowerCase();
      
      // Update contact fields
      if (updateData.primaryPhone !== undefined) updateFields['contact.primaryPhone'] = updateData.primaryPhone;
      if (updateData.secondaryPhone !== undefined) updateFields['contact.secondaryPhone'] = updateData.secondaryPhone;
      if (updateData.whatsappNumber !== undefined) updateFields['contact.whatsappNumber'] = updateData.whatsappNumber;
      
      // Update address fields - handle conversion from string to object if needed
      const hasAddressUpdates = updateData.permanentStreet !== undefined || updateData.permanentArea !== undefined || 
                                updateData.permanentCity !== undefined || updateData.permanentState !== undefined ||
                                updateData.permanentPincode !== undefined || updateData.permanentCountry !== undefined ||
                                updateData.permanentLandmark !== undefined || updateData.sameAsPermanent !== undefined ||
                                updateData.district !== undefined || updateData.taluka !== undefined;
      
      if (hasAddressUpdates) {
        // Check if current address is a string - if so, convert to object first
        if (typeof user.address === 'string') {
          // Convert string address to object structure
          updateFields['address'] = {
            permanent: {
              street: updateData.permanentStreet || user.address || '',
              area: updateData.permanentArea || '',
              city: updateData.permanentCity || '',
              state: updateData.permanentState || '',
              country: updateData.permanentCountry || 'India',
              pincode: updateData.permanentPincode || '',
              landmark: updateData.permanentLandmark || '',
              district: updateData.district || '',
              taluka: updateData.taluka || ''
            },
            current: null,
            sameAsPermanent: updateData.sameAsPermanent !== false
          };
        } else {
          // Address is already an object, update nested fields
          if (updateData.permanentStreet !== undefined) updateFields['address.permanent.street'] = updateData.permanentStreet;
          if (updateData.permanentArea !== undefined) updateFields['address.permanent.area'] = updateData.permanentArea;
          if (updateData.permanentCity !== undefined) updateFields['address.permanent.city'] = updateData.permanentCity;
          if (updateData.permanentState !== undefined) updateFields['address.permanent.state'] = updateData.permanentState;
          if (updateData.permanentPincode !== undefined) updateFields['address.permanent.pincode'] = updateData.permanentPincode;
          if (updateData.permanentCountry !== undefined) updateFields['address.permanent.country'] = updateData.permanentCountry;
          if (updateData.permanentLandmark !== undefined) updateFields['address.permanent.landmark'] = updateData.permanentLandmark;
          if (updateData.district !== undefined) updateFields['address.permanent.district'] = updateData.district;
          if (updateData.taluka !== undefined) updateFields['address.permanent.taluka'] = updateData.taluka;
          if (updateData.sameAsPermanent !== undefined) updateFields['address.sameAsPermanent'] = updateData.sameAsPermanent;
        }
      }
      
      // Update role-specific fields
      const rolePrefix = `${user.role}Details`;
      if (user.role === 'student') {
        // Academic fields
        if (updateData.currentClass !== undefined || updateData.class !== undefined) updateFields[`${rolePrefix}.currentClass`] = updateData.currentClass || updateData.class;
        if (updateData.currentSection !== undefined || updateData.section !== undefined) updateFields[`${rolePrefix}.currentSection`] = updateData.currentSection || updateData.section;
        if (updateData.rollNumber !== undefined) updateFields[`${rolePrefix}.rollNumber`] = updateData.rollNumber;
        if (updateData.admissionNumber !== undefined) updateFields[`${rolePrefix}.admissionNumber`] = updateData.admissionNumber;
        if (updateData.admissionDate !== undefined) updateFields[`${rolePrefix}.admissionDate`] = updateData.admissionDate ? new Date(updateData.admissionDate) : null;
        if (updateData.dateOfBirth !== undefined) updateFields[`${rolePrefix}.dateOfBirth`] = updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null;
        if (updateData.gender !== undefined) updateFields[`${rolePrefix}.gender`] = updateData.gender;
        
        // Family fields - only update if non-empty
        if (updateData.fatherName !== undefined && updateData.fatherName !== '') updateFields[`${rolePrefix}.fatherName`] = updateData.fatherName;
        if (updateData.fatherPhone !== undefined && updateData.fatherPhone !== '') updateFields[`${rolePrefix}.fatherPhone`] = updateData.fatherPhone;
        if (updateData.fatherEmail !== undefined && updateData.fatherEmail !== '') updateFields[`${rolePrefix}.fatherEmail`] = updateData.fatherEmail;
        if (updateData.fatherOccupation !== undefined && updateData.fatherOccupation !== '') updateFields[`${rolePrefix}.fatherOccupation`] = updateData.fatherOccupation;
        if (updateData.motherName !== undefined && updateData.motherName !== '') updateFields[`${rolePrefix}.motherName`] = updateData.motherName;
        if (updateData.motherPhone !== undefined && updateData.motherPhone !== '') updateFields[`${rolePrefix}.motherPhone`] = updateData.motherPhone;
        if (updateData.motherEmail !== undefined && updateData.motherEmail !== '') updateFields[`${rolePrefix}.motherEmail`] = updateData.motherEmail;
        if (updateData.motherOccupation !== undefined && updateData.motherOccupation !== '') updateFields[`${rolePrefix}.motherOccupation`] = updateData.motherOccupation;
        if (updateData.guardianName !== undefined && updateData.guardianName !== '') updateFields[`${rolePrefix}.guardianName`] = updateData.guardianName;
        const guardianRel = updateData.guardianRelation || updateData.guardianRelationship;
        if (guardianRel !== undefined && guardianRel !== '') updateFields[`${rolePrefix}.guardianRelationship`] = guardianRel;
        
        // Personal fields
        if (updateData.bloodGroup !== undefined) updateFields[`${rolePrefix}.bloodGroup`] = updateData.bloodGroup;
        if (updateData.nationality !== undefined) updateFields[`${rolePrefix}.nationality`] = updateData.nationality;
        if (updateData.religion !== undefined) updateFields[`${rolePrefix}.religion`] = updateData.religion;
        if (updateData.caste !== undefined || updateData.studentCaste !== undefined) updateFields[`${rolePrefix}.caste`] = updateData.caste || updateData.studentCaste;
        if (updateData.category !== undefined || updateData.socialCategory !== undefined) updateFields[`${rolePrefix}.category`] = updateData.category || updateData.socialCategory;
        
        // Banking fields
        if (updateData.bankName !== undefined) updateFields[`${rolePrefix}.bankName`] = updateData.bankName;
        if (updateData.bankAccountNo !== undefined || updateData.bankAccountNumber !== undefined) updateFields[`${rolePrefix}.bankAccountNo`] = updateData.bankAccountNo || updateData.bankAccountNumber;
        if (updateData.ifscCode !== undefined || updateData.bankIFSC !== undefined) updateFields[`${rolePrefix}.bankIFSC`] = updateData.ifscCode || updateData.bankIFSC;
        
        // Medical fields
        if (updateData.medicalConditions !== undefined) updateFields[`${rolePrefix}.medicalConditions`] = updateData.medicalConditions;
        if (updateData.allergies !== undefined) updateFields[`${rolePrefix}.allergies`] = updateData.allergies;
        if (updateData.specialNeeds !== undefined) updateFields[`${rolePrefix}.specialNeeds`] = updateData.specialNeeds;
        if (updateData.disability !== undefined) updateFields[`${rolePrefix}.disability`] = updateData.disability;
        if (updateData.isRTECandidate !== undefined) updateFields[`${rolePrefix}.isRTECandidate`] = updateData.isRTECandidate;
        
        // Mother tongue
        if (updateData.motherTongue !== undefined) updateFields[`${rolePrefix}.motherTongue`] = updateData.motherTongue;
        if (updateData.motherTongueOther !== undefined) updateFields[`${rolePrefix}.motherTongueOther`] = updateData.motherTongueOther;
        
        // Previous school
        if (updateData.previousSchoolName !== undefined) updateFields[`${rolePrefix}.previousSchoolName`] = updateData.previousSchoolName;
        if (updateData.tcNumber !== undefined) updateFields[`${rolePrefix}.tcNumber`] = updateData.tcNumber;
      } else if (user.role === 'teacher') {
        if (updateData.qualification !== undefined) updateFields[`${rolePrefix}.qualification`] = updateData.qualification;
        if (updateData.experience !== undefined) updateFields[`${rolePrefix}.experience`] = updateData.experience;
        if (updateData.subjects !== undefined && Array.isArray(updateData.subjects)) {
          updateFields[`${rolePrefix}.subjects`] = updateData.subjects.map(s => String(s).trim()).filter(Boolean);
        }
      }
      
      updateFields.updatedAt = new Date();
      
      console.log(`📝 Updating user ${userId} with fields:`, Object.keys(updateFields));
      
      const result = await userCollection.updateOne(
        updateQuery,
        { $set: updateFields }
      );
      
      if (result.modifiedCount === 0) {
        throw new Error('No changes made to user');
      }
      
      console.log(`📝 Updated user: ${userId}`);
      return { success: true, message: 'User updated successfully' };
      
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

module.exports = UserGenerator;
