export class EmailEvent<T> {
  name: string;

  recipient: string;

  metaData: T;
}
