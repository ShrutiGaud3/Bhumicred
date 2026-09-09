import { api } from '../../../services/api.js';

export const projectService = {
  /**
   * Fetch all sustainability and agroforestry projects with filters
   */
  async getProjects(params = {}) {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  /**
   * Fetch single project details by ID or slug
   */
  async getProjectById(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Enroll a farmer's registered land into a project
   */
  async enrollLand(projectId, landId) {
    const response = await api.post(`/projects/${projectId}/enroll`, { landId });
    return response.data;
  },

  /**
   * Create a new project (Admin / Government / Partner)
   */
  async createProject(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  /**
   * Update project details
   */
  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  /**
   * Update milestone completion status
   */
  async updateMilestone(projectId, milestoneIndex, milestoneData) {
    const response = await api.patch(`/projects/${projectId}/milestones/${milestoneIndex}`, milestoneData);
    return response.data;
  },

  /**
   * Fetch project statistics & metrics
   */
  async getStats() {
    const response = await api.get('/projects/stats');
    return response.data;
  },
};

export default projectService;
