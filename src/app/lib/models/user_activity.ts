import joi from "joi";

enum ActivityType {
  Login = "login",
  Logout = "logout",

  // CRUD operations
  PageView = "pageView",
  ContentCreated = "contentCreated",
  ContentUpdated = "contentUpdated",
  ContentDeleted = "contentDeleted",

  // File operations
  FileUploaded = "fileUploaded",
  FileDownloaded = "fileDownloaded",
  FileDeleted = "fileDeleted",

  // User management
  ProfileUpdated = "profileUpdated",
  SettingsUpdated = "settingsUpdated",
  AccessLevelChanged = "accessLevelUpdated",
  UserDeleted = "userDeleted",

  // Admin operations
  AdminAction = "adminAction",
}

// Joi schema for validating the UserActivity object
const userActivitySchema = joi.object({
  id: joi.number().required(),
  userId: joi.number().required(),
  activityType: joi
    .string()
    .valid(...Object.values(ActivityType))
    .required(),
  activityDetails: joi.string().required(),
  timestamp: joi.date().default(new Date()),
});

class UserActivity {
  id: number;
  userId: number; // Foreign key referencing the KddUser.id
  activityType: ActivityType;
  activityDetails: string; // Additional details about the activity (e.g., IP address, etc.)
  timestamp: Date;

  constructor(data: any) {
    // Validates the data against the Joi schema, values is the validated data
    const { error, value } = userActivitySchema.validate(data);

    // IF there is an error, throw an error with the message
    if (error) {
      throw new Error(`UserActivity validation error: ${error.message}`);
    }

    this.id = value.id;
    this.userId = value.userId;
    this.activityType = value.activityType;
    this.activityDetails = value.activityDetails;
    this.timestamp = value.timestamp ? value.timestamp : new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      activityType: this.activityType,
      activityDetails: this.activityDetails,
      timestamp: this.timestamp,
    };
  }

  toString() {
    return `${this.timestamp.toISOString()} - ${this.activityType}: ${this.activityDetails} by user ${this.userId}`
  }
}

export { ActivityType, UserActivity };
