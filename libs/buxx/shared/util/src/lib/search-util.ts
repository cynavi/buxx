import { BUXX_TABLE, BuxxRow, BuxxSchema, Database, QueryCriteria, TransactionDB } from '@buxx/shared/model';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';
import { supabase } from '@buxx/shared/app-config';
import { format } from 'date-fns';
import { SearchComponent } from "@buxx/shared/ui/search";
import { ModalController } from "@ionic/angular";

export class SearchUtil {

  static async openSearchModal(modalController: ModalController, searchCriteria: QueryCriteria | null): Promise<QueryCriteria> {
    let queryCriteria: QueryCriteria;
    const modal: HTMLIonModalElement = await modalController.create({
      component: SearchComponent,
      componentProps: { searchCriteria },
      backdropDismiss: false,
      animated: true
    });
    modal.present().then();
    await modal.onWillDismiss().then(overlayEventDetail => {
      if (overlayEventDetail.role === 'confirm' && overlayEventDetail.data?.searchCriteria) {
        queryCriteria = overlayEventDetail.data.searchCriteria;
      }
    });
    return new Promise(resolve => resolve(queryCriteria));
  }

  static buildQuery(criteria: QueryCriteria, range: { to: number, from: number }):
    PostgrestFilterBuilder<BuxxSchema, BuxxRow, TransactionDB.ResultSet[], unknown> {
    let query: PostgrestFilterBuilder<BuxxSchema, BuxxRow, TransactionDB.ResultSet[], unknown> = supabase
      .from(BUXX_TABLE)
      .select('id, name, completed_date, amount, tags, details');
    if (criteria.name) {
      query = query.ilike('name', `%${criteria.name}%`);
    }
    if (criteria.amount?.value && criteria.amount?.op) {
      switch (criteria.amount.op) {
        case '<':
          query = query.lt('amount', criteria.amount.value);
          break;
        case '<=':
          query = query.lte('amount', criteria.amount.value);
          break;
        case '==':
          query = query.eq('amount', criteria.amount.value);
          break;
        case '!=':
          query = query.neq('amount', criteria.amount.value);
          break;
        case '>':
          query = query.gt('amount', criteria.amount.value);
          break;
        case '>=':
          query = query.gte('amount', criteria.amount.value);
          break;
        default:
          throw Error('Invalid operator on amount.');
      }
    }
    if (criteria.tags?.length == 1) {
      query = query.or(`tags.cs.{${criteria.tags![0]}}`);
    } else if (criteria.tags && criteria.tags?.length > 1) {
      let postgREST = `tags.cs.{${criteria.tags![0]}},or(`;
      for (let i = 1; i < criteria.tags.length; i++) {
        postgREST += `tags.cs.{${criteria.tags[i]}}`;
        if (criteria.tags!.length - 1 > criteria.tags!.indexOf(criteria.tags[i])) {
          postgREST += ',';
        }
      }
      postgREST += ')';
      query = query.or(postgREST);
    }

    if (criteria.fromDate && criteria.toDate) {
      query = query.gte('completed_date', format(criteria.fromDate, 'yyyy-MM-dd'))
        .lte('completed_date', format(criteria.toDate, 'yyyy-MM-dd HH:mm:ss'));
    }
    query = query.range(range.from, range.to);
    return query;
  }
}
