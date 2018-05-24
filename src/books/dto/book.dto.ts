export class BookDto {
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly paid?: boolean;
  readonly price?: number;
}
