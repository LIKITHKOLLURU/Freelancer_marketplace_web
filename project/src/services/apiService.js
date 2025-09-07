// Enhanced API service for Freelancer Marketplace with bidding system
import axios from 'axios';

// Prefer environment variables (Vite) for dynamic Data API config, fallback to previous URL
const DEFAULT_DATA_API_URL = 'https://data.mongodb-api.com/app/data-uqnqy/endpoint/data/v1';

class APIService {
  constructor() {
    // Optional backend base URL (Express). When present, prefer backend over Data API.
    this.apiBase = import.meta.env?.VITE_API_BASE_URL || '';
    // Load from env first
    const envUrl = import.meta.env?.VITE_DATA_API_URL || DEFAULT_DATA_API_URL;
    const envKey = import.meta.env?.VITE_DATA_API_KEY || '';
    const envSource = import.meta.env?.VITE_DATA_SOURCE || 'Cluster0';
    const envDb = import.meta.env?.VITE_DB_NAME || 'freelance_marketplace';

    // Attempt to override from localStorage if present (no repo secrets)
    const lsConfig = this.getDataApiConfigFromStorage();

    this.baseURL = lsConfig?.url || envUrl;
    this.apiKey = lsConfig?.key || envKey;
    this.dataSource = lsConfig?.source || envSource;
    this.database = lsConfig?.db || envDb;

    // Mode selection
    this.useBackend = !!this.apiBase; // highest priority when set
    this.useMockData = !this.useBackend && !(this.baseURL && this.apiKey);
  }

  async deleteJob(jobId) {
    if (this.useBackend) {
      const id = (jobId && jobId.toString) ? jobId.toString() : String(jobId);
      const { data } = await axios.delete(`${this.apiBase}/jobs/${id}`);
      return data;
    }
    if (this.useMockData) {
      return { success: true };
    }
  }

