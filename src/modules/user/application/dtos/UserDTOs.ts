export interface RegisteringUser {
  username: string;
  email: string;
  password: string;
  profile: {
    age: number;
    height: number;
    weight: number;
    gender: "Male" | "Female";
    fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
    goal: "Losing Weight" | "Building Muscle" | "Maintenance";
    budgetLevel: "Economic" | "Average" | "High";
  };
}

export interface ResponsingUser {
  id: string;
  username: string;
  email: string;
  profile: {
    age: number;
    goal: string;
    bmi: number; // ممكن نحسبه واحنا بنرجع الداتا
  };
}
