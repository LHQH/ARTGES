export const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,50}$/;
export const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const siretRegex = /^[0-9]{14}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export const phoneRegex = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
export const adressRegex = /^[a-zA-Z0-9À-ÿ\s,'\-]{5,100}$/;
export const socialReasonRegex = /^[a-zA-Z0-9À-ÿ\s,'\-]{5,100}$/;
export const postCodeRegex = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;