  // LocalStorage config helpers (safe in browser only)
  getDataApiConfigFromStorage() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('data_api_config') : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveDataApiConfigToStorage({ url, key, source, db }) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('data_api_config', JSON.stringify({ url, key, source, db }));
      }
      // Reinitialize in-memory config for current session
      this.baseURL = url || this.baseURL;
      this.apiKey = key || this.apiKey;
      this.dataSource = source || this.dataSource;
      this.database = db || this.database;
      this.useMockData = !(this.baseURL && this.apiKey);
      return true;
    } catch {
      return false;
    }
  }

  // Generic Data API caller
  async dataApi(action, payload) {
    const url = `${this.baseURL}/action/${action}`;
    const body = {
      dataSource: this.dataSource,
      database: this.database,
      ...payload,
    };
    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    };
    const { data } = await axios.post(url, body, { headers });
    return data;
  }

  normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  // Mock data for development
  getMockUsers() {
    return [
      {
        _id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'freelancer',
        bio: 'Experienced web developer with 5+ years in full-stack development',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
        completedProjects: 15,
        createdAt: new Date('2024-01-01')
      },
      {
        _id: '2',
        username: 'jane_smith',
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'admin',
        bio: 'Tech startup founder looking for talented developers',
        skills: ['Project Management', 'Marketing'],
        completedProjects: 0,
        createdAt: new Date('2024-01-15')
      },
      {
        _id: '3',
        username: 'alex_dev',
        email: 'alex@example.com',
        name: 'Alex Rodriguez',
        role: 'freelancer',
        bio: 'UI/UX Designer specializing in modern web interfaces',
        skills: ['Figma', 'Adobe XD', 'CSS', 'JavaScript'],
        completedProjects: 23,
        createdAt: new Date('2024-01-10')
      },
      {
        _id: '4',
        username: 'sarah_pm',
        email: 'sarah@example.com',
        name: 'Sarah Wilson',
        role: 'admin',
        bio: 'Project Manager at enterprise software company',
        skills: ['Agile', 'Scrum', 'Team Leadership'],
        completedProjects: 0,
        createdAt: new Date('2024-01-20')
      }
    ];
  }

  // Helpers for mock user persistence
  getStoredUsers() {
    try {
      const raw = localStorage.getItem('mock_users');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  saveStoredUsers(users) {
    try {
      localStorage.setItem('mock_users', JSON.stringify(users));
    } catch (e) {
      // noop for environments without storage
    }
  }

  getAllMockUsers() {
    // Merge seeded users with any registered (stored) users
    const seeded = this.getMockUsers();
    const stored = this.getStoredUsers();
    // Avoid duplicate emails; stored should override if same email
    const map = new Map();
    [...seeded, ...stored].forEach(u => map.set(u.email, u));
    return Array.from(map.values());
  }

  getMockJobs() {
    return [
      {
        _id: '1',
        title: 'React Developer Needed',
        description: 'Looking for an experienced React developer to build a modern web application with advanced features.',
        budget: '$1000-2000',
        duration: '1-3-months',
        skills: 'React, JavaScript, CSS',
        category: 'development',
        experienceLevel: 'intermediate',
        projectType: 'fixed',
        adminId: '2',
        adminName: 'Jane Smith',
        status: 'active',
        applicationsCount: 3,
        createdAt: new Date('2024-01-20')
      },
      {
        _id: '2',
        title: 'UI/UX Designer Required',
        description: 'Need a creative designer for mobile app interface design with modern aesthetics.',
        budget: '$800-1500',
        duration: '1-3-months',
        skills: 'Figma, Adobe XD, UI Design',
        category: 'design',
        experienceLevel: 'intermediate',
        projectType: 'fixed',
        adminId: '4',
        adminName: 'Sarah Wilson',
        status: 'active',
        applicationsCount: 5,
        createdAt: new Date('2024-01-22')
      },
      {
        _id: '3',
        title: 'Full-Stack E-commerce Platform',
        description: 'Build a complete e-commerce solution with payment integration and admin dashboard.',
        budget: '$3000-5000',
        duration: '3-6-months',
        skills: 'React, Node.js, MongoDB, Stripe',
        category: 'development',
        experienceLevel: 'expert',
        projectType: 'fixed',
        adminId: '2',
        adminName: 'Jane Smith',
        status: 'active',
        applicationsCount: 2,
        createdAt: new Date('2024-01-25')
      }
    ];
  }

  getMockApplications() {
    return [
      {
        _id: '1',
        jobId: '1',
        jobTitle: 'React Developer Needed',
        freelancerId: '1',
        freelancerName: 'John Doe',
        proposedPrice: 1500,
        proposal: 'I have 5+ years of React experience and can deliver this project within the timeline.',
        status: 'pending',
        appliedAt: new Date('2024-01-21'),
        bids: [
          { adminId: '2', adminName: 'Jane Smith', amount: 1600, createdAt: new Date('2024-01-22') }
        ]
      },
      {
        _id: '2',
        jobId: '2',
        jobTitle: 'UI/UX Designer Required',
        freelancerId: '3',
        freelancerName: 'Alex Rodriguez',
        proposedPrice: 1200,
        proposal: 'I specialize in modern UI/UX design with extensive Figma experience.',
        status: 'accepted',
        appliedAt: new Date('2024-01-23'),
        bids: [
          { adminId: '4', adminName: 'Sarah Wilson', amount: 1300, createdAt: new Date('2024-01-24') }
        ]
      },
      {
        _id: '3',
        jobId: '1',
        jobTitle: 'React Developer Needed',
        freelancerId: '3',
        freelancerName: 'Alex Rodriguez',
        proposedPrice: 1400,
        proposal: 'I can handle both frontend and basic backend requirements.',
        status: 'bidding',
        appliedAt: new Date('2024-01-22'),
        bids: [
          { adminId: '2', adminName: 'Jane Smith', amount: 1500, createdAt: new Date('2024-01-23') },
          { adminId: '4', adminName: 'Sarah Wilson', amount: 1550, createdAt: new Date('2024-01-24') }
        ]
      }
    ];
  }

  getMockNotifications() {
    return [
      {
        _id: '1',
        userId: '1',
        message: 'Jane Smith placed a bid of $1600 on your React Developer application',
        type: 'bid_received',
        read: false,
        createdAt: new Date('2024-01-25')
      },
      {
        _id: '2',
        userId: '1',
        message: 'New job matching your skills: Full-Stack E-commerce Platform',
        type: 'job_match',
        read: false,
        createdAt: new Date('2024-01-24')
      },
      {
        _id: '3',
        userId: '3',
        message: 'Sarah Wilson placed a competing bid of $1550 on React Developer job',
        type: 'competing_bid',
        read: false,
        createdAt: new Date('2024-01-24')
      },
      {
        _id: '4',
        userId: '2',
        message: 'John Doe applied for your React Developer job',
        type: 'new_application',
        read: false,
        createdAt: new Date('2024-01-21')
      }
    ];
  }

  // New methods for bidding system and leaderboard
  getMockBids() {
    return [
      {
        _id: '1',
        applicationId: '1',
        jobId: '1',
        freelancerId: '1',
        adminId: '2',
        amount: 1600,
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        _id: '2',
        applicationId: '3',
        jobId: '1',
        freelancerId: '3',
        adminId: '2',
        amount: 1500,
        status: 'outbid',
        createdAt: new Date('2024-01-23')
      },
      {
        _id: '3',
        applicationId: '3',
        jobId: '1',
        freelancerId: '3',
        adminId: '4',
        amount: 1550,
        status: 'active',
        createdAt: new Date('2024-01-24')
      }
    ];
  }

  getMockLeaderboard() {
    const users = this.getMockUsers();
    return users
      .filter(user => user.role === 'freelancer')
      .sort((a, b) => b.completedProjects - a.completedProjects)
      .map((user, index) => ({
        rank: index + 1,
        _id: user._id,
        name: user.name,
        username: user.username,
        completedProjects: user.completedProjects,
        skills: user.skills
      }));
  }

  // User methods
  async loginUser(email, password) {
    if (this.useBackend) {
      const { data } = await axios.post(`${this.apiBase}/auth/login`, { email, password });
      if (!data?.success) throw new Error(data?.message || 'Login failed');
      return data;
    }
    if (this.useMockData) {
      const users = this.getAllMockUsers();
      const norm = this.normalizeEmail(email);
      const user = users.find(u => this.normalizeEmail(u.email) === norm);
      if (!user) throw new Error('Invalid credentials');

      // For seeded users (no password saved), allow any password
      if (!user.password) {
        return { success: true, user };
      }

      // For registered users, validate password
      if (user.password && user.password === password) {
        return { success: true, user };
      }
      throw new Error('Invalid credentials');
    }
    // Dynamic via MongoDB Data API (no backend)
    const norm = this.normalizeEmail(email);
    // findOne by email
    const res = await this.dataApi('findOne', {
      collection: 'users',
      filter: { email: norm },
    });
    const user = res?.document;
    if (!user) throw new Error('Invalid credentials');
    if (user.password && user.password === password) {
      return { success: true, user };
    }
    throw new Error('Invalid credentials');
  }

  async registerUser(userData) {
    if (this.useBackend) {
      const { data } = await axios.post(`${this.apiBase}/auth/register`, userData);
      if (!data?.success) throw new Error(data?.message || 'Register failed');
      return data;
    }
    if (this.useMockData) {
      const newUser = {
        _id: Date.now().toString(),
        ...userData,
        email: this.normalizeEmail(userData.email),
        createdAt: new Date()
      };
      // Persist to localStorage so user can log in later
      const users = this.getStoredUsers();
      // Prevent duplicate email registrations
      const exists = users.some(u => this.normalizeEmail(u.email) === newUser.email);
      if (!exists) {
        users.push(newUser);
        this.saveStoredUsers(users);
      }
      return { success: true, user: newUser };
    }
    // Dynamic via MongoDB Data API (no backend)
    const email = this.normalizeEmail(userData.email);
    // Check duplicate
    const existing = await this.dataApi('findOne', {
      collection: 'users',
      filter: { email },
    });
    if (existing?.document) {
      return { success: true, user: existing.document };
    }
    const newUser = {
      name: userData.name,
      email,
      password: userData.password, // Note: for production, hash the password server-side
      role: userData.role,
      createdAt: new Date().toISOString(),
      completedProjects: userData.completedProjects ?? 0,
      skills: userData.skills ?? [],
    };
    const insertRes = await this.dataApi('insertOne', {
      collection: 'users',
      document: newUser,
    });
    const insertedId = insertRes?.insertedId;
    return { success: true, user: { _id: insertedId, ...newUser } };
  }

  async getUserById(id) {
    if (this.useBackend) {
      const { data } = await axios.get(`${this.apiBase}/auth/users/${id}`);
      if (!data?.success) return null;
      return data.user;
    }
    if (this.useMockData) {
      const users = this.getAllMockUsers();
      return users.find(u => u._id === id);
    }
    // Dynamic via MongoDB Data API (no backend)
    // Try ObjectId match; if not valid ObjectId, fallback by email (unlikely for this method)
    const isObjectId = typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
    const filter = isObjectId ? { _id: { $oid: id } } : { _id: id };
    const res = await this.dataApi('findOne', {
      collection: 'users',
      filter,
    });
    return res?.document || null;
  }

  // Job methods
  async getAllJobs() {
    if (this.useBackend) {
      const { data } = await axios.get(`${this.apiBase}/jobs`);
      if (!data?.success) return [];
      return Array.isArray(data.jobs) ? data.jobs : [];
    }
    // Fallback to mock for now (Data API not implemented for jobs)
    return this.getMockJobs();
  }

  async createJob(jobData) {
    if (this.useBackend) {
      // Backend accepts either adminId/adminName or clientId/clientName
      const payload = {
        ...jobData,
        adminId: jobData.adminId || jobData.clientId,
        adminName: jobData.adminName || jobData.clientName,
      };
      const { data } = await axios.post(`${this.apiBase}/jobs`, payload);
      return data;
    }
    // Fallback mock creation
    const newJob = {
      _id: Date.now().toString(),
      ...jobData,
      adminId: jobData.adminId || jobData.clientId,
      adminName: jobData.adminName || jobData.clientName,
      status: 'active',
      applicationsCount: 0,
      createdAt: new Date()
    };
    return { success: true, job: newJob };
  }

  async getJobsByCategory(category) {
    if (this.useMockData) {
      const jobs = this.getMockJobs();
      return jobs.filter(job => job.category === category);
    }
    // MongoDB implementation would go here
  }

  // Application methods
  async getApplicationsByUserId(userId) {
    if (this.useBackend) {
      const { data } = await axios.get(`${this.apiBase}/applications`, { params: { userId } });
      if (!data?.success) return [];
      return Array.isArray(data.applications) ? data.applications : [];
    }
    if (this.useMockData) {
      const applications = this.getMockApplications();
      return applications.filter(app => app.freelancerId === userId);
    }
    // Backend/Data API not implemented yet for applications; return safe default
    return [];
  }

  async getApplicationsByJobId(jobId) {
    if (this.useBackend) {
      const { data } = await axios.get(`${this.apiBase}/applications`, { params: { jobId } });
      if (!data?.success) return [];
      return Array.isArray(data.applications) ? data.applications : [];
    }
    if (this.useMockData) {
      const applications = this.getMockApplications();
      return applications.filter(app => app.jobId === jobId);
    }
    // MongoDB implementation would go here
  }

  async createApplication(applicationData) {
    if (this.useBackend) {
      const { data } = await axios.post(`${this.apiBase}/applications`, applicationData);
      return data;
    }
    if (this.useMockData) {
      const newApplication = {
        _id: Date.now().toString(),
        ...applicationData,
        status: 'pending',
        appliedAt: new Date(),
        bids: []
      };
      return { success: true, application: newApplication };
    }
    // MongoDB implementation would go here
  }

  async acceptApplication(applicationId) {
    if (this.useBackend) {
      const { data } = await axios.patch(`${this.apiBase}/applications/${applicationId}/accept`);
      return data;
    }
    if (this.useMockData) {
      return { success: true };
    }
  }

  async acceptBid(applicationId, bidId) {
    if (this.useBackend) {
      const { data } = await axios.patch(`${this.apiBase}/bids/${bidId}/accept`);
      return data;
    }
    if (this.useMockData) {
      return { success: true, message: 'Bid accepted successfully' };
    }
    // MongoDB implementation would go here
  }

  // Bidding methods
  async placeBid(bidData) {
    if (this.useBackend) {
      const { data } = await axios.post(`${this.apiBase}/bids`, bidData);
      return data;
    }
    if (this.useMockData) {
      const newBid = {
        _id: Date.now().toString(),
        ...bidData,
        status: 'active',
        createdAt: new Date()
      };
      return { success: true, bid: newBid };
    }
    // MongoDB implementation would go here
  }

  async getBidsByApplicationId(applicationId) {
    if (this.useBackend) {
      const { data } = await axios.get(`${this.apiBase}/bids`, { params: { applicationId } });
      if (!data?.success) return [];
      return Array.isArray(data.bids) ? data.bids : [];
    }
    if (this.useMockData) {
      const bids = this.getMockBids();
      return bids.filter(bid => bid.applicationId === applicationId);
    }
    // MongoDB implementation would go here
  }

  async getBidsByAdminId(adminId) {
    if (this.useBackend) {
      const { data } = await axios.get(`${this.apiBase}/bids`, { params: { adminId } });
      if (!data?.success) return [];
      return Array.isArray(data.bids) ? data.bids : [];
    }
    if (this.useMockData) {
      const bids = this.getMockBids();
      return bids.filter(bid => bid.adminId === adminId);
    }
    // MongoDB implementation would go here
  }

  // Notification methods
  async getNotificationsByUserId(userId) {
    if (this.useMockData) {
      const notifications = this.getMockNotifications();
      return notifications.filter(notif => notif.userId === userId);
    }
    // Backend/Data API not implemented yet for notifications; return safe default
    return [];
  }

  async createNotification(notificationData) {
    if (this.useMockData) {
      const newNotification = {
        _id: Date.now().toString(),
        ...notificationData,
        read: false,
        createdAt: new Date()
      };
      return { success: true, notification: newNotification };
    }
    // MongoDB implementation would go here
  }

  // Earnings methods
  async getEarningsByUserId(userId) {
    if (this.useMockData) {
      // Mock earnings calculation
      const applications = this.getMockApplications();
      const acceptedApps = applications.filter(app => app.freelancerId === userId && app.status === 'accepted');
      return { total: acceptedApps.length * 15000 }; // Mock calculation
    }
    // Backend/Data API not implemented yet for earnings; return safe default
    return { total: 0 };
  }

  // Project completion methods
  async markProjectComplete(applicationId, freelancerId) {
    if (this.useMockData) {
      // Update user's completed projects count
      const users = this.getMockUsers();
      const userIndex = users.findIndex(u => u._id === freelancerId);
      if (userIndex !== -1) {
        users[userIndex].completedProjects += 1;
      }
      return { success: true, message: 'Project marked as complete' };
    }
    // MongoDB implementation would go here
  }

  // Leaderboard methods
  async getLeaderboard() {
    if (this.useMockData) {
      return this.getMockLeaderboard();
    }
    // MongoDB implementation would go here
  }
}

export default new APIService();
