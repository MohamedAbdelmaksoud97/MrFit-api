// src/modules/nutrition/domain/interfaces/IAiGenerator.ts
import { User } from "../../../user/domain/entities/User";

export interface IAiGenerator {
  /**
   * Generates a raw nutrition plan based on user metrics
   * @param user The User entity containing profile (weight, goal, budget)
   * @returns A raw object matching the schema structure
   */
  execute(user: User): Promise<any>;
}
