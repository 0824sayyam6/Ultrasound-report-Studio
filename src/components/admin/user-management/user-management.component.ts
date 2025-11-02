import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClinicProfileService } from '../../../services/clinic-profile.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class UserManagementComponent {
  private fb = inject(FormBuilder);
  private clinicProfileService = inject(ClinicProfileService);

  profile = this.clinicProfileService.profile;
  
  profileForm = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    managerName: ['', Validators.required],
    headPhysician: ['', Validators.required],
    logoUrl: ['', Validators.required],
  });

  saveStatus = signal<'idle' | 'saving' | 'success'>('idle');

  constructor() {
    this.profileForm.patchValue(this.profile());
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saveStatus.set('saving');
    const updatedProfile = this.profileForm.getRawValue();

    // Simulate async operation
    setTimeout(() => {
      this.clinicProfileService.updateProfile(updatedProfile as any);
      this.saveStatus.set('success');

      setTimeout(() => {
        this.saveStatus.set('idle');
      }, 2000);
    }, 750);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.profileForm.patchValue({
          logoUrl: e.target.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  }

  get logoUrl() {
    return this.profileForm.get('logoUrl');
  }
}