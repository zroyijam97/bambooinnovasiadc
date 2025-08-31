import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorToast } from '../../config/toast';

interface DigitalCard {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

interface CardsScreenProps {
  navigation: any;
}

const CardsScreen: React.FC<CardsScreenProps> = ({ navigation }) => {
  const [cards, setCards] = useState<DigitalCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { colors } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      // Mock data for demonstration
      const mockCards: DigitalCard[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          company: 'Tech Corp',
          position: 'Software Engineer',
          isActive: true,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@design.com',
          phone: '+1 234 567 8901',
          company: 'Design Studio',
          position: 'UI/UX Designer',
          isActive: true,
          createdAt: new Date('2024-01-10'),
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@startup.io',
          company: 'Startup Inc',
          position: 'CEO',
          isActive: true,
          createdAt: new Date('2024-01-05'),
        },
      ];

      setCards(mockCards);
    } catch (error) {
      showErrorToast('Error', 'Failed to load cards');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCards();
  };

  const renderCard = ({ item }: { item: DigitalCard }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate('CardDetail', { card: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardEmail}>{item.email}</Text>
          {item.company && (
            <Text style={styles.cardCompany}>
              {item.position ? `${item.position} at ` : ''}{item.company}
            </Text>
          )}
        </View>
        <View style={styles.cardActions}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.onSurface}
          />
        </View>
      </View>
      {item.phone && (
        <View style={styles.cardFooter}>
          <Ionicons name="call" size={16} color={colors.onSurface} />
          <Text style={styles.cardPhone}>{item.phone}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="card-outline" size={64} color={colors.onSurface} />
      <Text style={styles.emptyTitle}>No Cards Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start scanning NFC cards to build your collection
      </Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="scan" size={20} color="white" />
        <Text style={styles.scanButtonText}>Scan Your First Card</Text>
      </TouchableOpacity>
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
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.onSurface,
    },
    cardContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: 24,
      marginBottom: 16,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      marginRight: 16,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    cardInfo: {
      flex: 1,
    },
    cardName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    cardEmail: {
      fontSize: 14,
      color: colors.onSurface,
      marginBottom: 2,
    },
    cardCompany: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
    cardActions: {
      padding: 4,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    cardPhone: {
      fontSize: 14,
      color: colors.onSurface,
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 24,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: 32,
    },
    scanButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    scanButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cards</Text>
        <Text style={styles.subtitle}>
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} collected
        </Text>
      </View>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CardsScreen;