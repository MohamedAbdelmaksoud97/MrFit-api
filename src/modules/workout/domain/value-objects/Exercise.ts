export class Exercise {
  constructor(
    public readonly name: string,
    public readonly muscleGroup: string,
    public readonly sets: number,
    public readonly reps: string,
    public isCompleted: boolean = false,
    public readonly restSeconds: number,
    public readonly notes?: string,
  ) {}
}
