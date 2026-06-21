export const runSimulation = async (scenarioIds: string[]): Promise<{ withoutAi: number; withAi: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Base times
      let withoutAi = 25;
      let withAi = 15;
      
      // Modify based on scenarios to show dynamic calculation
      if (scenarioIds.includes('add-vehicles')) {
        withoutAi += 10;
        withAi += 3;
      }
      if (scenarioIds.includes('close-junction')) {
        withoutAi += 15;
        withAi += 5;
      }
      if (scenarioIds.includes('heavy-rain')) {
        withoutAi += 8;
        withAi += 4;
      }
      
      resolve({ withoutAi, withAi });
    }, 1200); // 1.2s delay to feel like a heavy simulation
  });
};
