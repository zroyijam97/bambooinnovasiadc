import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initializeNotifications(): Promise<string | null> {
    try {
      // Check if device supports notifications
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return null;
      }

      // Get existing permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      // Get the token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });

      this.expoPushToken = token.data;

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Store token locally
      await AsyncStorage.setItem('@bamboo_push_token', token.data);

      // Send token to backend
      await this.registerTokenWithBackend(token.data);

      return token.data;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  async registerTokenWithBackend(token: string): Promise<void> {
    try {
      await apiClient.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceId: Device.osInternalBuildId || 'unknown',
      });
    } catch (error) {
      console.error('Error registering push token with backend:', error);
    }
  }

  async unregisterToken(): Promise<void> {
    try {
      if (this.expoPushToken) {
        await apiClient.post('/notifications/unregister-token', {
          token: this.expoPushToken,
        });
      }
      
      await AsyncStorage.removeItem('@bamboo_push_token');
      this.expoPushToken = null;
    } catch (error) {
      console.error('Error unregistering push token:', error);
    }
  }

  async scheduleLocalNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: trigger || null,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      throw error;
    }
  }

  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  }

  // Notification listeners
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  removeNotificationSubscription(subscription: Notifications.Subscription): void {
    Notifications.removeNotificationSubscription(subscription);
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();

// Initialize notifications
export const initializeNotifications = async (): Promise<void> => {
  try {
    await notificationService.initializeNotifications();
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
  }
};

export default notificationService;