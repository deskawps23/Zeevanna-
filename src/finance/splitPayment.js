export function splitPayment({ grossAmount, partnerRate = 0.8, payrollRate = 0.05 }) {
  const gross = Number(grossAmount) || 0;
  const partnerShare = Math.round(gross * partnerRate);
  const payrollShare = Math.round(gross * payrollRate);
  const platformFee = Math.max(0, gross - partnerShare - payrollShare);

  return {
    customerBill: gross,
    partnerShare,
    payrollShare,
    platformFee
  };
}
