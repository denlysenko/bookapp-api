export class LogDto {
  readonly userId: string;
  readonly action: string;
  readonly book: {
    title: string;
    author: string;
  };
}
