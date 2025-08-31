import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNFC } from '../../contexts/NFCContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorToast, showSuccessToast, showInfoToast } from '../../config/toast';
// Define DigitalCard type locally since it's not in shared types
interface DigitalCard {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  avatar?: string;
  qrCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCard, setLastScannedCard] = useState<DigitalCard | null>(null);
  const [nfcStatus, setNfcStatus] = useState<string>('checking');

  const { checkNFCStatus, readNFC, writeNFC, stopNFC, isNFCSupported, isNFCEnabled } = useNFC();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    checkNFCAvailability();
  }, []);

  const checkNFCAvailability = async () => {
    try {
      await checkNFCStatus();
      // Check NFC status from context state
      if (isNFCSupported && isNFCEnabled) {
        setNfcStatus('enabled');
      } else if (isNFCSupported && !isNFCEnabled) {
        setNfcStatus('disabled');
        showInfoToast('NFC Status', 'NFC is disabled');
      } else {
        setNfcStatus('not_supported');
        showInfoToast('NFC Status', 'NFC is not supported');
      }
    } catch (error) {
      setNfcStatus('error');
      showErrorToast('Error', 'Failed to check NFC status');
    }
  };

  const handleScanCard = async () => {
    if (nfcStatus !== 'enabled') {
      showErrorToast('NFC Not Available', 'Please enable NFC to scan cards');
      return;
    }

    setIsScanning(true);
    showInfoToast('Ready to Scan', 'Hold your device near an NFC card');

    try {
      const result = await readNFC();
      if (result.success && result.data) {
        // For now, just show the URL that was scanned
        showSuccessToast('NFC Scanned!', `URL: ${result.data.url}`);
        // TODO: Fetch card data from the URL
      } else {
        showErrorToast('Scan Failed', result.error || 'Could not read card data');
      }
    } catch (error) {
      showErrorToast('Error', 'Failed to scan NFC card');
    } finally {
      setIsScanning(false);
    }
  };

  const handleWriteCard = async () => {
    if (nfcStatus !== 'enabled') {
      showErrorToast('NFC Not Available', 'Please enable NFC to write cards');
      return;
    }

    if (!user) {
      showErrorToast('Error', 'Please log in to write your card');
      return;
    }

    Alert.alert(
      'Write Your Card',
      'This will write your digital business card to an NFC tag. Make sure you have a blank NFC tag ready.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: writeUserCard },
      ]
    );
  };

  const writeUserCard = async () => {
    if (!user) return;

    setIsScanning(true);
    showInfoToast('Ready to Write', 'Hold your device near a blank NFC tag');

    try {
      const cardData: DigitalCard = {
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        phone: '',
        company: '',
        position: '',
        website: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        avatar: '',
        qrCode: '', // Will be generated on backend
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await writeNFC({ url: `https://app.bamboo.com/card/${user.id}`, type: 'url' });
      if (result.success) {
        showSuccessToast('Success!', 'Your card has been written to the NFC tag');
      } else {
        showErrorToast('Write Failed', result.error || 'Could not write card data');
      }
    } catch (error) {
      showErrorToast('Error', 'Failed to write NFC card');
    } finally {
      setIsScanning(false);
    }
  };

  const handleStopScanning = () => {
    stopNFC();
    setIsScanning(false);
    showInfoToast('Stopped', 'NFC scanning stopped');
  };

  const getNFCStatusColor = () => {
    switch (nfcStatus) {
      case 'enabled':
        return '#4CAF50';
      case 'disabled':
        return '#FF9800';
      case 'not_supported':
        return '#F44336';
      default:
        return colors.onSurface;
    }
  };

  const getNFCStatusText = () => {
    switch (nfcStatus) {
      case 'enabled':
        return 'NFC Ready';
      case 'disabled':
        return 'NFC Disabled';
      case 'not_supported':
        return 'NFC Not Supported';
      case 'checking':
        return 'Checking NFC...';
      default:
        return 'NFC Error';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      paddingBottom: 16,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.onSurface,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 16,
      marginHorizontal: 24,
      marginBottom: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    statusText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    actionsContainer: {
      padding: 24,
      paddingTop: 0,
    },
    actionButton: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.accent,
    },
    disabledButton: {
      opacity: 0.5,
    },
    actionIcon: {
      marginRight: 16,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 14,
      color: colors.onSurface,
    },
    primaryButtonText: {
      color: 'white',
    },
    secondaryButtonText: {
      color: 'white',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
    },
    cardContainer: {
      backgroundColor: colors.surface,
      margin: 24,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    cardInfo: {
      marginBottom: 8,
    },
    cardLabel: {
      fontSize: 14,
      color: colors.onSurface,
      marginBottom: 2,
    },
    cardValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.name || 'User'}!
          </Text>
          <Text style={styles.subtitle}>
            Manage your digital business cards
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getNFCStatusColor() },
            ]}
          />
          <Text style={styles.statusText}>{getNFCStatusText()}</Text>
        </View>

        <View style={styles.actionsContainer}>
          {isScanning ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleStopScanning}
            >
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" />
                <Text style={[styles.loadingText, styles.secondaryButtonText]}>
                  Scanning... Tap to stop
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.primaryButton,
                  nfcStatus !== 'enabled' && styles.disabledButton,
                ]}
                onPress={handleScanCard}
                disabled={nfcStatus !== 'enabled'}
              >
                <Ionicons
                  name="scan"
                  size={24}
                  color="white"
                  style={styles.actionIcon}
                />
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, styles.primaryButtonText]}>
                    Scan NFC Card
                  </Text>
                  <Text style={[styles.actionDescription, styles.primaryButtonText]}>
                    Read a digital business card from NFC
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.secondaryButton,
                  nfcStatus !== 'enabled' && styles.disabledButton,
                ]}
                onPress={handleWriteCard}
                disabled={nfcStatus !== 'enabled'}
              >
                <Ionicons
                  name="create"
                  size={24}
                  color="white"
                  style={styles.actionIcon}
                />
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, styles.secondaryButtonText]}>
                    Write My Card
                  </Text>
                  <Text style={[styles.actionDescription, styles.secondaryButtonText]}>
                    Write your card to a blank NFC tag
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Cards')}
          >
            <Ionicons
              name="card"
              size={24}
              color={colors.primary}
              style={styles.actionIcon}
            />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>My Cards</Text>
              <Text style={styles.actionDescription}>
                View and manage your digital cards
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons
              name="person"
              size={24}
              color={colors.primary}
              style={styles.actionIcon}
            />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Edit Profile</Text>
              <Text style={styles.actionDescription}>
                Update your contact information
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {lastScannedCard && (
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Last Scanned Card</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Name</Text>
              <Text style={styles.cardValue}>{lastScannedCard.name}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Email</Text>
              <Text style={styles.cardValue}>{lastScannedCard.email}</Text>
            </View>
            {lastScannedCard.phone && (
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Phone</Text>
                <Text style={styles.cardValue}>{lastScannedCard.phone}</Text>
              </View>
            )}
            {lastScannedCard.company && (
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Company</Text>
                <Text style={styles.cardValue}>{lastScannedCard.company}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;