import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import MobileLogo from '../../src/components/Logo';
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
];

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Aarav Sharma',
    email: 'user@explorebharat.local',
    role: 'USER',
    phone: '+91 98765 43210',
    preferredLanguage: 'en',
    travelerType: 'Cultural & Heritage Explorer',
    savedPlacesCount: 12,
    tripsCompleted: 4,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSync, setOfflineSync] = useState(false);

  const switchRole = (newRole: 'USER' | 'VENDOR' | 'ADMIN') => {
    let email = 'user@explorebharat.local';
    let name = 'Aarav Sharma';
    if (newRole === 'VENDOR') {
      email = 'vendor@explorebharat.local';
      name = 'Heritage Haveli Stays';
    } else if (newRole === 'ADMIN') {
      email = 'admin@explorebharat.local';
      name = 'Tourism Officer India';
    }
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      name,
      email,
    }));
    Alert.alert('Account Switched', `Active Session: ${name} (${newRole})`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{currentUser.role}</Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{currentUser.tripsCompleted}</Text>
          <Text style={styles.statLabel}>Trips Done</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{currentUser.savedPlacesCount}</Text>
          <Text style={styles.statLabel}>Saved Places</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>States Visited</Text>
        </View>
      </View>

      {/* Role Switcher Demo Bar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Demo Switcher</Text>
        <Text style={styles.sectionSub}>Test application permissions in real-time</Text>
        <View style={styles.roleBtnRow}>
          <TouchableOpacity
            style={[styles.roleBtn, currentUser.role === 'USER' && styles.roleBtnActive]}
            onPress={() => switchRole('USER')}
          >
            <Text style={[styles.roleBtnText, currentUser.role === 'USER' && styles.roleBtnTextActive]}>
              Traveler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, currentUser.role === 'VENDOR' && styles.roleBtnActive]}
            onPress={() => switchRole('VENDOR')}
          >
            <Text style={[styles.roleBtnText, currentUser.role === 'VENDOR' && styles.roleBtnTextActive]}>
              Vendor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, currentUser.role === 'ADMIN' && styles.roleBtnActive]}
            onPress={() => switchRole('ADMIN')}
          >
            <Text style={[styles.roleBtnText, currentUser.role === 'ADMIN' && styles.roleBtnTextActive]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Preference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred Language (भाषा)</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langChip,
                currentUser.preferredLanguage === lang.code && styles.langChipActive,
              ]}
              onPress={() => setCurrentUser(prev => ({ ...prev, preferredLanguage: lang.code }))}
            >
              <Text
                style={[
                  styles.langChipText,
                  currentUser.preferredLanguage === lang.code && styles.langChipTextActive,
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Push Booking Reminders</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? '#f97316' : '#f4f3f4'}
            trackColor={{ false: '#d1d5db', true: '#fed7aa' }}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Offline Ticket Storage</Text>
          <Switch
            value={offlineSync}
            onValueChange={setOfflineSync}
            thumbColor={offlineSync ? '#f97316' : '#f4f3f4'}
            trackColor={{ false: '#d1d5db', true: '#fed7aa' }}
          />
        </View>
      </View>

      {/* Government & Tourism Credentials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verified Government Integration</Text>
        <View style={styles.govBadge}>
          <Text style={styles.govText}>🇮🇳 Integrated with ASI Heritage Passes & Incredible India API Gateway</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => Alert.alert('Logged Out', 'You have been logged out of ExploreBharat.')}
      >
        <Text style={styles.logoutText}>Sign Out of ExploreBharat</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <MobileLogo size="md" showTagline={true} />
      </View>
      <Text style={styles.versionText}>ExploreBharat Mobile v1.0.0 • Production Build</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#c2410c',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  roleBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  roleBtnActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  roleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  roleBtnTextActive: {
    color: '#ffffff',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  langChipActive: {
    backgroundColor: '#ffedd5',
    borderColor: '#f97316',
  },
  langChipText: {
    fontSize: 13,
    color: '#475569',
  },
  langChipTextActive: {
    color: '#c2410c',
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 14,
    color: '#334155',
  },
  govBadge: {
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  govText: {
    fontSize: 12,
    color: '#065f46',
    lineHeight: 18,
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
  },
});
