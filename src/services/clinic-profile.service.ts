import { Injectable, signal } from '@angular/core';

export interface ClinicProfile {
  name: string;
  address: string;
  phone: string;
  managerName: string;
  headPhysician: string;
  logoUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClinicProfileService {
  private readonly STORAGE_KEY = 'clinic_profile';

  private loadFromStorage(): ClinicProfile {
    try {
      const savedProfileJson = localStorage.getItem(this.STORAGE_KEY);
      if (savedProfileJson) {
        return JSON.parse(savedProfileJson);
      }
    } catch (e) {
      console.error('Failed to load clinic profile from storage', e);
    }
    // Return default if nothing is stored
    return {
      name: 'City Imaging Center',
      address: '123 Health St, Medville, USA',
      phone: '(555) 123-4567',
      managerName: 'Alex Johnson',
      headPhysician: 'Dr. Evelyn Reed',
      logoUrl: 'https://via.placeholder.com/150x50.png?text=Clinic+Logo'
    };
  }
  
  private saveToStorage(profile: ClinicProfile) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving clinic profile to storage', e);
    }
  }

  profile = signal<ClinicProfile>(this.loadFromStorage());

  updateProfile(newProfile: ClinicProfile) {
    this.profile.set(newProfile);
    this.saveToStorage(newProfile);
  }
}
