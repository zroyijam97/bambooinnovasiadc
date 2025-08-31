import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { NFCData, NFCWriteResult, NFCReadResult } from '@bamboo/shared';

interface NFCContextType {
  isNFCSupported: boolean;
  isNFCEnabled: boolean;
  isReading: boolean;
  isWriting: boolean;
  checkNFCStatus: () => Promise<void>;
  readNFC: () => Promise<NFCReadResult>;
  writeNFC: (data: NFCData) => Promise<NFCWriteResult>;
  stopNFC: () => Promise<void>;
}

const NFCContext = createContext<NFCContextType | undefined>(undefined);

export const useNFC = () => {
  const context = useContext(NFCContext);
  if (!context) {
    throw new Error('useNFC must be used within an NFCProvider');
  }
  return context;
};

interface NFCProviderProps {
  children: ReactNode;
}

export const NFCProvider: React.FC<NFCProviderProps> = ({ children }) => {
  const [isNFCSupported, setIsNFCSupported] = useState(false);
  const [isNFCEnabled, setIsNFCEnabled] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    checkNFCStatus();
  }, []);

  const checkNFCStatus = async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const supported = await NfcManager.isSupported();
        setIsNFCSupported(supported);

        if (supported) {
          const enabled = await NfcManager.isEnabled();
          setIsNFCEnabled(enabled);
        }
      }
    } catch (error) {
      console.warn('Error checking NFC status:', error);
      setIsNFCSupported(false);
      setIsNFCEnabled(false);
    }
  };

  const readNFC = async (): Promise<NFCReadResult> => {
    if (!isNFCSupported) {
      return {
        success: false,
        error: 'NFC is not supported on this device',
      };
    }

    if (!isNFCEnabled) {
      return {
        success: false,
        error: 'NFC is not enabled. Please enable NFC in device settings.',
      };
    }

    setIsReading(true);

    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Read NDEF message
      const tag = await NfcManager.getTag();
      
      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];
        
        if (ndefRecord.type && ndefRecord.payload) {
          // Convert payload to string
          const payload = String.fromCharCode.apply(null, Array.from(ndefRecord.payload));
          
          // Extract URL from payload (skip language code if present)
          const url = payload.startsWith('\u0002en') ? payload.substring(3) : payload;
          
          return {
            success: true,
            data: {
              url: url,
              type: 'url',
            },
          };
        }
      }

      return {
        success: false,
        error: 'No valid NDEF data found on the tag',
      };
    } catch (error) {
      console.error('NFC read error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read NFC tag',
      };
    } finally {
      setIsReading(false);
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.warn('Error canceling NFC request:', error);
      }
    }
  };

  const writeNFC = async (data: NFCData): Promise<NFCWriteResult> => {
    if (!isNFCSupported) {
      return {
        success: false,
        error: 'NFC is not supported on this device',
      };
    }

    if (!isNFCEnabled) {
      return {
        success: false,
        error: 'NFC is not enabled. Please enable NFC in device settings.',
      };
    }

    setIsWriting(true);

    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Create NDEF record
      const bytes = Ndef.encodeMessage([
        Ndef.uriRecord(data.url),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: 'Failed to encode NDEF message',
        };
      }
    } catch (error) {
      console.error('NFC write error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to write to NFC tag',
      };
    } finally {
      setIsWriting(false);
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.warn('Error canceling NFC request:', error);
      }
    }
  };

  const stopNFC = async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
      setIsReading(false);
      setIsWriting(false);
    } catch (error) {
      console.warn('Error stopping NFC:', error);
    }
  };

  const value: NFCContextType = {
    isNFCSupported,
    isNFCEnabled,
    isReading,
    isWriting,
    checkNFCStatus,
    readNFC,
    writeNFC,
    stopNFC,
  };

  return (
    <NFCContext.Provider value={value}>
      {children}
    </NFCContext.Provider>
  );
};