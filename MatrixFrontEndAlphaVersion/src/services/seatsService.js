import axios from 'axios';
import { API_URL } from '../api/config';

// Singleton service to prevent multiple simultaneous seat data requests
class SeatsService {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.pendingRequest = null;
    this.listeners = new Set();
    this.pollInterval = null;
    this.MIN_POLL_INTERVAL = 30000; // 30 seconds
    this.MAX_POLL_INTERVAL = 300000; // 5 minutes
    this.currentPollDelay = this.MIN_POLL_INTERVAL;
    this.CACHE_TTL = 5000; // 5 seconds cache
    this.REQUEST_TIMEOUT = 5000;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    
    // Immediately send cached data if available
    if (this.cache && Date.now() - this.cacheTime < this.CACHE_TTL) {
      callback({ data: this.cache, loading: false, error: null });
    }

    // Start polling if this is the first subscriber
    if (this.listeners.size === 1) {
      this.startPolling();
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      // Stop polling if no more subscribers
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  notify(data) {
    this.listeners.forEach(callback => callback(data));
  }

  async fetchSeats() {
    // Return cached data if still fresh
    if (this.cache && Date.now() - this.cacheTime < this.CACHE_TTL) {
      return { data: this.cache, loading: false, error: null };
    }

    // If a request is already in progress, wait for it
    if (this.pendingRequest) {
      return this.pendingRequest;
    }

    // Notify subscribers that loading started
    this.notify({ data: this.cache, loading: true, error: null });

    this.pendingRequest = axios
      .get(`${API_URL}/activity-logs/seats`, { timeout: this.REQUEST_TIMEOUT })
      .then(response => {
        const apiSections = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        this.cache = apiSections;
        this.cacheTime = Date.now();
        this.currentPollDelay = this.MIN_POLL_INTERVAL; // Reset on success
        
        const result = { data: apiSections, loading: false, error: null };
        this.notify(result);
        return result;
      })
      .catch(err => {
        const error = err?.response?.data?.message || err?.message || 'Failed to fetch seat data';
        
        // Implement exponential backoff on 429
        if (err?.response?.status === 429) {
          this.currentPollDelay = Math.min(this.MAX_POLL_INTERVAL, this.currentPollDelay * 2);
        } else {
          this.currentPollDelay = this.MIN_POLL_INTERVAL;
        }
        
        const result = { data: this.cache, loading: false, error };
        this.notify(result);
        return result;
      })
      .finally(() => {
        this.pendingRequest = null;
      });

    return this.pendingRequest;
  }

  startPolling() {
    if (this.pollInterval) return;

    const poll = async () => {
      if (document.visibilityState === 'visible') {
        await this.fetchSeats();
      }
      
      this.pollInterval = setTimeout(poll, this.currentPollDelay);
    };

    // Stagger initial fetch by 2 seconds to avoid simultaneous requests on page load
    setTimeout(() => {
      this.fetchSeats();
      // Start polling after initial fetch
      this.pollInterval = setTimeout(poll, this.currentPollDelay);
    }, 2000);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearTimeout(this.pollInterval);
      this.pollInterval = null;
    }
  }
}

// Export singleton instance
const seatsServiceInstance = new SeatsService();
export default seatsServiceInstance;
