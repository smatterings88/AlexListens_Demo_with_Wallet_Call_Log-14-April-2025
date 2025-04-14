import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { MinutesWallet } from './types';

const DEFAULT_MINUTES = 7;

export async function initializeMinutesWallet(userId: string): Promise<MinutesWallet> {
  const walletRef = doc(db, 'minutesWallets', userId);
  
  try {
    const wallet = await getDoc(walletRef);
    
    if (!wallet.exists()) {
      const newWallet: MinutesWallet = {
        userId,
        minutes: DEFAULT_MINUTES,
        lastUpdated: serverTimestamp(),
      };
      
      await setDoc(walletRef, newWallet);
      
      // Return a version with a real Timestamp for the client
      return {
        ...newWallet,
        lastUpdated: Timestamp.now(),
      };
    }
    
    return wallet.data() as MinutesWallet;
  } catch (error) {
    console.error('Error initializing minutes wallet:', error);
    throw error;
  }
}

export async function getMinutesWallet(userId: string): Promise<MinutesWallet | null> {
  try {
    const walletRef = doc(db, 'minutesWallets', userId);
    const wallet = await getDoc(walletRef);
    
    if (!wallet.exists()) {
      return null;
    }
    
    return wallet.data() as MinutesWallet;
  } catch (error) {
    console.error('Error getting minutes wallet:', error);
    throw error;
  }
}

export async function updateMinutesWallet(userId: string, minutesUsed: number): Promise<void> {
  try {
    const walletRef = doc(db, 'minutesWallets', userId);
    const wallet = await getDoc(walletRef);
    
    if (!wallet.exists()) {
      throw new Error('Minutes wallet not found');
    }
    
    const currentMinutes = wallet.data().minutes;
    const newMinutes = Math.max(0, currentMinutes - minutesUsed);
    
    await updateDoc(walletRef, {
      minutes: newMinutes,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating minutes wallet:', error);
    throw error;
  }
}
