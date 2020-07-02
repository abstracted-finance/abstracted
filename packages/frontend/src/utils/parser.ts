import { Lego } from "../containers/legos/useLegos";

interface LegoResults {
  valid: boolean;
  legos: Lego[];
}

export const parseLegos = (legos: Lego[]): LegoResults => {
  // Empty legos is valid legos
  if (legos.length === 0) {
    return {
      valid: true,
      legos: [],
    };
  }

  // Go through each entry and check if the nested flashloans
  // are placed correctly
  for (const [i, { id }] of legos.entries()) {
    // If our id starts with flashloan start
    if (id.startsWith("flashloan-start")) {
      const cleanId = id.replace("flashloan-start-", "");
      const endingId = `flashloan-end-${cleanId}`;
      const endingIndex = legos.findIndex((x) => x.id === endingId);

      // If no flashloan ending found within, then its invalid
      if (endingIndex === -1) {
        return {
          valid: false,
          legos: [],
        };
      }

      // Checks to see if inner block is valid
      const parsed = parseLegos(legos.slice(i + 1, endingIndex));

      if (!parsed.valid) {
        return {
          valid: false,
          legos: [],
        };
      }
    }
  }

  return {
    valid: true,
    legos,
  };
};
