export const getStatusColor = (batchStatus: string) => {
    switch (batchStatus) {
      case "pending":
        return "yellow";
      case "firstFermentation":
        return "orange";
      case "secondFermentation":
        return "blue";
      case "completed":
        return "green";
      case "discarded":
        return "red";
      default:
        return "gray";
    }
  };
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