import { Amount, BuxxFilterBuilder, Query, TRANSACTIONS } from '../model/buxx.model';
import { format } from 'date-fns';
import { supabase } from '../../../supabase/supabase';

export const buildFilter = (query: Query, userId: string): BuxxFilterBuilder => {
  const { criteria, paginate } = query;
  let filter: BuxxFilterBuilder = supabase
    .from(TRANSACTIONS)
    .select('id, name, details, date, isExpense, userId, amount', { count: 'exact' });
  if (criteria?.name) {
    filter = filter.ilike('name', `%${criteria?.name}%`);
  }
  if (criteria?.amount?.value && criteria?.amount?.op) {
    buildAmountFilter(filter, criteria?.amount);
  }
  if (criteria?.date && criteria.date.start && criteria.date.end) {
    buildDateRangeFilter(filter, criteria.date.start, criteria.date.end);
  }
  filter = filter.eq('userId', userId)
    .range(paginate?.range.start!, paginate?.range.end!)
    .order('amount', { ascending: false });
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
    .lte('date', format(toDate, 'yyyy-MM-dd'));
  return query;
};
