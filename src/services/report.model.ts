export interface Patient {
  name: string;
  dob: string;
  patientId: string;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Study {
  examType: string;
  bodyPart: string;
  studyDate: string;
  referringPhysician: string;
}

export interface UltrasoundReport {
  id: string; // To uniquely identify reports
  status: 'draft' | 'submitted';
  lastSaved: string | null;
  patient: Patient;
  study: Study;
  findings: string;
  impression: string;
  technique: string;
  comparison: string;
  recommendations: string;
}
