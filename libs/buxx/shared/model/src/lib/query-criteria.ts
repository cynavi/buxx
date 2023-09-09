export type QueryCriteria = {
  name?: string;
  fromDate: Date;
  toDate: Date;
  tags?: string[];
  amount?: {
    value: number;
    op: AmountOP;
  };
}

export type AmountOP = '<' | '<=' | '==' | '!=' | '>' | '>=';
