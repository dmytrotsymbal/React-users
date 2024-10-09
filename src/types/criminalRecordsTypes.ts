export enum SecurityLevelEnum {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Maximum = "Maximum",
}

export type Prison = {
  prisonID: number;
  prisonName?: string;
  location?: string;
  capacity?: number;
  securityLevel?: SecurityLevelEnum;
};

export type CriminalRecords = {
  criminalRecordID: number;
  userID: string;
  article: string;
  convictionDate: string;
  releaseDate?: string | null;
  sentence: string;
  caseDetailsURL?: string | null;
  details: string;
  prison: Prison;
};

export type CrimeDTO = {
  criminalRecordID: number;
  userID: string;
  article: string;
  convictionDate: string;
  releaseDate?: string | null;
  sentence: string;
  caseDetailsURL?: string | null;
  details: string;
  prisonID: number;
};
