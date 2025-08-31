import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorToast, showSuccessToast } from '../../config/toast';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    position: '',
    website: '',
  });

  const handleSave = async () => {
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessToast('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showErrorToast('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const renderField = (label: string, value: string, key: keyof typeof formData, placeholder?: string) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.onSurface}
          autoCapitalize={key === 'email' ? 'none' : 'words'}
          keyboardType={key === 'email' ? 'email-address' : key === 'phone' ? 'phone-pad' : 'default'}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not set'}</Text>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      paddingBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    editButton: {
      padding: 8,
    },
    profileSection: {
      backgroundColor: colors.surface,
      margin: 24,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    fieldValue: {
      fontSize: 16,
      color: colors.onSurface,
      paddingVertical: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      margin: 24,
      marginTop: 0,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    settingsSection: {
      backgroundColor: colors.surface,
      margin: 24,
      marginTop: 0,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastSettingItem: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.onSurface,
      marginTop: 2,
    },
    logoutButton: {
      backgroundColor: colors.error,
      margin: 24,
      marginTop: 0,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
            name={isEditing ? 'close' : 'pencil'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderField('Name', formData.name, 'name')}
          {renderField('Email', formData.email, 'email')}
          {renderField('Phone', formData.phone, 'phone', '+1 234 567 8900')}
          {renderField('Company', formData.company, 'company')}
          {renderField('Position', formData.position, 'position')}
          {renderField('Website', formData.website, 'website', 'https://example.com')}
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={24}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>
                {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? 'white' : colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons
              name="notifications"
              size={24}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>
                Manage notification preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.onSurface}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Privacy')}
          >
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy & Security</Text>
              <Text style={styles.settingSubtitle}>
                Manage your privacy settings
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.onSurface}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.lastSettingItem]}
            onPress={() => navigation.navigate('Help')}
          >
            <Ionicons
              name="help-circle"
              size={24}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>
                Get help and contact support
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;