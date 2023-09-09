import { Database, QueryCriteria, Transaction, TransactionDB } from '@buxx/shared/model';
import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { environment, supabase } from '@buxx/shared/app-config';
import { from, map, Observable, Subject, switchMap } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';
import { QueryBuilderUtil, ToastUtil } from '@buxx/shared/util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface IncomeState {
	incomes: Transaction[];
	loaded: boolean;
	error: string | null;
	searchCriteria: QueryCriteria | null;
}

@Injectable()
export class IncomeStore {

	range: { from: number, to: number } = {from: 0, to: environment.pageSize};
	infiniteScroll$: Subject<InfiniteScrollCustomEvent> = new Subject<InfiniteScrollCustomEvent>();
	save$: Subject<TransactionDB.Save> = new Subject<TransactionDB.Save>();
	update$: Subject<TransactionDB.Update> = new Subject<TransactionDB.Update>();
	delete$: Subject<TransactionDB.Delete> = new Subject<TransactionDB.Delete>();
	fetch$: Subject<QueryCriteria> = new Subject<QueryCriteria>();
	queryProp: Signal<PostgrestFilterBuilder<
		Database['public'],
		Database['public']['Tables']['transactions']['Row'],
		TransactionDB.ResultSet[], unknown
	> | null> = computed(() => {
		// TODO: Get range from signal??
		this.range = {from: 0, to: environment.pageSize};
		return this.searchCriteria()
			? QueryBuilderUtil.buildQuery(this.searchCriteria()!, this.range)
			: null
	});
	private state: WritableSignal<IncomeState> = signal<IncomeState>({
		incomes: [],
		loaded: false,
		error: null,
		searchCriteria: null
	});
	incomes: Signal<Transaction[]> = computed(() => this.state().incomes);
	loaded: Signal<boolean> = computed(() => this.state().loaded);
	error: Signal<string | null> = computed(() => this.state().error);
	searchCriteria: Signal<QueryCriteria | null> = computed(() => this.state().searchCriteria);

	constructor() {
		this.handleInfiniteScrollEvent();
		this.handleSaveEvent();
		this.handleUpdateEvent();
		this.handleDeleteEvent();
		this.handleFetchEvent();
	}

	private handleInfiniteScrollEvent(): void {
		this.infiniteScroll$.pipe(
			takeUntilDestroyed(),
			switchMap((event: InfiniteScrollCustomEvent) => {
				this.range = {from: this.range.to++, to: this.range.to++ + environment.pageSize};
				return this.getIncomes().pipe(
					map((incomes: Transaction[]) => ({incomes, event}))
				);
			})
		).subscribe({
			next: (data: {
				incomes: Transaction[],
				event: InfiniteScrollCustomEvent
			}) => {
				this.state.mutate(state => state.incomes.push(...data.incomes));
				data.event.target.complete().then();
			},
			error: err => {
				console.error(err);
				this.state.update(state => ({...state, error: err}));
			}
		});
	}

	private handleSaveEvent(): void {
		this.save$.pipe(
			takeUntilDestroyed(),
			switchMap((expense: TransactionDB.Save) => from(this.saveIncome(expense)))
		).subscribe({
			next: () => ToastUtil.open(`Income has been saved.`),
			error: err => {
				console.error(err);
				this.state.update(state => ({...state, error: err}));
			}
		});
	}

	private handleFetchEvent(): void {
		this.fetch$.pipe(
			takeUntilDestroyed(),
			switchMap((criteria: QueryCriteria) => {
					this.state.update(state => ({...state, searchCriteria: criteria, loaded: false}));
					return this.getIncomes();
				}
			)
		).subscribe({
			next: (incomes: Transaction[]) => {
				this.state.update(state => ({
					...state,
					incomes: incomes as Transaction[],
					loaded: true
				}));
			},
			error: err => {
				console.error(err);
				this.state.update(state => ({...state, error: err}));
			}
		});
	}

	private handleUpdateEvent(): void {
		this.update$.pipe(
			takeUntilDestroyed(),
			switchMap((expense: TransactionDB.Update) => from(this.updateIncome(expense)).pipe(
				map((response: PostgrestSingleResponse<unknown>) => ({response, expense}))
			))
		).subscribe(data => {
			const {response, expense} = data;
			if (response.status === 204) {
				ToastUtil.open(`Income has been updated.`).then();
			} else if (response.error) {
				this.state.update(state => ({...state, error: response.error.message}));
			}
		});
	}

	private handleDeleteEvent(): void {
		this.delete$.pipe(
			takeUntilDestroyed(),
			switchMap(id => from(this.deleteIncome(id)).pipe(
				map((response: PostgrestSingleResponse<unknown>) => ({response, id}))
			))
		).subscribe(data => {
			const {response, id} = data;
			if (response.status === 204) {
				ToastUtil.open(`Income has been deleted.`).then();
			} else if (response.error) {
				this.state.update(state => ({...state, error: response.error.message}));
			}
		});
	}

	private getIncomes(): Observable<Transaction[]> {
		return from(this.queryProp()!.eq('is_expense', false))
			.pipe(map(response => {
				const incomes: Transaction[] = [];
				response?.data?.forEach((entry: TransactionDB.ResultSet) => incomes.push({
						id: entry.id,
						name: entry.name,
						amount: entry.amount,
						date: entry.completed_date,
						details: entry.details,
						tags: entry.tags
					})
				);
				return incomes;
			}));
	}

	private saveIncome(income: TransactionDB.Save):
		PostgrestFilterBuilder<Database['public'], Database['public']['Tables']['transactions']['Row'], null, unknown> {
		return supabase.from('transactions').insert(income);
	}

	private updateIncome(income: TransactionDB.Update):
		PostgrestFilterBuilder<Database['public'], Database['public']['Tables']['transactions']['Row'], null, unknown> {
		return supabase.from('transactions').update(income).eq('id', income.id);
	}

	private deleteIncome(id: TransactionDB.Delete):
		PostgrestFilterBuilder<Database['public'], Database['public']['Tables']['transactions']['Row'], null, unknown> {
		return supabase.from('transactions').delete().eq('id', id);
	}
}
