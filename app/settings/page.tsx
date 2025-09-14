'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Save, User, Bell, Shield, CreditCard, Key, Trash2, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  subscription: 'pro',
  creditsUsed: 75,
  creditsLimit: 100,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    company: '',
    phone: '',
    timezone: 'America/New_York',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    creditAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API',
      key: 'cf_live_...1234',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      active: true,
    },
    {
      id: '2',
      name: 'Development API',
      key: 'cf_test_...5678',
      created: '2024-01-10',
      lastUsed: '2024-01-18',
      active: true,
    },
  ]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'api', name: 'API Keys', icon: Key },
  ];

  const handleProfileSave = async () => {
    setLoading(true);
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password updated successfully!');
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Notification settings updated!');
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `cf_live_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      active: true,
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleRevokeApiKey = (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Profile Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    placeholder="Optional"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="Optional"
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                    className="input"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="btn-primary mt-6 flex items-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            {/* Change Password */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Change Password</h3>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="border-t border-secondary-200 pt-8">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Two-Factor Authentication</h3>
              <p className="text-secondary-600 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className="btn-secondary">
                Enable 2FA
              </button>
            </div>

            {/* Delete Account */}
            <div className="border-t border-secondary-200 pt-8">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Email Notifications</h4>
                    <p className="text-sm text-secondary-600">Receive important updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Credit Alerts</h4>
                    <p className="text-sm text-secondary-600">Get notified when credits are running low</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.creditAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        creditAlerts: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Weekly Reports</h4>
                    <p className="text-sm text-secondary-600">Receive weekly activity summaries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        weeklyReports: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Marketing Emails</h4>
                    <p className="text-sm text-secondary-600">Product updates and tips</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        marketingEmails: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleNotificationSave}
                disabled={loading}
                className="btn-primary mt-6 flex items-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                Save Preferences
              </button>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-8">
            {/* Current Plan */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Current Plan</h3>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-primary-900 capitalize">
                      {mockUser.subscription} Plan
                    </h4>
                    <p className="text-primary-700">
                      {mockUser.creditsUsed} of {mockUser.creditsLimit} credits used this month
                    </p>
                  </div>
                  <button className="btn-primary">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Usage Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-secondary-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary-900">156</div>
                  <div className="text-sm text-secondary-600">Total Searches</div>
                </div>
                <div className="bg-white border border-secondary-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary-900">89</div>
                  <div className="text-sm text-secondary-600">Saved Businesses</div>
                </div>
                <div className="bg-white border border-secondary-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary-900">267</div>
                  <div className="text-sm text-secondary-600">Contacts Found</div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Billing History</h3>
              <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        Jan 1, 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        $29.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        <button className="hover:text-primary-700">Download</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-secondary-900">API Keys</h3>
                <p className="text-secondary-600">Manage your API keys for integrations</p>
              </div>
              <button
                onClick={handleGenerateApiKey}
                className="btn-primary flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Generate New Key
              </button>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-secondary-900">{apiKey.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <code className="text-sm bg-secondary-100 px-2 py-1 rounded">
                          {apiKey.key}
                        </code>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          apiKey.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.active ? 'Active' : 'Revoked'}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 mt-1">
                        Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevokeApiKey(apiKey.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Revoke API Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {apiKeys.length === 0 && (
              <div className="text-center py-8 text-secondary-500">
                No API keys generated yet. Create one to get started with our API.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-secondary-900 mb-8">Settings</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}