// Test card configurations for different scenarios
export const TEST_CARDS = {
  // Network Gateway Cards
  NETWORK_NON_3DS: {
    number: "4093191766216474",
    name: "Network Non-3DS",
    expMonth: "12",
    expYear: "2025",
    cvv: "123",
    holderName: "John Doe",
    gateway: "Network",
    type: "non-3ds"
  },
  
  NETWORK_3DS: {
    number: "4111111111111111",
    name: "Network 3DS",
    expMonth: "12", 
    expYear: "2025",
    cvv: "123",
    holderName: "John Doe",
    gateway: "Network",
    type: "3ds"
  },

  // Checkout Gateway Cards
  CHECKOUT_NON_3DS: {
    number: "4093191766216474",
    name: "Checkout Non-3DS",
    expMonth: "12",
    expYear: "2025", 
    cvv: "123",
    holderName: "John Doe",
    gateway: "Checkout",
    type: "non-3ds"
  },

  CHECKOUT_3DS: {
    number: "4242424242424242",
    name: "Checkout 3DS",
    expMonth: "12",
    expYear: "2025",
    cvv: "123", 
    holderName: "John Doe",
    gateway: "Checkout",
    type: "3ds"
  }
};

// Helper function to get card by key
export const getTestCard = (cardKey) => {
  return TEST_CARDS[cardKey] || TEST_CARDS.NETWORK_3DS; // Default fallback
};

// Get all available card options for UI
export const getCardOptions = () => {
  return Object.entries(TEST_CARDS).map(([key, card]) => ({
    value: key,
    label: `${card.name} (${card.number.slice(-4)})`,
    card: card
  }));
};