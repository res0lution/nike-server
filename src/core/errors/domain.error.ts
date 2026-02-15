export class DomainError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public meta?: Record<string, unknown>,
  ) {
    super(message);
  }
}
