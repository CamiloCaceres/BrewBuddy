export const getCurrentStageName = (batchStatus: string) => {
  switch (batchStatus) {
    case "pending":
      return "Batch Created";
    case "firstFermentation":
      return "First Fermentation (F1)";
    case "secondFermentation":
      return "Second Fermentation (F2)";
    case "completed":
      return "Completed";
    case "discarded":
      return "Discarded";
    default:
      return "Unknown";
  }
};
// Computes the next stage button name based on the current stage of fermentation.
export const getNextStageName = (batchStatus: string) => {
  switch (batchStatus) {
    case "pending":
      return "Start First Fermentation";
    case "firstFermentation":
      return "Start Second Fermentation";
    case "secondFermentation":
      return "Complete Fermentation";
    default:
      return "Unknown Stage";
  }
};

export const calculateExpectedEndDate = (startDate: Date, fermentationDays: number) => {
  const expectedEndDate = new Date(startDate);
  expectedEndDate.setDate(startDate.getDate() + fermentationDays);
  return expectedEndDate;
};
