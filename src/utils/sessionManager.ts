interface UserSession {
  phoneNumber: string;
  isVerified: boolean;
  lastLogin: string;
  transactions?: Array<{
    id: string;
    date: string;
    merchantName: string;
    amount: number;
    status: "completed" | "pending" | "failed";
  }>;
}

const SESSION_KEY = "scanmiter_session";

export const sessionManager = {
  saveSession(userData: UserSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  },

  getSession(): UserSession | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  updateSession(updates: Partial<UserSession>) {
    const currentSession = this.getSession();
    if (currentSession) {
      this.saveSession({ ...currentSession, ...updates });
    }
  },
};
