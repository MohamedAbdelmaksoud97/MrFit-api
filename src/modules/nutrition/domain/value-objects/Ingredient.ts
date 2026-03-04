export class Ingredient {
  constructor(
    public readonly item: string,
    public readonly amount: string,
    public readonly isOptional: boolean = false,
  ) {}
}
