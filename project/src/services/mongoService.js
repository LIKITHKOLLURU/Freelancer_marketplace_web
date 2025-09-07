import axios from 'axios';

const MONGODB_DATA_API_URL = 'https://data.mongodb-api.com/app/data-uqnqy/endpoint/data/v1';
const API_KEY = 'your-mongodb-data-api-key'; // You'll need to generate this from MongoDB Atlas

class MongoService {
  constructor() {
    this.baseURL = MONGODB_DATA_API_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'api-key': API_KEY
    };
    this.dataSource = 'Cluster0';
    this.database = 'freelance_marketplace';
  }

  async findMany(collection, filter = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/action/find`, {
        dataSource: this.dataSource,
        database: this.database,
        collection: collection,
        filter: filter
      }, { headers: this.headers });
      
      return response.data.documents;
    } catch (error) {
      console.error('MongoDB find error:', error);
      throw error;
    }
  }

  async findOne(collection, filter) {
    try {
      const response = await axios.post(`${this.baseURL}/action/findOne`, {
        dataSource: this.dataSource,
        database: this.database,
        collection: collection,
        filter: filter
      }, { headers: this.headers });
      
      return response.data.document;
    } catch (error) {
      console.error('MongoDB findOne error:', error);
      throw error;
    }
  }

  async insertOne(collection, document) {
    try {
      const response = await axios.post(`${this.baseURL}/action/insertOne`, {
        dataSource: this.dataSource,
        database: this.database,
        collection: collection,
        document: document
      }, { headers: this.headers });
      
      return response.data;
    } catch (error) {
      console.error('MongoDB insert error:', error);
      throw error;
    }
  }

  async updateOne(collection, filter, update) {
    try {
      const response = await axios.post(`${this.baseURL}/action/updateOne`, {
        dataSource: this.dataSource,
        database: this.database,
        collection: collection,
        filter: filter,
        update: update
      }, { headers: this.headers });
      
      return response.data;
    } catch (error) {
      console.error('MongoDB update error:', error);
      throw error;
    }
  }

  async deleteOne(collection, filter) {
    try {
      const response = await axios.post(`${this.baseURL}/action/deleteOne`, {
        dataSource: this.dataSource,
        database: this.database,
        collection: collection,
        filter: filter
      }, { headers: this.headers });
      
      return response.data;
    } catch (error) {
      console.error('MongoDB delete error:', error);
      throw error;
    }
  }

  // User-specific methods
  async createUser(userData) {
    return await this.insertOne('users', {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async findUserByEmail(email) {
    return await this.findOne('users', { email });
  }

  async findUserById(id) {
    return await this.findOne('users', { _id: { $oid: id } });
  }

  // Job-specific methods
  async createJob(jobData) {
    return await this.insertOne('jobs', {
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    });
  }

  async getAllJobs() {
    return await this.findMany('jobs', { status: 'active' });
  }

  async getJobsByCategory(category) {
    return await this.findMany('jobs', { category, status: 'active' });
  }

  // Application-specific methods
  async createApplication(applicationData) {
    return await this.insertOne('applications', {
      ...applicationData,
      createdAt: new Date(),
      status: 'pending'
    });
  }

  async getApplicationsByUserId(userId) {
    return await this.findMany('applications', { userId });
  }

  // Notification-specific methods
  async createNotification(notificationData) {
    return await this.insertOne('notifications', {
      ...notificationData,
      createdAt: new Date(),
      read: false
    });
  }

  async getNotificationsByUserId(userId) {
    return await this.findMany('notifications', { userId });
  }
}

export default new MongoService();
