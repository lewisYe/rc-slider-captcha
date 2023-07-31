export interface Track {
  x: number;
  y: number;
  t: number;
}

export interface ImageBound {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface CaptchaData {
  id: string;
  bgImage: string;
  tpImage: string;
}

export interface VerifyParams {
  id: string;
  bgImageWidth: number;
  bgImageHeight: number;
  startTime: number;
  endTime: number;
  trackPointList: Track[];
}

export interface SliderCaptchaType {
  genCaptcha: () => CaptchaData;
  verifyCaptcha: (params: VerifyParams) => boolean;
  onSuccess?: (id: string) => void;
  tipText: string;
  hasRefresh: boolean;
}


export interface ClassNamesType { 
  [key: string]: boolean;
}
