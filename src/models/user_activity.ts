import joi from "joi";
import { pgTable, integer, varchar, text, date, serial } from 'drizzle-orm/pg-core';


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
  endpoint: joi.string().required(),
  detected_ip: joi.string().required(),
  status: joi.number().required(),
  activityDetails: joi.string().required(),
  timestamp: joi.date().default(new Date()),
});

class UserActivity {
  id: number;
  userId: number; // Foreign key referencing the KddUser.id
  activityType: ActivityType;
  endpoint: string; // The endpoint that the activity was performed on
  detected_ip: string; // The IP address that the activity was detected from
  status: number; // The status code of the activity
  activityDetails: string; // Additional details about the activity
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
    this.endpoint = value.endpoint;
    this.detected_ip = value.detected_ip;
    this.status = value.status;
    this.activityDetails = value.activityDetails;
    this.timestamp = value.timestamp ? value.timestamp : new Date();
  }

  // extra constructors
  static viewedPage(userId: number, status: number, detected_ip: string, endpoint: string, page: string) {
    return new UserActivity({
      id: -1,
      userId: userId,
      status: status,
      activityType: ActivityType.PageView,
      endpoint: endpoint,
      detected_ip: detected_ip,
      activityDetails: `Viewed page: ${page}`,
    });
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      activityType: this.activityType,
      endpoint: this.endpoint,
      detected_ip: this.detected_ip,
      activityDetails: this.activityDetails,
      timestamp: this.timestamp,
    };
  }

  toString() {
    return `${this.timestamp.toISOString()} - ${this.status} - ${this.endpoint} - ${this.activityType}: "${this.activityDetails}" by user ${this.userId} from IP ${this.detected_ip}`
  }
}

export { ActivityType, UserActivity };
