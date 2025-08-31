import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 0,
    borderRadius: 12,
    height: 60,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    paddingHorizontal: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  text2: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  successToast: {
    backgroundColor: '#F0FDF4',
    borderLeftColor: '#10B981',
    borderLeftWidth: 4,
  },
  errorToast: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: '#EF4444',
    borderLeftWidth: 4,
  },
  infoToast: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#3B82F6',
    borderLeftWidth: 4,
  },
  warningToast: {
    backgroundColor: '#FFFBEB',
    borderLeftColor: '#F59E0B',
    borderLeftWidth: 4,
  },
  successText: {
    color: '#065F46',
  },
  errorText: {
    color: '#991B1B',
  },
  infoText: {
    color: '#1E40AF',
  },
  warningText: {
    color: '#92400E',
  },
});

const CustomToast = ({ type, text1, text2, ...props }: any) => {
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'info':
        return styles.infoToast;
      case 'warning':
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'success':
        return styles.successText;
      case 'error':
        return styles.errorText;
      case 'info':
        return styles.infoText;
      case 'warning':
        return styles.warningText;
      default:
        return styles.infoText;
    }
  };

  return (
    <View style={[styles.base, getToastStyle()]}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getIconName() as any} 
            size={24} 
            color={getIconColor()} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text1, getTextStyle()]}>
            {text1}
          </Text>
          {text2 && (
            <Text style={[styles.text2, getTextStyle()]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (props) => <CustomToast {...props} type="success" />,
  error: (props) => <CustomToast {...props} type="error" />,
  info: (props) => <CustomToast {...props} type="info" />,
  warning: (props) => <CustomToast {...props} type="warning" />,
};

// Helper functions for showing toasts
export const showSuccessToast = (title: string, message?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
  });
};

export const showErrorToast = (title: string, message?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
  });
};

export const showInfoToast = (title: string, message?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
  });
};

export const showWarningToast = (title: string, message?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'warning',
    text1: title,
    text2: message,
    visibilityTime: 3500,
    autoHide: true,
    topOffset: 60,
  });
};