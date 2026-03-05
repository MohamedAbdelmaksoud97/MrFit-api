export class Exercise {
  constructor(
    public readonly name: string,
    public readonly muscleGroup: string,
    public readonly sets: number,
    public readonly reps: string, // "10-12" or "To Failure"
    public readonly restSeconds: number,
    public readonly notes?: string,
    public isCompleted: boolean = false,
  ) {}
}
