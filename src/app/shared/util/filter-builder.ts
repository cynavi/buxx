import { Amount, BuxxFilterBuilder, Paginate, Query, TRANSACTIONS } from '../model/buxx.model';
import { format } from 'date-fns';
import { supabase } from '../../../supabase/supabase';

export const buildFilter = (query: Query, userId: string): BuxxFilterBuilder => {
  let filter: BuxxFilterBuilder = supabase
    .from(TRANSACTIONS)
    .select('id, name, details, date, isExpense, userId, amount', { count: 'exact' });
  if (query.name) {
    filter = filter.ilike('name', `%${query.name}%`);
  }
  if (query.amount?.value && query.amount?.op) {
    buildAmountFilter(filter, query.amount);
  }
  if (query.fromDate && query.toDate) {
    buildDateRangeFilter(filter, query.fromDate, query.toDate);
  }
  filter = filter.eq('userId', userId);
  buildRangeFilter(filter, query.paginate);
  return filter;
};

const buildAmountFilter = (query: BuxxFilterBuilder, amount: Amount): BuxxFilterBuilder => {
  switch (amount.op) {
    case '<':
      query = query.lt('amount', amount.value);
      break;
    case '<=':
      query = query.lte('amount', amount.value);
      break;
    case '==':
      query = query.eq('amount', amount.value);
      break;
    case '!=':
      query = query.neq('amount', amount.value);
      break;
    case '>':
      query = query.gt('amount', amount.value);
      break;
    case '>=':
      query = query.gte('amount', amount.value);
      break;
    default:
      throw Error('Invalid operator on amount.');
  }
  return query;
};

const buildDateRangeFilter = (query: BuxxFilterBuilder, fromDate: Date, toDate: Date): BuxxFilterBuilder => {
  query = query.gte('date', format(fromDate, 'yyyy-MM-dd'))
    .lte('date', format(toDate, 'yyyy-MM-dd HH:mm:ss'));
  return query;
};

const buildRangeFilter = (filter: BuxxFilterBuilder, paginate: Paginate): BuxxFilterBuilder => {
  let start: number, end: number;
  if (paginate.isNext) {
    start = paginate.pointer;
    end = paginate.pointer + paginate.pageSize - 1;
  } else {
    start = paginate.pointer - 2 * paginate.pageSize;
    end = paginate.pointer - paginate.pageSize - 1;
  }
  filter = filter.range(start, end);
  return filter;
};
